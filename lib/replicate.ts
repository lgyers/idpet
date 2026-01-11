/**
 * Replicate API 客户端
 * 用于调用 SDXL + ControlNet 模型生成图片
 */

const REPLICATE_API_URL = 'https://api.replicate.com/v1';

interface ReplicateInput {
  image?: string; // 上传的宠物照片 URL
  prompt: string; // 生成提示词
  negative_prompt?: string; // 反面提示词
  num_outputs?: number; // 生成数量，默认1
  guidance_scale?: number; // 引导强度，默认7.5
  num_inference_steps?: number; // 推理步数，默认50
  seed?: number; // 随机种子
  width?: number; // 输出宽度
  height?: number; // 输出高度
}

interface ReplicatePrediction {
  id: string;
  status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  input: ReplicateInput;
  output?: string[];
  error?: string;
  created_at: string;
  started_at?: string;
  completed_at?: string;
  metrics?: {
    predict_time?: number;
  };
}

/**
 * 创建生成任务
 */
export async function createPrediction(input: ReplicateInput): Promise<ReplicatePrediction> {
  const apiToken = process.env.REPLICATE_API_TOKEN;
  if (!apiToken) {
    throw new Error('REPLICATE_API_TOKEN environment variable is not set');
  }

  const response = await fetch(`${REPLICATE_API_URL}/predictions`, {
    method: 'POST',
    headers: {
      'Authorization': `Token ${apiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: 'a4a8d91cb03cda6c33e938f6b6e49eaa593c14020c9ef477aae27302b08d5275', // SDXL v1.0
      input,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Replicate API error: ${error.detail || response.statusText}`);
  }

  return response.json();
}

/**
 * 获取预测结果
 */
export async function getPrediction(predictionId: string): Promise<ReplicatePrediction> {
  const apiToken = process.env.REPLICATE_API_TOKEN;
  if (!apiToken) {
    throw new Error('REPLICATE_API_TOKEN environment variable is not set');
  }

  const response = await fetch(`${REPLICATE_API_URL}/predictions/${predictionId}`, {
    headers: {
      'Authorization': `Token ${apiToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch prediction: ${response.statusText}`);
  }

  return response.json();
}

/**
 * 等待预测完成（带超时）
 */
export async function waitForPrediction(
  predictionId: string,
  maxWaitTime: number = 300000 // 5分钟
): Promise<ReplicatePrediction> {
  const apiToken = process.env.REPLICATE_API_TOKEN;
  if (!apiToken) {
    throw new Error('REPLICATE_API_TOKEN environment variable is not set');
  }

  const startTime = Date.now();
  const pollInterval = 1000; // 每秒检查一次

  while (Date.now() - startTime < maxWaitTime) {
    const prediction = await getPrediction(predictionId);

    if (prediction.status === 'succeeded') {
      return prediction;
    }

    if (prediction.status === 'failed') {
      throw new Error(`Generation failed: ${prediction.error}`);
    }

    if (prediction.status === 'canceled') {
      throw new Error('Generation was canceled');
    }

    // 等待后继续轮询
    await new Promise(resolve => setTimeout(resolve, pollInterval));
  }

  throw new Error('Generation timeout');
}

/**
 * 生成宠物创意照片
 */
export async function generatePetPhoto(params: {
  imageUrl: string; // 宠物照片 URL
  templatePrompt: string; // 场景模板提示词
  petType?: string; // 宠物类型（如：狗、猫）
  style?: string; // 风格
  quality?: string; // 质量等级
  resolution?: 'low' | 'medium' | 'high'; // 分辨率
}): Promise<{ success: boolean; imageUrl?: string; error?: string; prompt?: string }> {
  try {
    const {
      imageUrl,
      templatePrompt,
      petType = '宠物',
      style = 'realistic',
      quality = 'high',
      resolution = 'medium',
    } = params;

    // 构建完整提示词
    const basePrompt = templatePrompt;
    const styleModifier = style === 'realistic' ? '逼真的，专业摄影，高清' : `${style} 风格`;
    const qualityModifier =
      quality === 'high' ? '细节清晰，4K质量，精致光影' : '标准质量';

    const finalPrompt = `${basePrompt}, ${petType}, ${styleModifier}, ${qualityModifier}`;

    // 确定分辨率
    const resolutionMap = {
      low: { width: 512, height: 512 },
      medium: { width: 768, height: 768 },
      high: { width: 1024, height: 1024 },
    };
    const { width, height } = resolutionMap[resolution];

    // 创建预测
    const prediction = await createPrediction({
      image: imageUrl,
      prompt: finalPrompt,
      negative_prompt: 'blurry, low quality, distorted, ugly, bad, deformed',
      guidance_scale: 7.5,
      num_inference_steps: 50,
      width,
      height,
      num_outputs: 1,
    });

    // 等待完成
    const result = await waitForPrediction(prediction.id);

    if (result.status === 'succeeded' && result.output && result.output.length > 0) {
      return {
        success: true,
        imageUrl: result.output[0],
        prompt: finalPrompt,
      };
    }

    return {
      success: false,
      error: 'No output generated',
    };
  } catch (error) {
    console.error('Error generating pet photo:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
