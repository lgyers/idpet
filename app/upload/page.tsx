"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function UploadPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const maxUploadBytes = 4 * 1024 * 1024;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (uploadedImage) {
      const timer = setTimeout(() => {
        router.push(`/generate?image=${encodeURIComponent(uploadedImage)}`);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [uploadedImage, router]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith("image/")) {
      setError("请上传图片文件");
      return;
    }

    // 验证文件大小 (最大 4MB)
    if (file.size > maxUploadBytes) {
      setError("文件大小不能超过 4MB");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "上传失败");
      } else {
        setUploadedImage(data.url);
      }
    } catch {
      setError("上传失败，请重试");
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    maxFiles: 1,
    maxSize: maxUploadBytes,
    disabled: uploading,
  });

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[image:var(--gradient-soft)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(var(--brand-coral))] mx-auto"></div>
          <p className="mt-4 text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-[image:var(--gradient-soft)] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-foreground mb-4">上传宠物照片</h1>
          <p className="text-xl text-muted-foreground">让我们开始创作你的专属宠物创意照片</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[hsl(var(--glass-bg))] backdrop-blur-md border border-[hsl(var(--glass-border))] rounded-2xl shadow-card p-8"
        >
          {!uploadedImage ? (
            <div>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${isDragActive
                  ? "border-[hsl(var(--brand-pink))] bg-[hsl(var(--brand-pink))]/5"
                  : "border-border hover:border-[hsl(var(--brand-coral))] hover:bg-muted/50"
                  } ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center">
                  <svg
                    className="w-16 h-16 text-muted-foreground/50 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="text-lg text-foreground mb-2">
                    {isDragActive ? "松开鼠标上传文件" : "拖拽图片到此处或点击上传"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    支持 PNG, JPG, JPEG, WebP 格式，最大 4MB
                  </p>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50/50 border border-red-200 text-red-600 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {uploading && (
                <div className="mt-4 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(var(--brand-coral))] mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">上传中...</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="animate-pulse mb-6">
                <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-foreground mb-2">上传成功！</h2>
                <p className="text-muted-foreground">正在跳转到创意生成页面...</p>
              </div>
              <div className="w-full max-w-xs mx-auto bg-muted rounded-full h-2 overflow-hidden">
                <div className="h-full bg-[hsl(var(--brand-coral))] animate-[progress_1.5s_ease-in-out_infinite]" style={{ width: '100%' }}></div>
              </div>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-[hsl(var(--glass-bg))] backdrop-blur-md border border-[hsl(var(--glass-border))] rounded-xl shadow-card p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">上传提示</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              选择清晰、光线充足的照片，效果更好
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              确保宠物在照片中占据主要位置
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              避免背景过于杂乱的照片
            </li>
            <li className="flex items-start">
              <span className="text-[hsl(var(--brand-coral))] mr-2">•</span>
              支持多种宠物类型：猫、狗、兔子等
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
