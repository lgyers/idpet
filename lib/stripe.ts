/**
 * Stripe 客户端配置
 */
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.warn('STRIPE_SECRET_KEY environment variable is not set. Using dummy key for build.');
}

export const stripe = new Stripe(stripeSecretKey || 'sk_test_dummy', {
  apiVersion: '2025-02-24.acacia' as Stripe.StripeConfig["apiVersion"],
});

/**
 * 创建或获取 Stripe 客户
 */
export async function getOrCreateStripeCustomer(userId: string, email: string, name?: string) {
  try {
    // 查询现有客户
    const customers = await stripe.customers.list({
      email,
      limit: 1,
    });

    if (customers.data.length > 0) {
      return customers.data[0];
    }

    // 创建新客户
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        userId,
      },
    });

    return customer;
  } catch (error) {
    console.error('Failed to get or create Stripe customer:', error);
    throw error;
  }
}

/**
 * 创建订阅
 */
export async function createSubscription(customerId: string, priceId: string) {
  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [
        {
          price: priceId,
        },
      ],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });

    return subscription;
  } catch (error) {
    console.error('Failed to create subscription:', error);
    throw error;
  }
}

/**
 * 获取订阅详情
 */
export async function getSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Failed to get subscription:', error);
    throw error;
  }
}

/**
 * 取消订阅
 */
export async function cancelSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.cancel(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Failed to cancel subscription:', error);
    throw error;
  }
}

/**
 * 验证 Webhook 签名
 */
export function verifyWebhookSignature(body: string, signature: string, secret: string) {
  try {
    const event = stripe.webhooks.constructEvent(body, signature, secret);
    return event;
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    throw error;
  }
}
