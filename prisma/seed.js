const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const templates = [
  {
    category: 'haimati',
    name: '百天照',
    description: '温柔童趣的百天纪念肖像',
    thumbnail: '/assets/examples/haimati/baityanzhao/cat-siamese-v1.png',
    basePrompt:
      '百天照风格宠物肖像，婴儿百天纪念照氛围；可爱干净布景（奶油白/浅粉/浅蓝），柔光棚拍，浅景深，皮毛细节清晰；适度小道具（帽子/围兜/小毯子）但不遮挡脸部；保持宠物原始身份特征（脸型、毛色、花纹不变）；photorealistic，high quality；no text, no watermark, no logo, no extra limbs',
  },
  {
    category: 'document',
    name: '蓝底证件照',
    description: '标准证件照蓝色背景',
    thumbnail: '/assets/examples/haimati/blue-id/cat-zhonghua-tianyuan-v1.png',
    basePrompt:
      '证件照风格宠物头像照，纯蓝背景，正面居中，头肩构图，光线均匀无阴影，细节清晰；保持宠物原始身份特征（脸型、毛色、花纹不变）；photorealistic；no text, no watermark, no logo, no extra limbs',
  },
  {
    category: 'professional',
    name: '医生职业照',
    description: '白大褂与听诊器的职业肖像',
    thumbnail: '/assets/examples/haimati/doctor/cat-zhonghua-tianyuan-v1.png',
    basePrompt:
      '医生职业照风格宠物肖像；穿白大褂，佩戴听诊器，背景为干净明亮的医院/诊室虚化场景；专业棚拍布光（主光+轮廓光），眼神有高光；保持宠物原始身份特征（脸型、毛色、花纹不变）；photorealistic，high detail；no text, no watermark, no logo, no extra limbs',
  },
  {
    category: 'professional',
    name: '学士服毕业照',
    description: '学士服与毕业氛围',
    thumbnail: '/assets/examples/haimati/graduation/cat-siamese-v1.png',
    basePrompt:
      '学士服毕业照风格宠物肖像；穿学士服与学位帽，背景为校园/毕业典礼虚化场景，色彩明快；棚拍质感，浅景深，皮毛细节清晰；保持宠物原始身份特征（脸型、毛色、花纹不变）；photorealistic，high quality；no text, no watermark, no logo, no extra limbs',
  },
  {
    category: 'culture',
    name: '唐装',
    description: '传统唐装造型与喜庆氛围',
    thumbnail: '/assets/examples/haimati/tangzhuang/cat-ragdoll-v1.png',
    basePrompt:
      '唐装风格宠物肖像；穿精致唐装（立领、盘扣、织纹），配色典雅喜庆；背景为简洁中式元素（屏风/窗棂/灯笼虚化），暖色柔光，质感高级；保持宠物原始身份特征（脸型、毛色、花纹不变）；photorealistic；no text, no watermark, no logo, no extra limbs',
  },
  {
    category: 'professional',
    name: '白领西装照',
    description: '商务正装的职业形象照',
    thumbnail: '/assets/examples/haimati/white-collar/cat-ragdoll-v1.png',
    basePrompt:
      '白领西装照风格宠物肖像；合身西装+衬衫+领带/领结，背景为干净商务灰/浅色渐变或写字楼虚化；棚拍布光，细节清晰，整体克制高级；保持宠物原始身份特征（脸型、毛色、花纹不变）；photorealistic，high quality；no text, no watermark, no logo, no extra limbs',
  },
  {
    category: 'culture',
    name: '日系可爱风',
    description: '清新软萌的日系写真',
    thumbnail: '/assets/examples/haimati/japanese-kawaii/cat-siamese-v1.png',
    basePrompt:
      '日系可爱风宠物写真；清新低饱和配色，柔和自然光，少量可爱小道具点缀（小花、小背包、糖果色布景）；构图干净，浅景深，毛发细节清晰；保持宠物原始身份特征（脸型、毛色、花纹不变）；photorealistic；no text, no watermark, no logo, no extra limbs',
  },
  {
    category: 'culture',
    name: '东方美学古韵风',
    description: '古韵留白与东方审美',
    thumbnail: '/assets/examples/haimati/oriental-aesthetic/cat-ragdoll-v1.png',
    basePrompt:
      '东方美学古韵风宠物肖像；含蓄留白构图，雅致色调（米白、墨色、黛青），柔和光线；背景可见淡雅山水/宣纸纹理/屏风虚化但不抢主体；保持宠物原始身份特征（脸型、毛色、花纹不变）；photorealistic，high detail；no text, no watermark, no logo, no extra limbs',
  },
  {
    category: 'haimati',
    name: '婚纱摄影',
    description: '浪漫婚礼氛围大片',
    thumbnail: '/assets/examples/haimati/wedding/cat-ragdoll-v1.png',
    basePrompt:
      '婚纱摄影风格宠物写真；浪漫柔光，轻微逆光与轮廓光，背景为婚礼布景/花艺虚化；整体高级、干净、电影感；保持宠物原始身份特征（脸型、毛色、花纹不变）；photorealistic，high quality；no text, no watermark, no logo, no extra limbs',
  },
  {
    category: 'haimati',
    name: '金婚照',
    description: '金色纪念与温暖质感',
    thumbnail: '/assets/examples/haimati/golden-wedding/cat-siamese-v1.png',
    basePrompt:
      '金婚照风格纪念肖像；温暖金色调，柔光棚拍，背景干净带轻微金色点缀（光斑/丝绒/花艺虚化）；氛围庄重温馨；保持宠物原始身份特征（脸型、毛色、花纹不变）；photorealistic；no text, no watermark, no logo, no extra limbs',
  },
  {
    category: 'haimati',
    name: '漫威钢铁侠',
    description: '科幻机甲英雄质感',
    thumbnail: '/assets/examples/haimati/ironman/cat-zhonghua-tianyuan-v1.png',
    basePrompt:
      '漫威钢铁侠风格宠物肖像；穿钢铁侠机甲风格战衣，金红配色，金属质感强，科技光效与能量反应堆发光；背景为科幻城市/机库虚化，戏剧性光影；保持宠物原始身份特征（脸型、毛色、花纹不变）；cinematic, photorealistic, high detail；no text, no watermark, no logo, no extra limbs',
  },
]

