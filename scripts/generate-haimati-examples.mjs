import fs from 'fs/promises';
import path from 'path';

function stripQuotes(value) {
  const v = String(value ?? '').trim();
  if (
    (v.startsWith('"') && v.endsWith('"') && v.length >= 2) ||
    (v.startsWith("'") && v.endsWith("'") && v.length >= 2)
  ) {
    return v.slice(1, -1);
  }
  return v;
}

function parseEnvLine(line) {
  const trimmed = String(line).trim();
  if (!trimmed || trimmed.startsWith('#')) return null;
  const idx = trimmed.indexOf('=');
  if (idx <= 0) return null;
  const key = trimmed.slice(0, idx).trim();
  const value = stripQuotes(trimmed.slice(idx + 1));
  if (!key) return null;
  return { key, value };
}

async function loadEnvFiles() {
  const candidates = [
    path.join(process.cwd(), '.env'),
    path.join(process.cwd(), '.env.local'),
  ];

  for (const filePath of candidates) {
    try {
      const raw = await fs.readFile(filePath, 'utf8');
      for (const line of raw.split(/\r?\n/)) {
        const parsed = parseEnvLine(line);
        if (!parsed) continue;
        if (typeof process.env[parsed.key] === 'undefined') {
          process.env[parsed.key] = parsed.value;
        }
      }
    } catch {
      continue;
    }
  }
}

function slugify(input) {
  return String(input)
    .trim()
    .toLowerCase()
    .replace(/[\s/]+/g, '-')
    .replace(/[^a-z0-9\u4e00-\u9fa5-]+/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readFileAsBase64(filePath) {
  const buffer = await fs.readFile(filePath);
  if (buffer.length > 10 * 1024 * 1024) {
    throw new Error(`Base image too large (>10MB): ${filePath}`);
  }
  const ext = path.extname(filePath).toLowerCase();
  const mimeType =
    ext === '.png'
      ? 'image/png'
      : ext === '.webp'
        ? 'image/webp'
        : ext === '.jpg' || ext === '.jpeg'
          ? 'image/jpeg'
          : 'application/octet-stream';
  return { mimeType, base64: buffer.toString('base64') };
}

async function generateProImage({ apiKey, baseUrl, prompt, inputImage }) {
  const url = `${baseUrl.replace(/\/$/, '')}/v1beta/models/gemini-3-pro-image-preview:generateContent`;
  const response = await fetch(url, {
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
            { inline_data: { mime_type: inputImage.mimeType, data: inputImage.base64 } },
          ],
        },
      ],
      generationConfig: {
        responseModalities: ['IMAGE'],
        imageConfig: {
          aspectRatio: '1:1',
          imageSize: process.env.EXAMPLE_IMAGE_SIZE === '2K' || process.env.EXAMPLE_IMAGE_SIZE === '4K' ? process.env.EXAMPLE_IMAGE_SIZE : '1K',
        },
      },
    }),
  });

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
  return { base64, mimeType };
}

