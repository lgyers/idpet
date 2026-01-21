import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { checkUserQuota, consumeUserQuota } from '@/lib/quota';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const userId = (session?.user as { id?: string } | undefined)?.id;
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const quotaInfo = await checkUserQuota(userId);

    return NextResponse.json(quotaInfo);

  } catch (error) {
    console.error('Failed to fetch quota:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quota' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const userId = (session?.user as { id?: string } | undefined)?.id;
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { amount = 1 } = body;
    const operation = body.operation || body.action || 'consume';

    if (operation === 'check') {
      const quotaInfo = await checkUserQuota(userId);
      return NextResponse.json(quotaInfo);
    }

    if (operation === 'consume') {
      try {
        const result = await consumeUserQuota(userId, amount);
        return NextResponse.json(result);
      } catch (error) {
        return NextResponse.json(
          { error: error instanceof Error ? error.message : 'Failed to consume quota' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Invalid operation' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Failed to process quota operation:', error);
    return NextResponse.json(
      { error: 'Failed to process quota operation' },
      { status: 500 }
    );
  }
}
