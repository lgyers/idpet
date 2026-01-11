"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Eye, Heart, Share2, Loader } from "lucide-react";
import { useRouter } from "next/navigation";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail?: string;
  category: string;
  author: string;
  publishedAt: string;
  readTime?: number;
  viewCount: number;
  likes: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [params.slug]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/blog/${params.slug}`);
      if (response.ok) {
        const data = await response.json();
        setPost(data);
      } else {
        setError("文章不存在");
      }
    } catch (err) {
      console.error("获取文章失败:", err);
      setError("获取文章失败");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.excerpt,
        url: window.location.href,
      });
    } else {
      // 复制到剪贴板
      navigator.clipboard.writeText(window.location.href);
      alert("链接已复制！");
    }
  };

  const handleLike = async () => {
    if (!post) return;
    setLiked(!liked);
    // 可以在这里发送请求更新点赞数
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            返回
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 顶部导航 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-white shadow-sm"
      >
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            href="/blog"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            返回博客
          </Link>
        </div>
      </motion.div>

      {/* 文章头部 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
      >
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
              {post.category}
            </span>
            {post.readTime && (
              <span className="flex items-center gap-1 text-sm">
                <Clock className="w-4 h-4" />
                {post.readTime} 分钟阅读
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>

          <p className="text-lg opacity-90 mb-6">{post.excerpt}</p>

          <div className="flex flex-wrap items-center gap-6 text-sm opacity-90">
            <span>作者：{post.author}</span>
            <span>发布于 {formatDate(post.publishedAt)}</span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {post.viewCount} 次浏览
            </span>
          </div>
        </div>
      </motion.div>

      {/* 文章内容 */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {post.thumbnail && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative h-96 rounded-2xl overflow-hidden shadow-xl mb-12"
          >
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              className="object-cover"
            />
          </motion.div>
        )}

        {/* 文章正文 */}
        <motion.article
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="prose prose-lg max-w-none mb-12"
        >
          <div
            className="bg-white rounded-2xl shadow-lg p-8"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </motion.article>

        {/* 文章尾部 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  liked
                    ? "bg-red-100 text-red-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
                {post.likes + (liked ? 1 : 0)} 人赞同
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
              >
                <Share2 className="w-5 h-5" />
                分享
              </button>
            </div>

            <div className="text-sm text-gray-600">
              最后更新：{formatDate(post.publishedAt)}
            </div>
          </div>
        </motion.div>

        {/* 推荐阅读 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6">继续阅读</h3>
          <Link
            href="/blog"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium"
          >
            查看更多文章
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
