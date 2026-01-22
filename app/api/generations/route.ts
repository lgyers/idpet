import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

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

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const [records, total] = await Promise.all([
      prisma.generationRecord.findMany({
        where: { userId: userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        include: {
          template: {
            select: {
              name: true,
              category: true,
            },
          },
        },
      }),
      prisma.generationRecord.count({
        where: { userId: userId },
      }),
    ]);

    const generations = records.map((r) => ({
      id: r.id,
      originalImageUrl: r.uploadedPhotoUrl,
      generatedImageUrl: r.resultImageUrl,
      templateId: r.templateId,
      templateName: r.template?.name || '',
      prompt: r.generatedPrompt,
      createdAt: r.createdAt,
      status: r.status || 'completed',
    }));

    return NextResponse.json({
      success: true,
      generations,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });

  } catch (error) {
    console.error('Failed to fetch generations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch generations' },
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
    const uploadedPhotoUrl = body.uploadedPhotoUrl || body.originalImageUrl;
    const resultImageUrl = body.resultImageUrl || body.generatedImageUrl;
    const { templateId } = body;
    const generatedPrompt = body.generatedPrompt || body.prompt || '';
    const quotaUsed = body.quotaUsed || body.quotaConsumed || 1;

    if (!uploadedPhotoUrl || !templateId || !resultImageUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let useTemplateId = templateId;
    let tpl = await prisma.sceneTemplate.findUnique({ where: { id: templateId } });
    if (!tpl) {
      tpl = await prisma.sceneTemplate.create({
        data: {
          category: 'document',
          name: body.templateName || '自定义模板',
          description: body.templateName || '自定义',
          thumbnail: '',
          basePrompt: generatedPrompt || '',
        },
      });
      useTemplateId = tpl.id;
    }

    const record = await prisma.generationRecord.create({
      data: {
        userId: userId,
        uploadedPhotoUrl,
        templateId: useTemplateId,
        resultImageUrl,
        generatedPrompt,
        quotaUsed,
      },
      include: {
        template: {
          select: {
            name: true,
            category: true,
          },
        },
      },
    });

    const generation = {
      id: record.id,
      originalImageUrl: record.uploadedPhotoUrl,
      generatedImageUrl: record.resultImageUrl,
      templateId: record.templateId,
      templateName: record.template?.name || '',
      prompt: record.generatedPrompt,
      createdAt: record.createdAt,
      status: 'completed',
    };

    return NextResponse.json({
      success: true,
      generation,
    });

  } catch (error) {
    console.error('Failed to create generation record:', error);
    return NextResponse.json(
      { error: 'Failed to create generation record' },
      { status: 500 }
    );
  }
}
