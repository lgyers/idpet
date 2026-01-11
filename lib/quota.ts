import { prisma } from '@/lib/db';

export interface QuotaInfo {
  tier: string;
  quotaMonth: number;
  quotaUsed: number;
  quotaRemaining: number;
  quotaResetDate: Date;
}

export async function checkUserQuota(userId: string): Promise<QuotaInfo> {
  try {
    const subscription = await prisma.userSubscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    const quotaUsed = await prisma.generationRecord.count({
      where: {
        userId,
        createdAt: {
          gte: subscription.quotaResetDate,
        },
      },
    });

    const quotaRemaining = Math.max(0, subscription.quotaMonth - quotaUsed);

    return {
      tier: subscription.tier,
      quotaMonth: subscription.quotaMonth,
      quotaUsed,
      quotaRemaining,
      quotaResetDate: subscription.quotaResetDate,
    };
  } catch (error) {
    console.error('Failed to check user quota:', error);
    throw error;
  }
}

export async function consumeUserQuota(userId: string, amount: number = 1): Promise<QuotaInfo> {
  try {
    const quotaInfo = await checkUserQuota(userId);

    if (quotaInfo.quotaRemaining < amount) {
      throw new Error('Insufficient quota');
    }

    return quotaInfo;
  } catch (error) {
    console.error('Failed to consume user quota:', error);
    throw error;
  }
}

export async function resetMonthlyQuota(): Promise<void> {
  try {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    await prisma.userSubscription.updateMany({
      where: {
        quotaResetDate: {
          lte: now,
        },
      },
      data: {
        quotaResetDate: nextMonth,
      },
    });
  } catch (error) {
    console.error('Failed to reset monthly quota:', error);
    throw error;
  }
}