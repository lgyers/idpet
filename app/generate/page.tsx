"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Template {
  id: string | number;
  name: string;
  description: string;
  category: string;
  preview: string;
  prompt: string;
}

type GenerateProvider = "nano_banana_standard" | "nano_banana_pro";
type ProImageSize = "1K" | "2K" | "4K";
type ProAspectRatio = "1:1" | "4:3" | "3:4" | "16:9" | "9:16";

function GenerateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  const handleTemplateSelect = (id: string) => {
    setSelectedTemplateId(id);
  };
  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [provider, setProvider] = useState<GenerateProvider>("nano_banana_standard");
  const [proImageSize, setProImageSize] = useState<ProImageSize>("2K");
  const [proAspectRatio, setProAspectRatio] = useState<ProAspectRatio>("1:1");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }

    const imageUrl = searchParams.get("image");
    if (!imageUrl) {
      router.push("/upload");
      return;
    }

    setUploadedImage(imageUrl);
  }, [status, router, searchParams]);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await fetch('/api/templates');
        const data = await res.json();
        if (res.ok) {
          setTemplates(data.templates || []);
        } else {
          setError(data.error || "模板加载失败，请稍后重试");
        }
      } catch {
        setError("模板加载失败，请稍后重试");
      }
    };
    fetchTemplates();
  }, []);

  useEffect(() => {
    if (templates.length === 0) return;
    const firstId = String(templates[0].id);
    setSelectedTemplateId((prev) => prev || firstId);
  }, [templates]);

  const activeTemplate = templates.find((t) => String(t.id) === selectedTemplateId) ?? null;

  // 模拟生成进度
  useEffect(() => {
    if (generating) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [generating]);

  const handleGenerate = async () => {
    if (!activeTemplate || !uploadedImage) {
      setError("请选择场景模板");
      return;
    }

    setGeneratedImage(null);
    setGenerating(true);
    setError("");
    setProgress(0);

    try {
      // 调用生成 API
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uploadedImageUrl: uploadedImage,
          templateId: String(activeTemplate.id),
          templateName: activeTemplate.name,
          templateDescription: activeTemplate.description,
          templateCategory: activeTemplate.category,
          templatePreview: activeTemplate.preview,
          customPrompt: activeTemplate.prompt,
          resolution: "medium", // 免费用户使用中等分辨率
          provider,
          proImageSize: provider === "nano_banana_pro" ? proImageSize : undefined,
          proAspectRatio: provider === "nano_banana_pro" ? proAspectRatio : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "生成失败，请重试");
        setGenerating(false);
        return;
      }

      // 生成成功
      setGeneratedImage(data.generation.generatedImageUrl);
      setProgress(100);
    } catch (err) {
      console.error("Generation error:", err);
      setError("生成失败，请重试");
    } finally {
      setGenerating(false);
    }
  };

  const handleReset = () => {
    setGeneratedImage(null);
    setError("");
    setProgress(0);
  };

  const handleDownload = async () => {
    if (!generatedImage) return;
    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pet-photo-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
      window.open(generatedImage, "_blank");
    }
  };

  if (!uploadedImage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[image:var(--gradient-soft)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(var(--brand-coral))] mx-auto"></div>
          <p className="mt-4 text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  const providerOptions: Array<{
    value: GenerateProvider;
    title: string;
    subtitle: string;
  }> = [
    { value: "nano_banana_standard", title: "Nano Banana", subtitle: "标准版" },
    { value: "nano_banana_pro", title: "Banana Pro", subtitle: "可选分辨率" },
  ];

  return (
    <div className="min-h-screen bg-[image:var(--gradient-soft)] pt-24 pb-8 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-foreground mb-4">创意生成</h1>
          <p className="text-xl text-muted-foreground">选择场景模板，让AI为你的宠物创作独特照片</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：上传的图片 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-[hsl(var(--glass-bg))] backdrop-blur-md border border-[hsl(var(--glass-border))] rounded-2xl shadow-card p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">原始照片</h2>
              <div className="relative w-full h-64 mb-4">
                <Image
                  src={uploadedImage}
                  alt="上传的宠物照片"
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
              <Button variant="glass" className="w-full rounded-xl" onClick={() => router.push("/upload")} disabled={generating}>
                <Upload className="h-4 w-4" />
                重新上传
              </Button>
            </div>
          </motion.div>

          {/* 中间：模板选择 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-[hsl(var(--glass-bg))] backdrop-blur-md border border-[hsl(var(--glass-border))] rounded-2xl shadow-card p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">选择场景模板</h2>

              <div className="mb-4 space-y-3">
                <div>
                  <div className="text-sm font-medium text-foreground mb-2">生成引擎</div>
                  <div className="rounded-xl border border-[hsl(var(--glass-border))] bg-background/30 p-1">
                    <div className="grid grid-cols-2 gap-1">
                      {providerOptions.map((opt) => {
                        const active = provider === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setProvider(opt.value)}
                            disabled={generating}
                            aria-pressed={active}
                            className={cn(
                              "relative w-full overflow-hidden rounded-lg px-3 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60",
                              "hover:bg-muted/40 active:bg-muted/50",
                            )}
                          >
                            {active && (
                              <motion.div
                                layoutId="provider-pill"
                                transition={{ type: "spring", stiffness: 520, damping: 38 }}
                                className="absolute inset-0 rounded-lg border border-[hsl(var(--brand-pink))]/35 bg-[hsl(var(--brand-pink))]/10 shadow-[0_10px_26px_-14px_hsl(var(--brand-pink)/0.55)]"
                              />
                            )}
                            <div className="relative z-10">
                              <div className="flex items-center justify-between gap-2">
                                <div className="text-sm font-semibold text-foreground">{opt.title}</div>
                              </div>
                              <div className="mt-0.5 text-[11px] text-muted-foreground">{opt.subtitle}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {provider === "nano_banana_pro" && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-[hsl(var(--glass-border))] bg-background/30 p-3"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <div className="text-xs font-medium text-muted-foreground">Pro 分辨率</div>
                        <div className="relative">
                          <select
                            value={proImageSize}
                            onChange={(e) => setProImageSize(e.target.value as ProImageSize)}
                            disabled={generating}
                            className="h-10 w-full appearance-none rounded-lg border border-border bg-background/20 pl-3 pr-9 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
                          >
                            <option value="1K">1K</option>
                            <option value="2K">2K</option>
                            <option value="4K">4K</option>
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="text-xs font-medium text-muted-foreground">宽高比</div>
                        <div className="relative">
                          <select
                            value={proAspectRatio}
                            onChange={(e) => setProAspectRatio(e.target.value as ProAspectRatio)}
                            disabled={generating}
                            className="h-10 w-full appearance-none rounded-lg border border-border bg-background/20 pl-3 pr-9 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
                          >
                            <option value="1:1">1:1</option>
                            <option value="4:3">4:3</option>
                            <option value="3:4">3:4</option>
                            <option value="16:9">16:9</option>
                            <option value="9:16">9:16</option>
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {templates.length === 0 ? (
                  <div className="col-span-2 rounded-lg border border-[hsl(var(--glass-border))] bg-background/30 p-4 text-sm text-muted-foreground">
                    模板加载中…如果长时间无内容，请检查数据库连接或稍后重试。
                  </div>
                ) : (
                  templates.map((template) => {
                    const id = String(template.id);
                    const isSelected = selectedTemplateId === id;

                    return (
                      <motion.button
                        key={template.id}
                        type="button"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.985 }}
                        onClick={() => handleTemplateSelect(id)}
                        disabled={generating}
                        aria-pressed={isSelected}
                        className={cn(
                          "group relative overflow-hidden rounded-xl border bg-background/25 p-3 text-left transition-[border-color,box-shadow,transform] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60",
                          "hover:border-[hsl(var(--brand-pink))]/55 hover:shadow-[0_18px_36px_-22px_hsl(var(--brand-pink)/0.6)]",
                          isSelected
                            ? "border-[hsl(var(--brand-pink))]/90 bg-[hsl(var(--brand-pink))]/14 shadow-[0_20px_44px_-26px_hsl(var(--brand-pink)/0.75)] ring-2 ring-[hsl(var(--brand-coral))]/30"
                            : "border-border ring-1 ring-transparent",
                        )}
                      >
                        {isSelected && (
                          <motion.div
                            layoutId="template-selected"
                            transition={{ type: "spring", stiffness: 520, damping: 40 }}
                            className="absolute inset-0 rounded-xl bg-[hsl(var(--brand-pink))]/12"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/12 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                        
                        <div className="relative z-10">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="font-semibold text-sm text-foreground">{template.name}</h3>
                          </div>
                          <div className="relative w-full h-24 mb-2">
                            <Image
                              src={template.preview}
                              alt={template.name}
                              fill
                              className={cn(
                                "object-cover rounded transition-[filter,opacity] duration-200",
                                isSelected ? "opacity-100" : "opacity-90",
                              )}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 truncate">{template.description}</p>
                        </div>
                      </motion.button>
                    );
                  })
                )}
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {!generating && !generatedImage && (
                <Button asChild variant="hero" size="lg" className="w-full mt-6 rounded-xl">
                  <motion.button
                    onClick={handleGenerate}
                    disabled={!activeTemplate || generating}
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    className="shadow-[0_18px_40px_-24px_hsl(var(--brand-coral)/0.7)]"
                  >
                    <Sparkles className="h-4 w-4" />
                    开始生成
                  </motion.button>
                </Button>
              )}
            </div>
          </motion.div>

          {/* 右侧：生成结果 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-[hsl(var(--glass-bg))] backdrop-blur-md border border-[hsl(var(--glass-border))] rounded-2xl shadow-card p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">生成结果</h2>

              <AnimatePresence mode="wait">
                {generating && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12"
                  >
                    <div className="relative w-32 h-32 mx-auto mb-6">
                      <div className="absolute inset-0 rounded-full border-4 border-muted"></div>
                      <div
                        className="absolute inset-0 rounded-full border-4 border-[hsl(var(--brand-coral))]"
                        style={{
                          clipPath: `inset(0 ${100 - progress}% 0 0)`,
                        }}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-[hsl(var(--brand-coral))]">{progress}%</span>
                      </div>
                    </div>
                    <p className="text-foreground">AI正在创作中...</p>
                    <p className="text-sm text-muted-foreground mt-2 max-w-[80%] mx-auto">
                      生成过程可能需要几分钟，受网络波动影响可能更久。<br />
                      您可以稍后在<span className="text-[hsl(var(--brand-coral))] font-medium cursor-pointer hover:underline" onClick={() => router.push('/history')}>个人中心-历史记录</span>中查看和下载。
                    </p>
                  </motion.div>
                )}

                {generatedImage && !generating && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center"
                  >
                    <div className="relative w-full h-64 mb-4">
                      <Image
                        src={generatedImage}
                        alt="生成的宠物照片"
                        fill
                        className="object-contain rounded-lg"
                      />
                    </div>
                    <div className="space-y-3">
                      <Button
                        variant="default"
                        className="w-full rounded-xl bg-[hsl(var(--brand-sage))] text-white hover:bg-[hsl(var(--brand-sage))]/90"
                        onClick={handleDownload}
                      >
                        下载图片
                      </Button>
                      <div className="grid grid-cols-2 gap-3">
                        <Button variant="glass" className="w-full rounded-xl" onClick={handleReset} disabled={generating}>
                          更换模板
                        </Button>
                        <Button asChild variant="hero" className="w-full rounded-xl">
                          <motion.button onClick={handleGenerate} whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.985 }}>
                            再生成一张
                          </motion.button>
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {!generating && !generatedImage && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12 text-gray-500"
                  >
                    <svg
                      className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-foreground">选择模板并点击生成</p>
                    <p className="text-sm mt-2 text-muted-foreground">AI将为你的宠物创作独特照片</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function GeneratePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[image:var(--gradient-soft)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(var(--brand-coral))] mx-auto"></div>
          <p className="mt-4 text-muted-foreground">加载中...</p>
        </div>
      </div>
    }>
      <GenerateContent />
    </Suspense>
  );
}
