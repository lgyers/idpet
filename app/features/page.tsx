"use client";

import { motion } from "framer-motion";
import { CheckCircle, Upload, Sparkles, Download, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "智能上传",
    description: "支持拖拽上传，自动检测宠物面部，智能裁剪和优化",
    details: ["支持 JPG、PNG、WEBP 格式", "最大 10MB 文件大小", "自动面部检测和裁剪"],
  },
  {
    icon: Sparkles,
    title: "AI 场景生成",
    description: "基于深度学习的图像生成技术，创造逼真的宠物照片",
    details: ["多种场景模板选择", "高质量图像生成", "快速处理速度"],
  },
  {
    icon: Download,
    title: "一键下载",
    description: "生成完成后可立即下载高清图片，支持多种分辨率",
    details: ["高清分辨率输出", "批量下载支持", "多种格式选择"],
  },
  {
    icon: Shield,
    title: "隐私保护",
    description: "严格的数据保护措施，确保您的照片和信息安全",
    details: ["端到端加密传输", "定期数据清理", "符合 GDPR 标准"],
  },
  {
    icon: Zap,
    title: "极速处理",
    description: "优化的算法和基础设施，提供快速的生成体验",
    details: ["平均 30 秒生成时间", "实时进度显示", "失败自动重试"],
  },
];

const scenarios = [
  {
    title: "证件照",
    description: "专业的宠物证件照，适用于各种官方场合",
    examples: ["宠物护照照片", "宠物登记证", "比赛报名照"],
  },
  {
    title: "职业角色",
    description: "让宠物化身各种职业角色，趣味十足",
    examples: ["医生、警察、消防员", "教师、厨师、艺术家", "商务人士、科学家"],
  },
  {
    title: "文化风格",
    description: "融合不同文化元素的创意照片",
    examples: ["中国传统服饰", "日本和服造型", "西方宫廷风格"],
  },
  {
    title: "节日主题",
    description: "各种节日和庆典主题的照片",
    examples: ["圣诞节、春节", "万圣节、感恩节", "生日、纪念日"],
  },
  {
    title: "奇幻场景",
    description: "将宠物放入奇幻的场景中",
    examples: ["太空宇航员", "童话世界", "魔法森林"],
  },
  {
    title: "艺术创作",
    description: "艺术风格的创意照片",
    examples: ["油画风格", "水彩画效果", "素描和插画"],
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-6">强大功能，简单易用</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            利用先进的 AI 技术，为您的宠物创造令人惊叹的照片
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <Icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-center text-gray-700">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-sm">{detail}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-6">丰富的场景模板</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            选择适合的场景，让 AI 为您的宠物创造独特的照片
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {scenarios.map((scenario, index) => (
            <motion.div
              key={scenario.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{scenario.title}</h3>
              <p className="text-gray-600 mb-6">{scenario.description}</p>
              <ul className="space-y-2">
                {scenario.examples.map((example, exampleIndex) => (
                  <li key={exampleIndex} className="flex items-center text-gray-700">
                    <CheckCircle className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" />
                    <span className="text-sm">{example}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">准备好开始了吗？</h2>
            <p className="text-xl mb-8 opacity-90">立即上传照片，体验 AI 魔法</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = "/upload"}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              免费开始
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}