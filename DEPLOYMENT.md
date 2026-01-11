# 🚀 PetPhoto 快速启动指南

## 项目概述

**PetPhoto** 是一个萌宠拟人化 AI 创意照片生成平台，允许用户上传宠物照片，通过 AI 生成创意拟人化照片。

- 📱 **前端框架**: Next.js 16 + React 19 + TypeScript
- 🗄️ **后端**: Node.js Serverless (Vercel)
- 🗃️ **数据库**: PostgreSQL (Supabase)
- 🤖 **AI 生成**: Replicate API (SDXL + ControlNet)
- 💳 **支付**: Stripe
- 📦 **文件存储**: Vercel Blob Storage

---

## 📋 项目当前状态

### ✅ 已完成功能

1. **用户认证系统**
   - Email + 密码注册/登录
   - Google OAuth
   - GitHub OAuth
   - NextAuth.js 集成

2. **核心业务功能**
   - 宠物照片上传（拖拽上传、前端压缩、验证）
   - 18 个预设场景模板
   - AI 图片生成（Replicate API 集成）
   - 生成历史管理（查看、下载、删除）
   - 配额管理系统

3. **支付和订阅**
   - Stripe 支付集成
   - 三档订阅套餐（免费、基础、专业）
   - Webhook 事件处理
   - 订阅状态同步

4. **用户中心**
   - 用户信息管理
   - 配额统计展示
   - 套餐升级
   - 订阅管理

5. **营销页面**
   - 首页（Hero、功能、价格、FAQ）
   - 功能说明页
   - 示例展示页
   - 价格对比页
   - 隐私政策、服务条款

---

## 🛠️ 本地开发环境搭建

### 1️⃣ 克隆仓库并安装依赖

```bash
# 克隆项目
git clone <repository-url>
cd pet_photo

# 安装依赖
npm install

# 或使用 pnpm
pnpm install
```

### 2️⃣ 配置环境变量

```bash
# 复制示例配置文件
cp .env.example .env.local

# 编辑 .env.local，填写以下信息：
```

#### 必需的环境变量配置

