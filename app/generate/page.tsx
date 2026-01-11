"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface Template {
  id: string | number;
  name: string;
  description: string;
  category: string;
  preview: string;
  prompt: string;
}

function GenerateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

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
        }
      } catch { }
    };
    fetchTemplates();
  }, []);

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
    if (!selectedTemplate || !uploadedImage) {
      setError("请选择场景模板");
      return;
    }

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
          templateId: selectedTemplate.id,
          customPrompt: selectedTemplate.prompt,
          resolution: "medium", // 免费用户使用中等分辨率
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
    setSelectedTemplate(null);
    setGeneratedImage(null);
    setError("");
    setProgress(0);
  };

  const handleDownload = () => {
    if (generatedImage) {
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
              <button
                onClick={() => router.push("/upload")}
                className="w-full px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted/50 transition-colors"
              >
                重新上传
              </button>
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

              <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {templates.map((template) => (
                  <motion.div
                    key={template.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedTemplate(template)}
                    className={`cursor-pointer rounded-lg border-2 p-3 transition-all ${selectedTemplate?.id === template.id
                      ? "border-[hsl(var(--brand-pink))] bg-[hsl(var(--brand-pink))]/5"
                      : "border-border hover:border-[hsl(var(--brand-pink))]/50"
                      }`}
                  >
                    <div className="relative w-full h-24 mb-2">
                      <Image src={template.preview} alt={template.name} fill className="object-cover rounded" />
                    </div>
                    <h3 className="font-medium text-sm text-foreground">{template.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
                    <span className="inline-block mt-2 px-2 py-1 text-xs bg-muted text-muted-foreground rounded">
                      {template.category}
                    </span>
                  </motion.div>
                ))}
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {!generating && !generatedImage && (
                <button
                  onClick={handleGenerate}
                  disabled={!selectedTemplate}
                  className="w-full mt-6 px-6 py-3 bg-[image:var(--gradient-warm)] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[hsl(var(--brand-coral))]/20"
                >
                  开始生成
                </button>
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
                    <p className="text-sm text-muted-foreground mt-2">请稍候，这需要30-60秒</p>
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
                      <button
                        onClick={handleDownload}
                        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        下载图片
                      </button>
                      <button
                        onClick={handleReset}
                        className="w-full px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        重新生成
                      </button>
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