function createRng(seedText) {
  const seed = String(seedText ?? '');
  if (!seed) return () => Math.random();
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  let a = h >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickOne(list, rng) {
  if (!Array.isArray(list) || list.length === 0) {
    throw new Error('Empty list');
  }
  const idx = Math.floor(rng() * list.length);
  return list[Math.min(Math.max(idx, 0), list.length - 1)];
}

function shuffled(list, rng) {
  const arr = Array.isArray(list) ? list.slice() : [];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}

async function readBaseImagePool(paths) {
  const unique = Array.from(new Set(paths.map((p) => String(p).trim()).filter(Boolean)));
  const items = [];
  for (const p of unique) {
    const abs = path.isAbsolute(p) ? p : path.join(process.cwd(), p);
    try {
      const data = await readFileAsBase64(abs);
      items.push({ path: abs, data });
    } catch {
      continue;
    }
  }
  return items;
}

const templates = [
  {
    slug: 'baityanzhao',
    name: '百天照',
    prompt:
      '百天照纪念棚拍风格，温暖治愈、可爱但不幼稚；干净柔和的浅色背景与少量氛围道具点缀（无文字），高键柔光，皮毛细节清晰，photorealistic；保持宠物原始身份特征（脸型、毛色、花纹、耳朵形状不变）；no text, no watermark, no logo, no extra limbs',
  },
  {
    slug: 'blue-id',
    name: '蓝底证件照',
    prompt:
      '标准证件照风格，纯蓝背景（均匀无渐变、无纹理），正面直视镜头，构图规范，光线均匀柔和、几乎无阴影；画面干净、真实，不要风格化滤镜；保持宠物原始身份特征（脸型、毛色、花纹、耳朵形状不变）；no text, no watermark, no logo, no extra limbs',
  },
  {
    slug: 'doctor',
    name: '医生职业照',
    prompt:
      '医生职业形象照，干净专业；白大褂与听诊器，背景为医院/诊室环境的轻微虚化，不喧宾夺主；柔和但有层次的棚拍光，质感真实，photorealistic；保持宠物原始身份特征（脸型、毛色、花纹、耳朵形状不变）；no text, no watermark, no logo, no extra limbs',
  },
  {
    slug: 'graduation',
    name: '学士服毕业照',
    prompt:
      '学士服毕业照，正式纪念感；学士服与学士帽，背景为校园建筑或摄影棚背景的轻微虚化；光影丰富、细节清晰，photorealistic；保持宠物原始身份特征（脸型、毛色、花纹、耳朵形状不变）；no text, no watermark, no logo, no extra limbs',
  },
  {
    slug: 'tangzhuang',
    name: '唐装',
    prompt:
      '唐装风格形象照，端庄雅致；传统唐装（红/黑/藏青为主，金色点缀但克制），背景为中式屏风/窗棂光影的轻微虚化或纯色留白；质感真实、光影细腻，photorealistic；保持宠物原始身份特征（脸型、毛色、花纹、耳朵形状不变）；no text, no watermark, no logo, no extra limbs',
  },
  {
    slug: 'white-collar',
    name: '白领西装照',
    prompt:
      '白领西装职业照，商务人像棚拍质感；合身西装与衬衫，背景为办公室环境的轻微虚化或干净纯色；主光柔和、轮廓光轻微，细节锐利，photorealistic；保持宠物原始身份特征（脸型、毛色、花纹、耳朵形状不变）；no text, no watermark, no logo, no extra limbs',
  },
  {
    slug: 'japanese-kawaii',
    name: '日系可爱风',
    prompt:
      '日系可爱风，清新软萌但高级；浅色系背景与柔光，高键通透，少量小道具点缀（无文字），整体干净克制；photorealistic；保持宠物原始身份特征（脸型、毛色、花纹、耳朵形状不变）；no text, no watermark, no logo, no extra limbs',
  },
  {
    slug: 'oriental-aesthetic',
    name: '东方美学古韵风',
    prompt:
      '东方美学古韵风，含蓄雅致；可融入汉服/古风配饰元素但不过度遮挡面部，背景留白或水墨氛围的轻微虚化；光线柔和有层次，质感真实高级，photorealistic；保持宠物原始身份特征（脸型、毛色、花纹、耳朵形状不变）；no text, no watermark, no logo, no extra limbs',
  },
  {
    slug: 'wedding',
    name: '婚纱摄影',
    prompt:
      '婚纱摄影棚拍，浪漫但不过度俗艳；婚纱/礼服元素与少量花艺点缀（无文字），背景为柔和虚化的影棚/花墙或高级纯色；光影细腻、皮毛细节清晰，photorealistic；保持宠物原始身份特征（脸型、毛色、花纹、耳朵形状不变）；no text, no watermark, no logo, no extra limbs',
  },
  {
    slug: 'golden-wedding',
    name: '金婚照',
    prompt:
      '金婚纪念照，温暖复古的影楼质感；端庄得体的礼服/西装元素，色调偏暖，背景干净克制；光影柔和丰富，质感真实，photorealistic；保持宠物原始身份特征（脸型、毛色、花纹、耳朵形状不变）；no text, no watermark, no logo, no extra limbs',
  },
  {
    slug: 'ironman',
    name: '漫威钢铁侠',
    prompt:
      '漫威钢铁侠主题电影感，红金装甲质感真实，金属反射与细节丰富；强对比电影灯光与体积光，背景为暗色科技氛围虚化；强调眼部对焦与面部特征，photorealistic；保持宠物原始身份特征（脸型、毛色、花纹、耳朵形状不变）；no text, no watermark, no logo, no extra limbs',
  },
];

const breeds = [
  { slug: 'cat-zhonghua-tianyuan', species: '猫', breed: '中华田园猫', base: 'cat' },
  { slug: 'cat-british-shorthair', species: '猫', breed: '英短', base: 'cat' },
  { slug: 'cat-ragdoll', species: '猫', breed: '布偶', base: 'cat' },
  { slug: 'cat-siamese', species: '猫', breed: '暹罗', base: 'cat' },
  { slug: 'dog-chinese-rural', species: '狗', breed: '田园犬', base: 'dog' },
  { slug: 'dog-labrador', species: '狗', breed: '拉布拉多', base: 'dog' },
  { slug: 'dog-golden-retriever', species: '狗', breed: '金毛', base: 'dog' },
  { slug: 'dog-corgi', species: '狗', breed: '柯基', base: 'dog' },
];

function buildVariantPrompt({ templateName, idx, rng }) {
  const backgroundVariants = [
    '背景为浅灰到米白的柔和渐变纯色背景，干净无纹理，克制留白',
    '背景为深灰到黑色的低调纯色背景，带轻微渐变，干净无杂物',
    '背景为暖米色系的柔和渐变背景，色彩克制，高级影楼质感',
    '背景为冷灰蓝系的柔和渐变背景，干净克制，突出主体',
  ];

  const lightingVariants = [
    '棚拍柔光主光（大柔光箱）+ 轻微轮廓光，立体但柔和，眼神高光明显',
    '伦勃朗侧光，明暗层次丰富，阴影干净不过黑，轮廓清晰',
    '轻微逆光轮廓光 + 正面柔和补光，头部与皮毛边缘有光晕层次',
    '经典三点布光，主光+辅光+轮廓光，质感通透，细节丰富',
  ];

  const compositionVariants = [
    '构图为头肩近景，主体略偏上，背景留白，85mm 人像镜头质感，浅景深',
    '构图为半身 3/4 侧脸角度，主体居中偏侧，浅景深，50-85mm 人像镜头',
    '构图为正面居中，画面更稳重克制，浅景深，皮毛与眼睛对焦精准',
    '构图为轻微俯拍一点点，显得更亲近自然，但保持高级棚拍质感',
  ];

  const variantsByTemplate = {
    蓝底证件照: {
      background: ['背景为纯蓝色证件照背景（均匀无渐变无纹理）'],
      lighting: ['正面均匀柔光，尽量无阴影，真实自然'],
      composition: ['构图为标准证件照：正面居中，头部居中，上方留白适中，背景干净'],
      props: ['无任何道具与装饰，不要滤镜与夸张光效'],
    },
    百天照: {
      background: ['背景为浅奶油色或浅粉蓝柔和渐变，干净留白'],
      lighting: ['高键柔光，温暖通透，皮毛细节清晰'],
      composition: ['构图为半身近景，表情自然可爱，眼睛对焦准确'],
      props: ['少量道具点缀：一两个气球/彩带（无文字），不遮挡面部'],
    },
    医生职业照: {
      background: ['背景为诊室/医院走廊的轻微虚化，干净不杂乱'],
      lighting: ['柔光主光+轻微轮廓光，专业干净，层次明确'],
      composition: ['构图为头肩近景，主体端正居中，职业头像质感'],
      props: ['道具克制：听诊器可见但不抢主体'],
    },
    学士服毕业照: {
      background: ['背景为校园建筑或摄影棚背景的轻微虚化，干净'],
      lighting: ['柔和三点布光，层次丰富，纪念照质感'],
      composition: ['构图为半身近景，主体居中，学士帽完整可见'],
      props: ['可有极少量毕业氛围点缀（无文字），不要拥挤'],
    },
    唐装: {
      background: ['背景为中式屏风/窗棂光影的轻微虚化或干净留白'],
      lighting: ['偏暖柔光，肤色/毛色自然，高级影楼质感'],
      composition: ['构图为头肩近景或半身，端庄稳重'],
      props: ['道具极少：可有淡淡传统纹理氛围，不要明显摆件'],
    },
    白领西装照: {
      background: ['背景为办公室环境轻微虚化或干净纯色背景'],
      lighting: ['经典三点布光，通透干净，细节清晰'],
      composition: ['构图为头肩近景，主体正面或轻微 3/4 侧脸'],
      props: ['不添加道具，保持商务职业头像简洁'],
    },
    日系可爱风: {
      background: ['背景为浅色系干净纯色或极弱纹理，日系清新'],
      lighting: ['高键柔光，通透，轻微梦幻散射但不过度'],
      composition: ['构图为半身近景，眼睛对焦清晰，表情更可爱'],
      props: ['少量可爱道具点缀（无文字），不要遮挡面部'],
    },
    东方美学古韵风: {
      background: ['背景为留白或水墨氛围的轻微虚化，克制高级'],
      lighting: ['柔和侧光，层次细腻，氛围含蓄'],
      composition: ['构图为头肩近景，留白构图，气质更静'],
      props: ['不要明显道具，可有极弱传统纹理氛围'],
    },
    婚纱摄影: {
      background: ['背景为影棚柔和虚化或花墙虚化，干净不杂乱'],
      lighting: ['柔和主光+轮廓光，浪漫通透，细节清晰'],
      composition: ['构图为半身近景，主体居中，氛围浪漫'],
      props: ['少量花艺点缀（无文字），不要夸张堆叠'],
    },
    金婚照: {
      background: ['背景为暖色影楼背景或干净纯色，复古温暖'],
      lighting: ['偏暖柔光，层次丰富，质感真实'],
      composition: ['构图为头肩近景，端庄稳重，纪念照质感'],
      props: ['道具克制，不要文字与标语'],
    },
    漫威钢铁侠: {
      background: ['背景为暗色科技氛围虚化，带轻微体积光'],
      lighting: ['强对比电影灯光，红金金属反射层次丰富'],
      composition: ['构图为头肩近景或半身，英雄海报质感，眼睛对焦'],
      props: ['可有少量火花/烟雾氛围，不要遮挡面部'],
    },
  };

  const cfg = variantsByTemplate[templateName];
  const bg = cfg ? pickOne(cfg.background, rng) : pickOne(backgroundVariants, rng);
  const light = cfg ? pickOne(cfg.lighting, rng) : pickOne(lightingVariants, rng);
  const comp = cfg ? pickOne(cfg.composition, rng) : pickOne(compositionVariants, rng);
  const props = cfg
    ? pickOne(cfg.props, rng)
    : idx % 2 === 0
      ? '背景保持简洁，不要多余道具'
      : '背景干净克制，可有极轻微氛围但不抢主体';

  return [bg, light, comp, props].join('；');
}

function buildPrompt({ templatePrompt, templateName, species, breed, variantIdx, rng }) {
  return [
    templatePrompt,
    `请将画面中的宠物表现为${species}，品种为${breed}；整体保持主题一致的真实摄影/电影质感。`,
    buildVariantPrompt({ templateName, idx: variantIdx, rng }),
    '主体清晰锐利，毛发/皮毛细节清晰，眼睛清晰对焦；不要出现文字/水印/Logo，不要出现多余肢体。',
  ].join('\n');
}

async function main() {
  await loadEnvFiles();

  const apiKey = process.env.LAOZHANG_API_KEY;
  const baseUrl = process.env.LAOZHANG_API_BASE_URL || 'https://api.laozhang.ai';
  if (!apiKey) {
    throw new Error('LAOZHANG_API_KEY environment variable is not set');
  }

  const baseCatPath =
    process.env.EXAMPLE_BASE_CAT ||
    path.join(process.cwd(), 'public', 'assets', 'pet-traditional.jpg');
  const baseDogPath =
    process.env.EXAMPLE_BASE_DOG ||
    path.join(process.cwd(), 'public', 'assets', 'pet-business.jpg');

  const defaultCatPool = [
    baseCatPath,
    path.join(process.cwd(), 'public', 'assets', 'pet-traditional.jpg'),
    path.join(process.cwd(), 'public', 'assets', 'gallery-model.jpg'),
  ];
  const defaultDogPool = [
    baseDogPath,
    path.join(process.cwd(), 'public', 'assets', 'pet-business.jpg'),
    path.join(process.cwd(), 'public', 'assets', 'gallery-doctor.jpg'),
  ];

  const catPoolPaths = String(process.env.EXAMPLE_BASE_CAT_POOL || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const dogPoolPaths = String(process.env.EXAMPLE_BASE_DOG_POOL || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const catPool = await readBaseImagePool(catPoolPaths.length > 0 ? catPoolPaths : defaultCatPool);
  const dogPool = await readBaseImagePool(dogPoolPaths.length > 0 ? dogPoolPaths : defaultDogPool);

  if (catPool.length === 0) {
    throw new Error('No valid cat base images found');
  }
  if (dogPool.length === 0) {
    throw new Error('No valid dog base images found');
  }

  const outRoot = path.join(process.cwd(), 'public', 'assets', 'examples', 'haimati');
  await fs.mkdir(outRoot, { recursive: true });

  const force = process.env.FORCE_REGEN === '1';
  const maxImagesRaw = Number(process.env.MAX_IMAGES || '');
  const maxImages = Number.isFinite(maxImagesRaw) && maxImagesRaw > 0 ? Math.floor(maxImagesRaw) : null;

  const manifest = [];
  let id = 1;
  let generatedCount = 0;
  const total = templates.length * 4;

  const rng = createRng(process.env.EXAMPLE_SEED);
  const cats = breeds.filter((b) => b.base === 'cat');
  const dogs = breeds.filter((b) => b.base === 'dog');

  for (const template of templates) {
    const templateDir = path.join(outRoot, slugify(template.slug || template.name));
    await fs.mkdir(templateDir, { recursive: true });

    const selectedCats = shuffled(cats, rng).slice(0, Math.min(2, cats.length));
    const selectedDogs = shuffled(dogs, rng).slice(0, Math.min(2, dogs.length));
    const selected = selectedCats.concat(selectedDogs);

    for (let i = 0; i < selected.length; i += 1) {
      if (maxImages !== null && generatedCount >= maxImages) break;
      const b = selected[i];
      const variantIdx = i + 1;

      const filename = `${slugify(b.slug || b.breed)}-v${variantIdx}.png`;
      const outFile = path.join(templateDir, filename);
      const imagePublicPath = `/assets/examples/haimati/${path.basename(templateDir)}/${filename}`;

      if (!force && (await fileExists(outFile))) {
        manifest.push({
          id,
          title: `${b.breed} · ${template.name} #${variantIdx}`,
          description: `${b.species}${b.breed}，${template.name}风格（变化${variantIdx}）`,
          category: template.name,
          image: imagePublicPath,
          likes: 0,
          downloads: 0,
        });
        id += 1;
        continue;
      }

      const prompt = buildPrompt({
        templatePrompt: template.prompt,
        templateName: template.name,
        species: b.species,
        breed: b.breed,
        variantIdx,
        rng,
      });

      const pool = b.base === 'cat' ? catPool : dogPool;
      const inputImage = pickOne(pool, rng).data;

      process.stdout.write(`[${generatedCount + 1}/${maxImages ?? total}] ${template.name} - ${b.breed} ... `);
      const result = await generateProImage({ apiKey, baseUrl, prompt, inputImage });
      const buffer = Buffer.from(result.base64, 'base64');
      await fs.writeFile(outFile, buffer);
      process.stdout.write('ok\n');

      manifest.push({
        id,
        title: `${b.breed} · ${template.name} #${variantIdx}`,
        description: `${b.species}${b.breed}，${template.name}风格（变化${variantIdx}）`,
        category: template.name,
        image: imagePublicPath,
        likes: 0,
        downloads: 0,
      });
      id += 1;
      generatedCount += 1;
    }

    if (maxImages !== null && generatedCount >= maxImages) break;
  }

  const manifestPath = path.join(outRoot, 'manifest.json');
  await fs.writeFile(manifestPath, JSON.stringify({ generatedAt: new Date().toISOString(), items: manifest }, null, 2));
  process.stdout.write(`\nDone. Wrote ${manifest.length} items to ${path.relative(process.cwd(), manifestPath)}\n`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
