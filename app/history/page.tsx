"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface Generation {
  id: string;
  originalImageUrl: string;
  generatedImageUrl: string;
  templateId: string;
  templateName: string;
  prompt: string;
  createdAt: string;
  status: string;
}

export default function HistoryPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedGeneration, setSelectedGeneration] = useState<Generation | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }

    if (status === "authenticated") {
      fetchGenerations();
    }
  }, [status, router]);

  const fetchGenerations = async () => {
    try {
      const response = await fetch("/api/generations");
      const data = await response.json();

      if (response.ok) {
        setGenerations(data.generations || []);
      } else {
        setError(data.error || "获取生成历史失败");
      }
    } catch (err) {
      setError("获取生成历史失败");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这条记录吗？")) {
      return;
    }

    try {
      const response = await fetch(`/api/generations/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setGenerations(generations.filter((g) => g.id !== id));
        if (selectedGeneration?.id === id) {
          setSelectedGeneration(null);
        }
      } else {
        setError("删除失败");
      }
    } catch (err) {
      setError("删除失败");
    }
  };

  const handleDownload = (url: string) => {
    window.open(url, "_blank");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    const s = status.toUpperCase();
    if (s === "COMPLETED") {
      return (
        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200 rounded-full">
          已完成
        </span>
      );
    }
    if (s === "FAILED") {
      return (
        <span className="px-2 py-1 text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 rounded-full">
          失败
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 rounded-full flex items-center gap-1">
        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>
        处理中
      </span>
    );
  };

  const getStatusText = (status: string) => {
    const s = status.toUpperCase();
    if (s === "COMPLETED") return "已完成";
    if (s === "FAILED") return "失败";
    return "处理中";
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">生成历史</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">查看和管理你的所有生成记录</p>
        </motion.div>

        {generations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <svg
              className="w-24 h-24 mx-auto mb-6 text-gray-300 dark:text-gray-600"
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
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">还没有生成记录</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">开始创建你的第一张宠物创意照片吧</p>
            <button
              onClick={() => router.push("/upload")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              开始生成
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 左侧：生成记录列表 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    生成记录 ({generations.length})
                  </h2>
                  <button
                    onClick={() => router.push("/upload")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    新建生成
                  </button>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {generations.map((generation, index) => (
                    <motion.div
                      key={generation.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedGeneration(generation)}
                      className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                        selectedGeneration?.id === generation.id
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/40"
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="relative w-20 h-20 flex-shrink-0">
                          {generation.status?.toUpperCase() === 'COMPLETED' && generation.generatedImageUrl ? (
                            <Image
                              src={generation.generatedImageUrl}
                              alt={generation.templateName}
                              fill
                              className="object-cover rounded"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                              {generation.status?.toUpperCase() === 'FAILED' ? (
                                <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              ) : (
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                              {generation.templateName}
                            </h3>
                            {getStatusBadge(generation.status)}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                            {formatDate(generation.createdAt)}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                            {generation.prompt}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* 右侧：详情面板 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <AnimatePresence mode="wait">
                {selectedGeneration ? (
                  <motion.div
                    key={selectedGeneration.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
                  >
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">生成详情</h2>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">原始照片</h3>
                        <div className="relative w-full h-32">
                          <Image
                            src={selectedGeneration.originalImageUrl}
                            alt="原始照片"
                            fill
                            className="object-contain rounded-lg bg-gray-50 dark:bg-gray-900/40"
                          />
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">生成结果</h3>
                        <div className="relative w-full h-32">
                          <Image
                            src={selectedGeneration.generatedImageUrl}
                            alt="生成结果"
                            fill
                            className="object-contain rounded-lg bg-gray-50 dark:bg-gray-900/40"
                          />
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">模板</h3>
                        <p className="text-gray-900 dark:text-white">{selectedGeneration.templateName}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">生成时间</h3>
                        <p className="text-gray-900 dark:text-white">{formatDate(selectedGeneration.createdAt)}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">状态</h3>
                        <span className="px-3 py-1 text-sm bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200 rounded-full">
                          {selectedGeneration.status === "completed" ? "已完成" : "处理中"}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <button
                          onClick={() => handleDownload(selectedGeneration.generatedImageUrl)}
                          className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                          下载图片
                        </button>
                        <button
                          onClick={() => handleDelete(selectedGeneration.id)}
                          className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                        >
                          删除记录
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center"
                  >
                    <svg
                      className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">选择记录查看详情</h3>
                    <p className="text-gray-600 dark:text-gray-300">点击左侧的生成记录查看详细信息</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
