import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { generatePetPhoto, createPrediction, getPrediction } from '@/lib/replicate';
import { uploadGeneratedPhoto } from '@/lib/blob';

export const runtime = 'nodejs';
export const maxDuration = 300; // 5分钟超时

type GenerateProvider = 'replicate' | 'nano_banana_standard' | 'nano_banana_pro';
type ProImageSize = '1K' | '2K' | '4K';
type ProAspectRatio = '1:1' | '4:3' | '3:4' | '16:9' | '9:16';

function extractBase64ImageFromContent(content: string): { mimeType: string; base64: string } | null {
  const match = content.match(/data:(image\/[a-zA-Z0-9.+-]+);base64,([A-Za-z0-9+/=]+)/);
  if (!match) return null;
  return { mimeType: match[1], base64: match[2] };
}

async function fetchAsBase64(url: string): Promise<{ mimeType: string; base64: string; size: number }> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch image: ${res.status} ${res.statusText}`);
  }
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const mimeType = res.headers.get('content-type') || 'image/jpeg';
  return { mimeType, base64: buffer.toString('base64'), size: buffer.length };
}

async function nanoBananaStandardEdit(params: {
  apiKey: string;
  baseUrl: string;
  prompt: string;
  imageUrl: string;
}): Promise<{ mimeType: string; base64: string }> {
  const { apiKey, baseUrl, prompt, imageUrl } = params;
  const response = await fetch(`${baseUrl}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gemini-2.5-flash-image',
      stream: false,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: imageUrl } },
          ],
        },
      ],
    }),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message = data?.error?.message || data?.error || response.statusText;
    throw new Error(message);
  }

  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== 'string') {
    throw new Error('Invalid response format');
  }

  const extracted = extractBase64ImageFromContent(content);
  if (!extracted) {
    throw new Error('No base64 image found in response');
  }
  return extracted;
}

