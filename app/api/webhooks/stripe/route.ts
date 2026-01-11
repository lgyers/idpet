/**
 * Stripe Webhook Handler
 * 处理 Stripe 订阅事件
 */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyWebhookSignature } from '@/lib/stripe';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature') || '';
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    // 验证 webhook 签名
    let event;
    try {
      event = verifyWebhookSignature(body, signature, webhookSecret);
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // 处理不同的事件类型
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionCreatedOrUpdated(event.data.object as any);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as any);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as any);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

/**
 * 处理订阅创建或更新事件
 */
async function handleSubscriptionCreatedOrUpdated(subscription: any) {
  try {
    const customerId = subscription.customer;
    const status = subscription.status;
    const subscriptionId = subscription.id;

    // 查找用户
    const userSubscription = await prisma.userSubscription.findFirst({
      where: { stripeCustomerId: customerId },
      include: { user: true },
    });

    if (!userSubscription) {
      console.warn(`User subscription not found for customer: ${customerId}`);
      return;
    }

    // 确定订阅层级
    let tier = 'free';
    const priceId = subscription.items.data[0]?.price.id;

    if (process.env.STRIPE_PRICE_BASIC === priceId) {
      tier = 'basic';
    } else if (process.env.STRIPE_PRICE_PRO === priceId) {
      tier = 'pro';
    }

    // 确定配额
    const quotaMap = {
      free: 5,
      basic: 50,
      pro: 1000,
    };

    // 更新订阅信息
    await prisma.userSubscription.update({
      where: { id: userSubscription.id },
      data: {
        tier,
        stripeSubscriptionId: subscriptionId,
        quotaMonth: quotaMap[tier as keyof typeof quotaMap],
        expiresAt: status === 'active' ? null : new Date(),
      },
    });

    console.log(`Subscription updated for user ${userSubscription.userId}: tier=${tier}`);
  } catch (error) {
    console.error('Error handling subscription created/updated:', error);
  }
}

/**
 * 处理订阅删除事件
 */
async function handleSubscriptionDeleted(subscription: any) {
  try {
    const customerId = subscription.customer;

    // 查找并更新用户订阅为免费
    const userSubscription = await prisma.userSubscription.findFirst({
      where: { stripeCustomerId: customerId },
    });

    if (userSubscription) {
      await prisma.userSubscription.update({
        where: { id: userSubscription.id },
        data: {
          tier: 'free',
          quotaMonth: 5,
          stripeSubscriptionId: null,
          expiresAt: new Date(),
        },
      });

      console.log(`Subscription cancelled for user ${userSubscription.userId}`);
    }
  } catch (error) {
    console.error('Error handling subscription deleted:', error);
  }
}

/**
 * 处理发票支付成功事件
 */
async function handleInvoicePaymentSucceeded(invoice: any) {
  try {
    const customerId = invoice.customer;
    const subscriptionId = invoice.subscription;

    console.log(`Invoice paid for subscription: ${subscriptionId}`);
    // 可以在这里发送确认邮件或更新其他数据
  } catch (error) {
    console.error('Error handling invoice payment succeeded:', error);
  }
}
