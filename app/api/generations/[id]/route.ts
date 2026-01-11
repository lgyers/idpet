import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    const userId = (session?.user as any)?.id;
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { error: 'Invalid id' },
        { status: 400 }
      );
    }

    const record = await prisma.generationRecord.findUnique({
      where: { id },
      select: { id: true, userId: true },
    });

    if (!record || record.userId !== userId) {
      return NextResponse.json(
        { error: 'Not found' },
        { status: 404 }
      );
    }

    await prisma.generationRecord.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete generation:', error);
    return NextResponse.json(
      { error: 'Failed to delete generation' },
      { status: 500 }
    );
  }
}