const blogPosts = [
  {
    title: '如何拍摄高质量的宠物照片',
    slug: 'how-to-photograph-pets',
    excerpt: '了解宠物摄影的基本技巧，学习如何拍摄出高质量的宠物照片。',
    content: '<h2>宠物摄影基础</h2><p>宠物摄影是一门艺术，需要耐心、技巧和创意。在本指南中，我们将探讨如何拍摄出令人惊艳的宠物照片。</p><h3>1. 选择合适的光线</h3><p>自然光是宠物摄影的最佳选择。在晴朗的日子里，选择早晨或傍晚的侧光，可以为您的宠物创建出柔和而有趣的阴影。</p><h3>2. 耐心和时机</h3><p>宠物是不可预测的，所以耐心是关键。准备多次拍摄，等待那个完美的时刻。</p><h3>3. 使用连拍模式</h3><p>使用相机的连拍模式来捕捉多张图像，增加获得完美照片的机会。</p>',
    category: 'tutorial',
    author: 'PetPhoto Team',
    readTime: 5,
    seoTitle: '宠物摄影技巧 - PetPhoto',
    seoDescription: '学习如何拍摄高质量的宠物照片，了解光线、构图和技巧。',
    seoKeywords: '宠物摄影,拍照技巧,宠物照片',
    published: true,
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'PetPhoto 新功能发布：AI 驱动的创意照片生成',
    slug: 'petphoto-ai-generation-feature',
    excerpt: '我们很高兴宣布 PetPhoto 的最新功能：使用 AI 驱动的 SDXL 和 ControlNet 技术生成创意宠物照片。',
    content: '<h2>PetPhoto AI 生成功能</h2><p>我们很高兴宣布一项革命性的新功能，它将改变您与宠物互动的方式。</p><h3>什么是 AI 驱动的图像生成？</h3><p>PetPhoto 现在使用最先进的 AI 模型（SDXL 和 ControlNet）来生成独特的、高质量的宠物创意照片。</p><h3>如何使用</h3><p>1. 上传您的宠物照片<br>2. 选择一个场景模板<br>3. 点击"生成"按钮<br>4. 在 15-30 秒内获得您的创意照片</p><h3>可用的场景</h3><p>我们提供了 18 个不同的场景模板，包括职业角色、文化风格和证件照。</p>',
    category: 'feature',
    author: 'PetPhoto Team',
    readTime: 3,
    seoTitle: 'PetPhoto AI 创意生成功能',
    seoDescription: '了解 PetPhoto 的 AI 驱动图像生成功能，创建独特的宠物创意照片。',
    seoKeywords: 'AI 生成,宠物照片,创意摄影',
    published: true,
    publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
  },
  {
    title: '用户故事：Lucy 的医生主题宠物照片',
    slug: 'lucy-doctor-pet-photo-story',
    excerpt: '看看 Lucy 如何使用 PetPhoto 创建了她的宠物狗穿着医生装的搞笑照片。',
    content: '<h2>Lucy 的故事</h2><p>Lucy 是一位来自北京的宠物爱好者，她养了一只名叫"Max"的金毛猎犬。她一直希望能为 Max 创建一些有趣的照片来分享到社交媒体。</p><h3>PetPhoto 改变了一切</h3><p>当 Lucy 发现 PetPhoto 时，她立即上传了 Max 的一张照片，并选择了"医生"场景模板。结果令她惊喜：Max 看起来就像一位认真的医生，完全着装。</p><h3>社区反应</h3><p>Lucy 将这张照片分享到了微博和小红书，收到了超过 1000 个赞和 200 条评论。她现在正在尝试其他场景，并期待使用我们的新功能。</p>',
    category: 'case-study',
    author: 'PetPhoto Team',
    readTime: 4,
    seoTitle: 'PetPhoto 用户故事 - Lucy 和 Max',
    seoDescription: '了解 Lucy 如何使用 PetPhoto 为她的宠物 Max 创建了有趣的医生主题照片。',
    seoKeywords: '用户故事,宠物照片,PetPhoto',
    published: true,
    publishedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
  },
]

async function main() {
  // 初始化场景模板
  for (const tpl of templates) {
    const existing = await prisma.sceneTemplate.findFirst({ where: { name: tpl.name } })
    if (!existing) {
      await prisma.sceneTemplate.create({ data: tpl })
    }
  }

  // 初始化博客文章
  for (const post of blogPosts) {
    const existing = await prisma.blogPost.findFirst({ where: { slug: post.slug } })
    if (!existing) {
      await prisma.blogPost.create({ data: post })
    }
  }

  console.log('数据初始化完成！')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
