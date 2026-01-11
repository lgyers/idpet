/**
 * 创建支付 Session
 */
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { stripe, getOrCreateStripeCustomer } from '@/lib/stripe';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email || !(session.user as any).id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;

    const body = await request.json();
    const { priceId, successUrl = '/dashboard', cancelUrl = '/pricing' } = body;

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true },
    });

    if (!user || !user.email) {
      return NextResponse.json(
        { error: 'User not found or email missing' },
        { status: 404 }
      );
    }

    // 获取或创建 Stripe 客户
    const customer = await getOrCreateStripeCustomer(user.id, user.email, user.name || undefined);

    // 更新用户订阅信息
    const userSubscription = await prisma.userSubscription.findUnique({
      where: { userId: user.id },
    });

    if (!userSubscription) {
      await prisma.userSubscription.create({
        data: {
          userId: user.id,
          stripeCustomerId: customer.id,
          tier: 'free',
          quotaMonth: 5,
        },
      });
    } else if (!userSubscription.stripeCustomerId) {
      await prisma.userSubscription.update({
        where: { userId: user.id },
        data: { stripeCustomerId: customer.id },
      });
    }

    // 创建 checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customer.id,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXTAUTH_URL}${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}${cancelUrl}`,
      metadata: {
        userId: user.id,
      },
    });

    return NextResponse.json({
      success: true,
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });
  } catch (error) {
    console.error('Failed to create checkout session:', error);
    return NextResponse.json(
      {
        error: 'Failed to create checkout session',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
