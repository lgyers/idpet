# AI 图片生成功能集成指南

## 概述

本项目已集成 Replicate API 以实现 SDXL + ControlNet 的 AI 图片生成功能。

## 功能架构

```
前端 (app/generate/page.tsx)
    ↓
调用 API (POST /api/generate)
    ↓
后端 (app/api/generate/route.ts)
    ↓
Replicate 客户端 (lib/replicate.ts)
    ↓
Replicate API (SDXL v1.0)
    ↓
返回生成的图片 URL
```

## 环境配置

### 1. 获取 Replicate API Token

1. 访问 [replicate.com](https://replicate.com)
2. 注册或登录账户
3. 进入 [API 页面](https://replicate.com/account/api-tokens)
4. 复制 API Token

### 2. 配置环境变量

在 `.env.local` 文件中添加：

```bash
REPLICATE_API_TOKEN="your_api_token_here"
```

## 生成流程

### 步骤 1：用户上传宠物照片
- 上传至 `/upload` 页面
- 照片被上传到 Vercel Blob Storage
- 返回可访问的 URL

### 步骤 2：选择场景模板
- 从 18 个预设模板中选择
- 模板包含提示词和预览图

### 步骤 3：触发生成
- 前端调用 `/api/generate` API
- 传递：上传的图片 URL、模板 ID、分辨率

### 步骤 4：后端处理
- 检查用户配额
- 验证模板存在性
- 组织最终提示词
- 调用 Replicate API 创建预测任务

### 步骤 5：等待完成
- 轮询 Replicate API 获取状态
- 最多等待 5 分钟（可配置）
- 生成完成后保存记录

### 步骤 6：返回结果
- 返回生成的图片 URL
- 前端显示结果
- 用户可下载或分享

## API 端点

### POST /api/generate

生成宠物创意照片

**请求：**
```json
{
  "uploadedImageUrl": "https://...",
  "templateId": "template-id",
  "customPrompt": "optional custom prompt",
  "resolution": "low" | "medium" | "high"
}
```

**响应（成功）：**
```json
{
  "success": true,
  "generation": {
    "id": "record-id",
    "originalImageUrl": "https://...",
    "generatedImageUrl": "https://...",
    "templateId": "template-id",
    "templateName": "场景名称",
    "prompt": "生成的提示词",
    "createdAt": "2024-11-12T...",
    "status": "completed"
  }
}
```

**响应（失败）：**
```json
{
  "error": "Error message",
  "details": "Additional details"
}
```

**错误码：**
- 401: 未授权（未登录）
- 400: 缺少必填字段
- 404: 模板不存在
- 429: 配额超限
- 500: 生成失败

### GET /api/generate?predictionId=...

获取 Replicate 预测状态（用于轮询）

**响应：**
```json
{
  "success": true,
  "prediction": {
    "id": "prediction-id",
    "status": "starting" | "processing" | "succeeded" | "failed",
    "input": {...},
    "output": ["https://..."],
    "created_at": "2024-11-12T..."
  }
}
```

## 配置说明

### 分辨率设置

| 级别 | 分辨率 | 适用场景 | API 成本 |
|------|--------|--------|---------|
| low | 512×512 | 免费用户、快速预览 | 低 |
| medium | 768×768 | 标准高质量 | 中 |
| high | 1024×1024 | 高清输出、付费用户 | 高 |

### 模型参数

```typescript
{
  guidance_scale: 7.5,      // 提示词指导强度（推荐 7-10）
  num_inference_steps: 50,  // 推理步数（更多=质量更好但速度更慢）
  negative_prompt: "...",   // 反面提示词，避免生成不要的内容
  seed: undefined,          // 可选，固定随机种子用于可重复生成
}
```

### 超时配置

- 默认超时：300 秒（5 分钟）
- API 最大处理时间：通常 30-120 秒
- 后端最大持续时间：300 秒

## 成本考虑

### Replicate 定价

- SDXL v1.0：约 $0.025 / 次生成
- 输入图片处理：通常包含在生成成本中

### 成本优化

1. **缓存结果**：相同输入可缓存输出
2. **降低分辨率**：免费用户用 low 分辨率
3. **降低推理步数**：可调低至 20 步（质量与速度平衡）
4. **批量生成**：支持批量处理后端实现

## 调试和日志

### 启用调试日志

在 `lib/replicate.ts` 中添加：

```typescript
console.log('Creating prediction:', input);
console.log('Prediction result:', prediction);
```

### 常见错误

| 错误 | 原因 | 解决方案 |
|------|------|--------|
| `REPLICATE_API_TOKEN not set` | 环境变量未配置 | 在 `.env.local` 中设置 token |
| `Failed to fetch prediction` | API 响应错误 | 检查 token 有效性和配额 |
| `Generation timeout` | 生成超时 | 检查图片大小或网络连接 |
| `Invalid image URL` | 图片 URL 不可访问 | 确保 URL 有效且可从 Replicate 访问 |

## 测试

### 本地测试

```bash
# 1. 设置环境变量
echo 'REPLICATE_API_TOKEN="your_token"' > .env.local

# 2. 运行开发服务器
npm run dev

# 3. 访问 http://localhost:3000/upload
# 4. 上传宠物照片
# 5. 选择模板并生成
```

### 调试 API 直接调用

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "uploadedImageUrl": "https://example.com/pet.jpg",
    "templateId": "template-id",
    "resolution": "medium"
  }'
```

## 优化建议

### 短期优化（Phase 1）
- [x] 基础 Replicate 集成
- [ ] 添加生成进度跟踪
- [ ] 实现异步任务处理（后台任务队列）
- [ ] 添加生成历史缓存

### 中期优化（Phase 2）
- [ ] 支持自定义提示词（付费用户）
- [ ] 实现 ControlNet 强度调整
- [ ] 添加多个 AI 模型选择
- [ ] 实现流式进度更新（WebSocket/Server-Sent Events）

### 长期优化（Phase 3）
- [ ] 自建 AI 模型部署
- [ ] 本地模型集成（更低延迟）
- [ ] 图片批量生成
- [ ] 高级提示词模板库

## 常见问题 (FAQ)

**Q: 生成需要多长时间？**
A: 通常 30-120 秒，取决于图片大小、推理步数和 Replicate 队列。

**Q: 可以提高生成质量吗？**
A: 可以增加 `num_inference_steps` 到 100+，但会增加成本和时间。

**Q: 支持批量生成吗？**
A: 当前不支持，但后端 API 可扩展支持。

**Q: 如何减少 API 成本？**
A: 使用 low 分辨率、缓存结果、降低推理步数。

**Q: 生成失败怎么办？**
A: 检查图片 URL、API token、网络连接，查看服务器日志。

## 安全考虑

1. **API Token 安全**
   - 仅在后端存储 token（.env.local）
   - 不要在前端代码中暴露 token
   - 定期轮换 token

2. **图片安全**
   - 验证上传的图片 URL 有效性
   - 可选：实现内容审核
   - 限制大文件上传

3. **配额保护**
   - 检查用户配额
   - 限制每日/每月生成次数
   - 检测和防止滥用

## 参考资源

- [Replicate 文档](https://replicate.com/docs)
- [SDXL 模型文档](https://replicate.com/stability-ai/sdxl)
- [ControlNet 集成](https://replicate.com/docs/guides/control-net)
- [API 错误处理](https://replicate.com/docs/guides/async-predictions)

---

**最后更新：2024年11月12日**
