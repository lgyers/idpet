import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { generatePetPhoto, createPrediction, getPrediction } from '@/lib/replicate';

export const runtime = 'nodejs';
export const maxDuration = 300; // 5分钟超时

/**
 * POST /api/generate
 * 生成宠物创意照片
 *
 * Request body:
 * {
 *   uploadedImageUrl: string,      // 上传的宠物照片 URL
 *   templateId: string,             // 场景模板 ID
 *   customPrompt?: string,          // 自定义提示词（可选）
 *   resolution?: 'low' | 'medium' | 'high'  // 分辨率
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const userId = (session?.user as any)?.id;

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { uploadedImageUrl, templateId, customPrompt, resolution = 'medium' } = body;

    if (!uploadedImageUrl || !templateId) {
      return NextResponse.json(
        { error: 'Missing required fields: uploadedImageUrl, templateId' },
        { status: 400 }
      );
    }

    // 检查用户配额
    const subscription = await prisma.userSubscription.findUnique({
      where: { userId: userId },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: 'User subscription not found' },
        { status: 400 }
      );
    }

    // 检查是否有剩余配额
    const monthStart = new Date();
    monthStart.setDate(1);
    const monthStart_UTC = new Date(monthStart.toUTCString());

    const thisMonthCount = await prisma.generationRecord.count({
      where: {
        userId: userId,
        createdAt: {
          gte: monthStart_UTC,
        },
      },
    });

    const monthlyLimit =
      subscription.tier === 'free' ? 5 : subscription.tier === 'basic' ? 50 : 1000;

    if (thisMonthCount >= monthlyLimit) {
      return NextResponse.json(
        {
          error: 'Monthly quota exceeded',
          current: thisMonthCount,
          limit: monthlyLimit,
        },
        { status: 429 }
      );
    }

    // 获取模板
    const template = await prisma.sceneTemplate.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    // 准备提示词
    const finalPrompt = customPrompt || template.basePrompt;

    // 返回立即响应，但在后台继续处理
    // 为了演示，这里我们会等待生成完成（实际生产环境应该异步处理）
    let generatedImageUrl: string | null = null;
    let error: string | null = null;

    try {
      // 调用 Replicate API 生成图片
      const result = await generatePetPhoto({
        imageUrl: uploadedImageUrl,
        templatePrompt: finalPrompt,
        style: 'realistic',
        quality: 'high',
        resolution: resolution as 'low' | 'medium' | 'high',
      });

      if (result.success && result.imageUrl) {
        generatedImageUrl = result.imageUrl;
      } else {
        error = result.error || 'Generation failed';
      }
    } catch (err) {
      error = err instanceof Error ? err.message : 'Unknown error';
      console.error('Generation error:', err);
    }

    if (error) {
      return NextResponse.json(
        { error: `Generation failed: ${error}` },
        { status: 500 }
      );
    }

    if (!generatedImageUrl) {
      return NextResponse.json(
        { error: 'No image generated' },
        { status: 500 }
      );
    }

    // 保存生成记录
    const record = await prisma.generationRecord.create({
      data: {
        userId: userId,
        uploadedPhotoUrl: uploadedImageUrl,
        templateId,
        resultImageUrl: generatedImageUrl,
        generatedPrompt: finalPrompt,
        quotaUsed: 1,
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

    return NextResponse.json({
      success: true,
      generation: {
        id: record.id,
        originalImageUrl: record.uploadedPhotoUrl,
        generatedImageUrl: record.resultImageUrl,
        templateId: record.templateId,
        templateName: record.template?.name || '',
        prompt: record.generatedPrompt,
        createdAt: record.createdAt,
        status: 'completed',
      },
    });
  } catch (error) {
    console.error('Generate API error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate image',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/generate?predictionId=...
 * 获取生成预测状态
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const userId = (session?.user as any)?.id;
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const predictionId = searchParams.get('predictionId');

    if (!predictionId) {
      return NextResponse.json(
        { error: 'Missing predictionId parameter' },
        { status: 400 }
      );
    }

    try {
      const prediction = await getPrediction(predictionId);
      return NextResponse.json({
        success: true,
        prediction,
      });
    } catch (err) {
      return NextResponse.json(
        {
          error: 'Failed to get prediction',
          details: err instanceof Error ? err.message : 'Unknown error',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Get prediction error:', error);
    return NextResponse.json(
      { error: 'Failed to get prediction' },
      { status: 500 }
    );
  }
}
