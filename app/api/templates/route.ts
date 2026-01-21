import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const runtime = 'nodejs'

const allowedTemplateNames = new Set([
  '百天照',
  '蓝底证件照',
  '医生职业照',
  '学士服毕业照',
  '唐装',
  '白领西装照',
  '日系可爱风',
  '东方美学古韵风',
  '婚纱摄影',
  '金婚照',
  '漫威钢铁侠',
])

const fallbackTemplates = [
  {
    id: 'fallback-1',
    name: '百天照',
    description: '温柔童趣的百天纪念肖像',
    category: 'haimati',
    preview: '/assets/examples/haimati/baityanzhao/cat-siamese-v1.png',
    prompt:
      '百天照风格宠物肖像，婴儿百天纪念照氛围；可爱干净布景（奶油白/浅粉/浅蓝），柔光棚拍，浅景深，皮毛细节清晰；适度小道具（帽子/围兜/小毯子）但不遮挡脸部；保持宠物原始身份特征（脸型、毛色、花纹不变）；photorealistic，high quality；no text, no watermark, no logo, no extra limbs',
  },
  {
    id: 'fallback-2',
    name: '蓝底证件照',
    description: '标准证件照蓝色背景',
    category: 'document',
    preview: '/assets/examples/haimati/blue-id/cat-zhonghua-tianyuan-v1.png',
    prompt:
      '证件照风格宠物头像照，纯蓝背景，正面居中，头肩构图，光线均匀无阴影，细节清晰；保持宠物原始身份特征（脸型、毛色、花纹不变）；photorealistic；no text, no watermark, no logo, no extra limbs',
  },
  {
    id: 'fallback-3',
    name: '医生职业照',
    description: '白大褂与听诊器的职业肖像',
    category: 'professional',
    preview: '/assets/examples/haimati/doctor/cat-zhonghua-tianyuan-v1.png',
    prompt:
      '医生职业照风格宠物肖像；穿白大褂，佩戴听诊器，背景为干净明亮的医院/诊室虚化场景；专业棚拍布光（主光+轮廓光），眼神有高光；保持宠物原始身份特征（脸型、毛色、花纹不变）；photorealistic，high detail；no text, no watermark, no logo, no extra limbs',
  },
  {
    id: 'fallback-4',
    name: '学士服毕业照',
    description: '学士服与毕业氛围',
    category: 'professional',
    preview: '/assets/examples/haimati/graduation/cat-siamese-v1.png',
    prompt:
      '学士服毕业照风格宠物肖像；穿学士服与学位帽，背景为校园/毕业典礼虚化场景，色彩明快；棚拍质感，浅景深，皮毛细节清晰；保持宠物原始身份特征（脸型、毛色、花纹不变）；photorealistic，high quality；no text, no watermark, no logo, no extra limbs',
  },
  {
    id: 'fallback-5',
    name: '唐装',
    description: '传统唐装造型与喜庆氛围',
    category: 'culture',
    preview: '/assets/examples/haimati/tangzhuang/cat-ragdoll-v1.png',
    prompt:
      '唐装风格宠物肖像；穿精致唐装（立领、盘扣、织纹），配色典雅喜庆；背景为简洁中式元素（屏风/窗棂/灯笼虚化），暖色柔光，质感高级；保持宠物原始身份特征（脸型、毛色、花纹不变）；photorealistic；no text, no watermark, no logo, no extra limbs',
  },
  {
    id: 'fallback-6',
    name: '白领西装照',
    description: '商务正装的职业形象照',
    category: 'professional',
    preview: '/assets/examples/haimati/white-collar/cat-ragdoll-v1.png',
    prompt:
      '白领西装照风格宠物肖像；合身西装+衬衫+领带/领结，背景为干净商务灰/浅色渐变或写字楼虚化；棚拍布光，细节清晰，整体克制高级；保持宠物原始身份特征（脸型、毛色、花纹不变）；photorealistic，high quality；no text, no watermark, no logo, no extra limbs',
  },
  {
    id: 'fallback-7',
    name: '日系可爱风',
    description: '清新软萌的日系写真',
    category: 'culture',
    preview: '/assets/examples/haimati/japanese-kawaii/cat-siamese-v1.png',
    prompt:
      '日系可爱风宠物写真；清新低饱和配色，柔和自然光，少量可爱小道具点缀（小花、小背包、糖果色布景）；构图干净，浅景深，毛发细节清晰；保持宠物原始身份特征（脸型、毛色、花纹不变）；photorealistic；no text, no watermark, no logo, no extra limbs',
  },
  {
    id: 'fallback-8',
    name: '东方美学古韵风',
    description: '古韵留白与东方审美',
    category: 'culture',
    preview: '/assets/examples/haimati/oriental-aesthetic/cat-ragdoll-v1.png',
    prompt:
      '东方美学古韵风宠物肖像；含蓄留白构图，雅致色调（米白、墨色、黛青），柔和光线；背景可见淡雅山水/宣纸纹理/屏风虚化但不抢主体；保持宠物原始身份特征（脸型、毛色、花纹不变）；photorealistic，high detail；no text, no watermark, no logo, no extra limbs',
  },
  {
    id: 'fallback-9',
    name: '婚纱摄影',
    description: '浪漫婚礼氛围大片',
    category: 'haimati',
    preview: '/assets/examples/haimati/wedding/cat-ragdoll-v1.png',
    prompt:
      '婚纱摄影风格宠物写真；浪漫柔光，轻微逆光与轮廓光，背景为婚礼布景/花艺虚化；整体高级、干净、电影感；保持宠物原始身份特征（脸型、毛色、花纹不变）；photorealistic，high quality；no text, no watermark, no logo, no extra limbs',
  },
  {
    id: 'fallback-10',
    name: '金婚照',
    description: '金色纪念与温暖质感',
    category: 'haimati',
    preview: '/assets/examples/haimati/golden-wedding/cat-siamese-v1.png',
    prompt:
      '金婚照风格纪念肖像；温暖金色调，柔光棚拍，背景干净带轻微金色点缀（光斑/丝绒/花艺虚化）；氛围庄重温馨；保持宠物原始身份特征（脸型、毛色、花纹不变）；photorealistic；no text, no watermark, no logo, no extra limbs',
  },
  {
    id: 'fallback-11',
    name: '漫威钢铁侠',
    description: '科幻机甲英雄质感',
    category: 'haimati',
    preview: '/assets/examples/haimati/ironman/cat-zhonghua-tianyuan-v1.png',
    prompt:
      '漫威钢铁侠风格宠物肖像；穿钢铁侠机甲风格战衣，金红配色，金属质感强，科技光效与能量反应堆发光；背景为科幻城市/机库虚化，戏剧性光影；保持宠物原始身份特征（脸型、毛色、花纹不变）；cinematic, photorealistic, high detail；no text, no watermark, no logo, no extra limbs',
  },
] as const

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const category = url.searchParams.get('category') || undefined
    const templates = await prisma.sceneTemplate.findMany({
      where: category ? { category } : undefined,
      orderBy: { usageCount: 'desc' },
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        thumbnail: true,
        basePrompt: true,
      },
    })

    const mapped = templates
      .filter((t) => allowedTemplateNames.has(t.name))
      .map((t) => ({
        id: String(t.id),
        name: t.name,
        description: t.description,
        category: t.category,
        preview: t.thumbnail,
        prompt: t.basePrompt,
      }))
    const existingNames = new Set(mapped.map((t) => t.name))
    const extra = fallbackTemplates.filter(
      (t) =>
        allowedTemplateNames.has(t.name) &&
        (category ? t.category === category : true) &&
        !existingNames.has(t.name),
    )

    return NextResponse.json({
      success: true,
      templates: mapped.concat(extra),
    })
  } catch (error) {
    const url = new URL(request.url)
    const category = url.searchParams.get('category') || undefined
    const templates = fallbackTemplates.filter(
      (t) => allowedTemplateNames.has(t.name) && (category ? t.category === category : true),
    )
    return NextResponse.json({ success: true, templates })
  }
}