**数据库**
```
DATABASE_URL=postgresql://user:password@host:port/database
```
[获取 Supabase PostgreSQL 连接字符串](https://supabase.com/)

**NextAuth**
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=openssl rand -base64 32  # 生成安全密钥
```

**Google OAuth**
```
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
```
[Google Cloud Console](https://console.cloud.google.com/) 获取

**GitHub OAuth**
```
GITHUB_CLIENT_ID=xxx
GITHUB_CLIENT_SECRET=xxx
```
[GitHub Settings](https://github.com/settings/developers) 获取

**Replicate API**
```
REPLICATE_API_TOKEN=r8_xxx
```
[Replicate Dashboard](https://replicate.com/account) 获取

**Vercel Blob Storage**
```
BLOB_READ_WRITE_TOKEN=xxx
```
[Vercel Dashboard](https://vercel.com/dashboard) 获取

**Stripe**
```
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PRICE_BASIC=price_xxx
NEXT_PUBLIC_STRIPE_PRICE_PRO=price_xxx
```
[Stripe Dashboard](https://dashboard.stripe.com/) 获取

### 3️⃣ 初始化数据库

```bash
# 执行 Prisma 迁移
npx prisma migrate dev --name init

# 生成场景模板数据
npx prisma db seed
```

### 4️⃣ 启动开发服务器

```bash
npm run dev

# 访问 http://localhost:3000
```

---

## 📦 API 文档速览

### 认证
- `POST /api/auth/register` - 注册
- `POST /api/auth/[...nextauth]` - NextAuth 端点

### 生成和历史
- `POST /api/upload` - 上传宠物照片
- `POST /api/generate` - 生成创意照片
- `GET /api/generations` - 获取生成历史
- `DELETE /api/generations/[id]` - 删除记录

### 用户和配额
- `GET /api/user` - 获取用户信息
- `PUT /api/user` - 更新用户信息
- `GET /api/quota` - 获取配额信息
- `POST /api/quota` - 消耗配额

### 支付
- `POST /api/checkout` - 创建支付 Session
- `POST /api/webhooks/stripe` - Stripe Webhook

### 模板
- `GET /api/templates` - 获取所有场景模板

---

## 🚀 部署到 Vercel

### 1️⃣ 连接 GitHub

```bash
# 推送到 GitHub
git push origin main
```

### 2️⃣ 在 Vercel 导入项目

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "Import Project"
3. 选择 GitHub 仓库
4. 点击 "Import"

### 3️⃣ 配置环境变量

在 Vercel 部署设置中配置所有 `.env.local` 变量：

```
Environment Variables:
DATABASE_URL = ...
NEXTAUTH_URL = https://your-domain.vercel.app
NEXTAUTH_SECRET = ...
GOOGLE_CLIENT_ID = ...
GOOGLE_CLIENT_SECRET = ...
GITHUB_CLIENT_ID = ...
GITHUB_CLIENT_SECRET = ...
REPLICATE_API_TOKEN = ...
BLOB_READ_WRITE_TOKEN = ...
STRIPE_SECRET_KEY = ...
STRIPE_PUBLISHABLE_KEY = ...
STRIPE_WEBHOOK_SECRET = ...
NEXT_PUBLIC_STRIPE_PRICE_BASIC = ...
NEXT_PUBLIC_STRIPE_PRICE_PRO = ...
```

### 4️⃣ 配置 Stripe Webhook

1. 访问 [Stripe Dashboard](https://dashboard.stripe.com/)
2. 进入 Webhooks 设置
3. 添加新的 Webhook 端点: `https://your-domain.vercel.app/api/webhooks/stripe`
4. 选择事件：
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
5. 复制 Webhook Secret 到 `STRIPE_WEBHOOK_SECRET`

### 5️⃣ 部署

```bash
# Vercel CLI 部署（可选）
vercel deploy

# 或在 Vercel Dashboard 中手动点击 Deploy
```

---

## 📝 项目结构

```
pet_photo/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   │   ├── auth/          # 认证
│   │   ├── upload/        # 文件上传
│   │   ├── generate/      # 图片生成
│   │   ├── generations/   # 生成历史
│   │   ├── templates/     # 模板
│   │   ├── user/          # 用户信息
│   │   ├── quota/         # 配额管理
│   │   ├── checkout/      # 支付
│   │   └── webhooks/      # Webhook
│   ├── auth/              # 认证页面
│   ├── dashboard/         # 用户中心
│   ├── generate/          # 生成页面
│   ├── history/           # 历史页面
│   ├── pricing/           # 价格页
│   ├── features/          # 功能说明
│   ├── examples/          # 示例展示
│   └── layout.tsx         # 全局布局
├── lib/                   # 工具库
│   ├── auth.ts            # NextAuth 配置
│   ├── db.ts              # Prisma 客户端
│   ├── blob.ts            # Blob 存储
│   ├── replicate.ts       # Replicate API
│   ├── stripe.ts          # Stripe 客户端
│   ├── quota.ts           # 配额管理
│   └── types.ts           # TypeScript 类型
├── components/            # React 组件
├── public/                # 静态资源
├── prisma/                # 数据库架构
│   ├── schema.prisma      # 数据模型
│   └── seed.js            # 数据初始化
└── package.json
```

---

## 🔍 测试生成流程

### 步骤 1: 注册用户

```bash
# 访问首页
http://localhost:3000

# 点击注册，创建账户
```

### 步骤 2: 上传宠物照片

```
http://localhost:3000/upload
- 拖拽或选择宠物照片
- 点击"开始创作"进入生成页面
```

### 步骤 3: 选择场景并生成

```
http://localhost:3000/generate
- 选择 18 个场景中的一个
- 点击"生成照片"
- 等待 15-30 秒生成完成
```

### 步骤 4: 查看历史

```
http://localhost:3000/history
- 查看所有生成的照片
- 下载或删除历史记录
```

### 步骤 5: 升级订阅（测试支付）

```
http://localhost:3000/pricing
- 选择基础版或专业版
- 点击"立即订阅"
- 使用 Stripe 测试卡：4242 4242 4242 4242
```

---

## 🐛 常见问题

### Q: 生成失败 - "REPLICATE_API_TOKEN not set"
A: 确保 `.env.local` 中配置了 `REPLICATE_API_TOKEN`，并重启开发服务器

### Q: 上传失败 - "BLOB_READ_WRITE_TOKEN"
A: 获取 Vercel Blob token：
1. 访问 Vercel Dashboard
2. 项目设置 → Storage → Create Database
3. 选择 Blob Storage
4. 复制 token

### Q: 支付失败 - "Price ID not found"
A: 确保在 Stripe Dashboard 创建了价格，并配置了 `NEXT_PUBLIC_STRIPE_PRICE_BASIC` 和 `NEXT_PUBLIC_STRIPE_PRICE_PRO`

### Q: 数据库连接失败
A: 检查 `DATABASE_URL` 是否正确：
```bash
# 测试连接
npx prisma db push
```

---

## 📊 性能指标

目标：
- 首屏加载：< 2.5 秒
- 生成时间：15-30 秒
- Lighthouse 分数 > 90

优化方案：
- 图片压缩和懒加载
- API 缓存策略
- CDN 加速

---

## 📞 支持和反馈

- 📧 Email: support@petphoto.app
- 💬 GitHub Issues: [报告 Bug](https://github.com/yourusername/pet_photo/issues)
- 📖 文档: [完整文档](https://github.com/yourusername/pet_photo/wiki)

---

## 📄 许可证

MIT License - 详见 [LICENSE](./LICENSE)

---

**祝你开发愉快! 🎉**
