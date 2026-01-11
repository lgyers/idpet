const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const templates = [
  { category: 'document', name: '身份证照（蓝色背景）', description: '标准证件照蓝色背景', thumbnail: '/assets/gallery-model.jpg', basePrompt: 'ID photo, blue background, centered, neutral expression, high quality' },
  { category: 'document', name: '工作证照（正式风格）', description: '正式着装的工作证照片', thumbnail: '/assets/gallery-model.jpg', basePrompt: 'Work badge photo, formal attire, plain background, professional lighting' },
  { category: 'document', name: '护照照（国际标准）', description: '符合国际标准的护照照片', thumbnail: '/assets/gallery-model.jpg', basePrompt: 'Passport photo, neutral expression, plain white background, evenly lit' },
  { category: 'document', name: '学生证照（青春风格）', description: '青春活力的学生证照片', thumbnail: '/assets/gallery-model.jpg', basePrompt: 'Student ID photo, youthful style, clean background, soft lighting' },
  { category: 'professional', name: '医生', description: '白大褂与听诊器', thumbnail: '/assets/gallery-doctor.jpg', basePrompt: 'Pet as doctor, white coat, stethoscope, hospital background, professional medical style' },
  { category: 'professional', name: '消防员', description: '消防服与头盔', thumbnail: '/assets/gallery-firefighter.jpg', basePrompt: 'Pet as firefighter, turnout gear, helmet, action pose, fire station backdrop' },
  { category: 'professional', name: '宇航员', description: '宇航服与太空背景', thumbnail: '/assets/pet-astronaut.jpg', basePrompt: 'Pet as astronaut, space suit, galaxy background, futuristic style' },
  { category: 'professional', name: '律师', description: '法袍与公文包', thumbnail: '/assets/gallery-artist.jpg', basePrompt: 'Pet as lawyer, robe, briefcase, court background, formal style' },
  { category: 'professional', name: '警察', description: '警服与徽章', thumbnail: '/assets/gallery-police.jpg', basePrompt: 'Pet as police officer, uniform, badge, city street backdrop' },
  { category: 'professional', name: '飞行员', description: '制服与墨镜', thumbnail: '/assets/gallery-pilot.jpg', basePrompt: 'Pet as pilot, aviation uniform, sunglasses, airport background' },
  { category: 'professional', name: '厨师', description: '厨师服与帽子', thumbnail: '/assets/pet-chef.jpg', basePrompt: 'Pet as chef, kitchen background, chef hat, cooking utensils' },
  { category: 'professional', name: '工程师', description: '工作服与安全帽', thumbnail: '/assets/gallery-scientist.jpg', basePrompt: 'Pet as engineer, workwear, hard hat, workshop or lab background' },
  { category: 'culture', name: '古装', description: '汉服或旗袍', thumbnail: '/assets/pet-traditional.jpg', basePrompt: 'Pet in traditional Chinese clothing, elegant, classical background' },
  { category: 'culture', name: '和服', description: '日本传统服饰', thumbnail: '/assets/gallery-artist.jpg', basePrompt: 'Pet in traditional Japanese kimono, peaceful garden background' },
  { category: 'culture', name: '韩服', description: '韩国传统服饰', thumbnail: '/assets/gallery-artist.jpg', basePrompt: 'Pet in traditional Korean hanbok, cultural backdrop' },
  { category: 'culture', name: '朝代风格', description: '唐宋元明清典雅造型', thumbnail: '/assets/pet-traditional.jpg', basePrompt: 'Pet in historical Chinese dynasty style, refined, period setting' },
  { category: 'culture', name: '民族服饰', description: '民族特色服装', thumbnail: '/assets/gallery-artist.jpg', basePrompt: 'Pet in ethnic costumes, colorful, cultural patterns, festival mood' },
  { category: 'culture', name: '时代穿越', description: '70/80/90 年代风', thumbnail: '/assets/gallery-model.jpg', basePrompt: 'Pet in retro 70s/80s/90s style, nostalgic background, vintage tones' },
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