async function nanoBananaProEdit(params: {
  apiKey: string;
  baseUrl: string;
  prompt: string;
  imageUrl: string;
  imageSize: ProImageSize;
  aspectRatio: ProAspectRatio;
}): Promise<{ mimeType: string; base64: string }> {
  const { apiKey, baseUrl, prompt, imageUrl, imageSize, aspectRatio } = params;
  const input = await fetchAsBase64(imageUrl);
  if (input.size > 10 * 1024 * 1024) {
    throw new Error('File size exceeds 10MB limit');
  }

  const response = await fetch(
    `${baseUrl}/v1beta/models/gemini-3-pro-image-preview:generateContent`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              { inline_data: { mime_type: input.mimeType, data: input.base64 } },
            ],
          },
        ],
        generationConfig: {
          responseModalities: ['IMAGE'],
          imageConfig: {
            aspectRatio,
            imageSize,
          },
        },
      }),
    }
  );

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message = data?.error?.message || data?.error || response.statusText;
    throw new Error(message);
  }

  const base64 = data?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  const mimeType = data?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.mimeType || 'image/png';

  if (typeof base64 !== 'string') {
    throw new Error('Invalid response format');
  }

  return { mimeType, base64 };
}

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
    const userId = (session?.user as { id?: string } | undefined)?.id;

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      uploadedImageUrl,
      templateId,
      customPrompt,
      templateName,
      templateDescription,
      templateCategory,
      templateThumbnail,
      templatePreview,
      resolution = 'medium',
      provider: providerRaw,
      proImageSize: proImageSizeRaw,
      proAspectRatio: proAspectRatioRaw,
    } = body;

    if (!uploadedImageUrl || !templateId) {
      return NextResponse.json(
        { error: 'Missing required fields: uploadedImageUrl, templateId' },
        { status: 400 }
      );
    }

    const normalizedUploadedImageUrl = new URL(uploadedImageUrl, request.nextUrl.origin).toString();

    const provider: GenerateProvider =
      providerRaw === 'nano_banana_standard' || providerRaw === 'nano_banana_pro' || providerRaw === 'replicate'
        ? providerRaw
        : 'replicate';
    const proImageSize: ProImageSize =
      proImageSizeRaw === '1K' || proImageSizeRaw === '2K' || proImageSizeRaw === '4K' ? proImageSizeRaw : '2K';
    const proAspectRatio: ProAspectRatio =
      proAspectRatioRaw === '1:1' ||
      proAspectRatioRaw === '4:3' ||
      proAspectRatioRaw === '3:4' ||
      proAspectRatioRaw === '16:9' ||
      proAspectRatioRaw === '9:16'
        ? proAspectRatioRaw
        : '1:1';

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

    if (provider === 'nano_banana_pro' && subscription.tier === 'free') {
      return NextResponse.json(
        { error: 'Banana Pro 为付费功能，请先升级订阅' },
        { status: 402 }
      );
    }

    if (provider === 'nano_banana_standard') {
      const used = await prisma.generationRecord.count({
        where: {
          userId,
          resultImageUrl: {
            contains: 'nano_banana_standard',
          },
        },
      });
      if (used >= 2) {
        return NextResponse.json(
          { error: 'Nano Banana 标准版免费次数已用完（2次），请使用 Banana Pro（付费）' },
          { status: 402 }
        );
      }
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
    let template = await prisma.sceneTemplate.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      const name =
        typeof templateName === 'string' && templateName.trim().length > 0 ? templateName.trim() : '自定义模板';
      const description =
        typeof templateDescription === 'string' && templateDescription.trim().length > 0
          ? templateDescription.trim()
          : '用户自定义模板';
      const category =
        typeof templateCategory === 'string' && templateCategory.trim().length > 0 ? templateCategory.trim() : 'custom';
      const thumbnail =
        typeof templateThumbnail === 'string' && templateThumbnail.trim().length > 0
          ? templateThumbnail.trim()
          : typeof templatePreview === 'string' && templatePreview.trim().length > 0
            ? templatePreview.trim()
            : '/assets/gallery-model.jpg';
      const basePrompt = typeof customPrompt === 'string' && customPrompt.trim().length > 0 ? customPrompt.trim() : '';

      if (!basePrompt) {
        return NextResponse.json({ error: 'Template not found and no customPrompt provided' }, { status: 400 });
      }

      try {
        template = await prisma.sceneTemplate.create({
          data: {
            id: String(templateId),
            category,
            name,
            description,
            thumbnail,
            basePrompt,
          },
        });
      } catch {
        template = await prisma.sceneTemplate.findUnique({
          where: { id: templateId },
        });
      }

      if (!template) {
        return NextResponse.json({ error: 'Template not found' }, { status: 404 });
      }
    }

    // 准备提示词
    const finalPrompt = customPrompt || template.basePrompt;

    // 返回立即响应，但在后台继续处理
    // 为了演示，这里我们会等待生成完成（实际生产环境应该异步处理）
    let generatedImageUrl: string | null = null;
    let error: string | null = null;

    try {
      if (provider === 'nano_banana_standard' || provider === 'nano_banana_pro') {
        const apiKey = process.env.LAOZHANG_API_KEY;
        const baseUrl = (process.env.LAOZHANG_API_BASE_URL || 'https://api.laozhang.ai').replace(/\/$/, '');
        if (!apiKey) {
          throw new Error('LAOZHANG_API_KEY environment variable is not set');
        }

        const edited =
          provider === 'nano_banana_standard'
            ? await nanoBananaStandardEdit({
                apiKey,
                baseUrl,
                prompt: finalPrompt,
                imageUrl: normalizedUploadedImageUrl,
              })
            : await nanoBananaProEdit({
                apiKey,
                baseUrl,
                prompt: finalPrompt,
                imageUrl: normalizedUploadedImageUrl,
                imageSize: proImageSize,
                aspectRatio: proAspectRatio,
              });

        const buffer = Buffer.from(edited.base64, 'base64');
        const filename =
          provider === 'nano_banana_standard'
            ? 'nano_banana_standard.png'
            : `nano_banana_pro_${proImageSize}_${String(proAspectRatio).replace(':', 'x')}.png`;
        generatedImageUrl = await uploadGeneratedPhoto(userId, buffer, filename, edited.mimeType);
      } else {
        const result = await generatePetPhoto({
          imageUrl: normalizedUploadedImageUrl,
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
    const userId = (session?.user as { id?: string } | undefined)?.id;
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
