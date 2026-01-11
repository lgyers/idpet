"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Eye, Share2, Upload, Loader } from "lucide-react";

interface Submission {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  petName: string;
  petBreed?: string;
  template: {
    id: string;
    name: string;
  };
  user: {
    id: string;
    name?: string;
    image?: string;
  };
  likes: number;
  views: number;
  createdAt: string;
}

export default function CommunityPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, [selectedFilter, page]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", "12");
      if (selectedFilter !== "all") {
        params.append("featured", selectedFilter === "featured" ? "true" : "false");
      }

      const response = await fetch(`/api/community?${params}`);
      const data = await response.json();

      setSubmissions(data.submissions);
      setTotalPages(data.pagination.pages);
    } catch (error) {
      console.error("获取社区投稿失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id: string) => {
    try {
      await fetch(`/api/community/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "like" }),
      });
      fetchSubmissions();
    } catch (error) {
      console.error("点赞失败:", error);
    }
  };

  const handleSubmit = () => {
    if (!session) {
      router.push("/auth/login");
      return;
    }
    setShowModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("zh-CN");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4">社区创意库</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            分享你的宠物创意照片，展示独特风格，获得社区认可
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            <Upload className="w-5 h-5" />
            上传你的作品
          </motion.button>
        </motion.div>

        {/* 筛选 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center gap-4 mb-12"
        >
          <button
            onClick={() => {
              setSelectedFilter("all");
              setPage(1);
            }}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              selectedFilter === "all"
                ? "bg-purple-600 text-white shadow-lg"
                : "bg-white text-gray-700 border border-gray-300 hover:border-purple-600"
            }`}
          >
            全部作品
          </button>
          <button
            onClick={() => {
              setSelectedFilter("featured");
              setPage(1);
            }}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              selectedFilter === "featured"
                ? "bg-purple-600 text-white shadow-lg"
                : "bg-white text-gray-700 border border-gray-300 hover:border-purple-600"
            }`}
          >
            精选作品 ⭐
          </button>
        </motion.div>

        {/* 投稿列表 */}
        {loading ? (
          <div className="text-center py-12">
            <Loader className="w-12 h-12 animate-spin mx-auto text-purple-600" />
          </div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-6">暂无投稿</p>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              成为第一个分享的用户
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {submissions.map((submission, index) => (
                <motion.div
                  key={submission.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="relative h-64">
                    <Image
                      src={submission.imageUrl}
                      alt={submission.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {submission.template.name}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {submission.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {submission.description}
                    </p>

                    <div className="mb-4 text-sm text-gray-500">
                      <p>宠物名字：{submission.petName}</p>
                      {submission.petBreed && <p>品种：{submission.petBreed}</p>}
                    </div>

                    <div className="flex items-center gap-3 mb-4 text-sm">
                      <div className="relative w-8 h-8">
                        {submission.user.image && (
                          <Image
                            src={submission.user.image}
                            alt={submission.user.name || "用户"}
                            fill
                            className="rounded-full object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {submission.user.name || "匿名用户"}
                        </p>
                        <p className="text-gray-500">{formatDate(submission.createdAt)}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-4 text-gray-600">
                        <button
                          onClick={() => handleLike(submission.id)}
                          className="flex items-center gap-1 hover:text-red-500 transition-colors"
                        >
                          <Heart className="w-5 h-5" />
                          <span>{submission.likes}</span>
                        </button>
                        <span className="flex items-center gap-1">
                          <Eye className="w-5 h-5" />
                          <span>{submission.views}</span>
                        </span>
                      </div>
                      <button className="text-gray-600 hover:text-purple-600 transition-colors">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* 分页 */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center gap-4"
              >
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  上一页
                </button>

                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) =>
                  page > 3 ? i + page - 2 : i + 1
                ).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-4 py-2 rounded-lg ${
                      p === page
                        ? "bg-purple-600 text-white"
                        : "border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  下一页
                </button>
              </motion.div>
            )}
          </>
        )}

        {/* 上传模态框 */}
        {showModal && <SubmitModal onClose={() => setShowModal(false)} onSuccess={fetchSubmissions} />}
      </div>
    </div>
  );
}

function SubmitModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    petName: "",
    petBreed: "",
    templateId: "",
  });
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch("/api/templates");
      const data = await response.json();
      setTemplates(data || []);
    } catch (error) {
      console.error("获取模板失败:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("投稿成功！审核通过后将显示在社区");
        onClose();
        onSuccess();
      } else {
        alert("投稿失败，请重试");
      }
    } catch (error) {
      console.error("投稿失败:", error);
      alert("投稿失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">上传你的作品</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="作品标题"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <textarea
            placeholder="作品描述"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 h-20"
          />

          <input
            type="url"
            placeholder="图片 URL"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="text"
            placeholder="宠物名字"
            value={formData.petName}
            onChange={(e) => setFormData({ ...formData, petName: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="text"
            placeholder="宠物品种（可选）"
            value={formData.petBreed}
            onChange={(e) => setFormData({ ...formData, petBreed: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <select
            value={formData.templateId}
            onChange={(e) => setFormData({ ...formData, templateId: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">选择场景模板</option>
            {templates.map((t: any) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? "上传中..." : "提交"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              取消
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
