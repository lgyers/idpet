"use client";

import { motion } from "framer-motion";
import { Download, Heart, Share2 } from "lucide-react";
import Image from "next/image";

const examples = [
  {
    id: 1,
    title: "商务肖像",
    description: "专业的商务风格宠物肖像照",
    category: "职业角色",
    image: "https://via.placeholder.com/400x400/3B82F6/FFFFFF?text=商务肖像",
    likes: 128,
    downloads: 45,
  },
  {
    id: 2,
    title: "圣诞主题",
    description: "温馨的圣诞节主题照片",
    category: "节日主题",
    image: "https://via.placeholder.com/400x400/EF4444/FFFFFF?text=圣诞主题",
    likes: 256,
    downloads: 89,
  },
  {
    id: 3,
    title: "超级英雄",
    description: "变身超级英雄的宠物",
    category: "奇幻场景",
    image: "https://via.placeholder.com/400x400/8B5CF6/FFFFFF?text=超级英雄",
    likes: 342,
    downloads: 156,
  },
  {
    id: 4,
    title: "古风造型",
    description: "中国传统服饰风格",
    category: "文化风格",
    image: "https://via.placeholder.com/400x400/DC2626/FFFFFF?text=古风造型",
    likes: 189,
    downloads: 67,
  },
  {
    id: 5,
    title: "宇航员",
    description: "太空探险主题的创意照片",
    category: "奇幻场景",
    image: "https://via.placeholder.com/400x400/1F2937/FFFFFF?text=宇航员",
    likes: 278,
    downloads: 123,
  },
  {
    id: 6,
    title: "婚礼主题",
    description: "浪漫的婚礼场景",
    category: "节日主题",
    image: "https://via.placeholder.com/400x400/EC4899/FFFFFF?text=婚礼主题",
    likes: 167,
    downloads: 78,
  },
  {
    id: 7,
    title: "医生角色",
    description: "穿着白大褂的宠物医生",
    category: "职业角色",
    image: "https://via.placeholder.com/400x400/10B981/FFFFFF?text=医生角色",
    likes: 145,
    downloads: 56,
  },
  {
    id: 8,
    title: "证件照",
    description: "标准的宠物证件照",
    category: "证件照",
    image: "https://via.placeholder.com/400x400/6B7280/FFFFFF?text=证件照",
    likes: 98,
    downloads: 34,
  },
  {
    id: 9,
    title: "油画风格",
    description: "艺术油画效果",
    category: "艺术创作",
    image: "https://via.placeholder.com/400x400/F59E0B/FFFFFF?text=油画风格",
    likes: 234,
    downloads: 98,
  },
];

const categories = ["全部", "证件照", "职业角色", "文化风格", "节日主题", "奇幻场景", "艺术创作"];

export default function ExamplesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-6">精彩示例</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            查看其他用户创造的精彩作品，获取灵感
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              className="px-6 py-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600"
            >
              {category}
            </button>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {examples.map((example, index) => (
            <motion.div
              key={example.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative h-64">
                <Image
                  src={example.image}
                  alt={example.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {example.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{example.title}</h3>
                <p className="text-gray-600 mb-4">{example.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center text-gray-500 hover:text-red-500 transition-colors">
                      <Heart className="w-5 h-5 mr-1" />
                      <span className="text-sm">{example.likes}</span>
                    </button>
                    <button className="flex items-center text-gray-500 hover:text-blue-500 transition-colors">
                      <Download className="w-5 h-5 mr-1" />
                      <span className="text-sm">{example.downloads}</span>
                    </button>
                  </div>
                  <button className="text-gray-500 hover:text-blue-500 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">创造属于您的作品</h2>
            <p className="text-xl mb-8 opacity-90">上传宠物照片，开始您的创作之旅</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = "/upload"}
              className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              立即开始
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}