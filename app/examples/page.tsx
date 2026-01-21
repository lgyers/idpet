"use client";

import { motion } from "framer-motion";
import { Download, Heart, Share2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

const examples = [
  {
    id: 1,
    title: "百天照",
    description: "温柔童趣的百天纪念肖像",
    category: "百天照",
    image: "/assets/examples/haimati/baityanzhao/cat-siamese-v1.png",
    likes: 0,
    downloads: 0,
  },
  {
    id: 2,
    title: "蓝底证件照",
    description: "标准证件照蓝色背景",
    category: "蓝底证件照",
    image: "/assets/examples/haimati/blue-id/dog-labrador-v4.png",
    likes: 0,
    downloads: 0,
  },
  {
    id: 3,
    title: "医生职业照",
    description: "白大褂与听诊器的职业肖像",
    category: "医生职业照",
    image: "/assets/examples/haimati/doctor/dog-golden-retriever-v3.png",
    likes: 0,
    downloads: 0,
  },
  {
    id: 4,
    title: "学士服毕业照",
    description: "校园毕业氛围与学士服造型",
    category: "学士服毕业照",
    image: "/assets/examples/haimati/graduation/cat-ragdoll-v2.png",
    likes: 0,
    downloads: 0,
  },
  {
    id: 5,
    title: "唐装",
    description: "传统唐装造型与喜庆氛围",
    category: "唐装",
    image: "/assets/examples/haimati/tangzhuang/dog-golden-retriever-v4.png",
    likes: 0,
    downloads: 0,
  },
  {
    id: 6,
    title: "白领西装照",
    description: "商务正装的职业形象照",
    category: "白领西装照",
    image: "/assets/examples/haimati/white-collar/cat-ragdoll-v1.png",
    likes: 0,
    downloads: 0,
  },
  {
    id: 7,
    title: "日系可爱风",
    description: "清新软萌的日系写真",
    category: "日系可爱风",
    image: "/assets/examples/haimati/japanese-kawaii/dog-corgi-v4.png",
    likes: 0,
    downloads: 0,
  },
  {
    id: 8,
    title: "东方美学古韵风",
    description: "古韵留白与东方审美",
    category: "东方美学古韵风",
    image: "/assets/examples/haimati/oriental-aesthetic/cat-ragdoll-v1.png",
    likes: 0,
    downloads: 0,
  },
  {
    id: 9,
    title: "婚纱摄影",
    description: "浪漫婚礼氛围大片",
    category: "婚纱摄影",
    image: "/assets/examples/haimati/wedding/cat-ragdoll-v1.png",
    likes: 0,
    downloads: 0,
  },
];

const categories = [
  "全部",
  "百天照",
  "蓝底证件照",
  "医生职业照",
  "学士服毕业照",
  "唐装",
  "白领西装照",
  "日系可爱风",
  "东方美学古韵风",
  "婚纱摄影",
  "金婚照",
  "漫威钢铁侠",
];

type ExampleItem = {
  id: number;
  title: string;
  description: string;
  category: string;
  image: string;
  likes: number;
  downloads: number;
};

export default function ExamplesPage() {
  const [haimatiExamples, setHaimatiExamples] = useState<ExampleItem[] | null>(null);
  const [displayExamples, setDisplayExamples] = useState<ExampleItem[]>([]);
  const [likedItems, setLikedItems] = useState<Set<number>>(new Set());

  // 随机打乱数组并注入随机数据
  const processExamples = (array: ExampleItem[]) => {
    const newArray = array.map(item => ({
      ...item,
      likes: Math.floor(Math.random() * (500 - 50 + 1)) + 50,
      downloads: Math.floor(Math.random() * (1000 - 100 + 1)) + 100
    }));
    
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/assets/examples/haimati/manifest.json", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load");
        const data = await res.json();
        const items = Array.isArray(data?.items) ? (data.items as ExampleItem[]) : null;
        
        if (cancelled) return;

        if (items && items.length > 0) {
          setHaimatiExamples(items);
          setDisplayExamples(processExamples(items));
        } else {
          setDisplayExamples(processExamples(examples));
        }
      } catch {
        if (!cancelled) {
          setDisplayExamples(processExamples(examples));
        }
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleLike = (id: number) => {
    const newLiked = new Set(likedItems);
    if (newLiked.has(id)) {
      newLiked.delete(id);
    } else {
      newLiked.add(id);
    }
    setLikedItems(newLiked);
  };

  const handleDownload = async (imageSrc: string, title: string) => {
    try {
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title}-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
      window.open(imageSrc, "_blank");
    }
  };

  const handleShare = (title: string, category: string) => {
    const text = `看看这个超棒的${category}宠物照片：${title} - 来自 PetPhoto`;
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: title,
        text: text,
        url: url
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(`${text} ${url}`).then(() => {
        alert("链接已复制到剪贴板！");
      }).catch(console.error);
    }
  };

  return (
    <div className="min-h-screen bg-[image:var(--gradient-soft)] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-foreground mb-6">精彩示例</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            查看其他用户创造的精彩作品，获取灵感
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {displayExamples.map((example, index) => (
            <motion.div
              key={example.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[hsl(var(--glass-bg))] backdrop-blur-md border border-[hsl(var(--glass-border))] rounded-2xl shadow-card overflow-hidden hover:bg-muted/40 transition-colors"
            >
              <div className="relative h-64 cursor-pointer" onClick={() => handleDownload(example.image, example.title)}>
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
                <h3 className="text-xl font-bold text-foreground mb-2">{example.title}</h3>
                <p className="text-muted-foreground mb-4">{example.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => toggleLike(example.id)}
                      className={`flex items-center transition-colors ${
                        likedItems.has(example.id) ? "text-red-500" : "text-muted-foreground hover:text-red-500"
                      }`}
                    >
                      <Heart className={`w-5 h-5 mr-1 ${likedItems.has(example.id) ? "fill-current" : ""}`} />
                      <span className="text-sm">{example.likes + (likedItems.has(example.id) ? 1 : 0)}</span>
                    </button>
                    <button
                      onClick={() => handleDownload(example.image, example.title)}
                      className="flex items-center text-muted-foreground hover:text-blue-500 transition-colors"
                    >
                      <Download className="w-5 h-5 mr-1" />
                      <span className="text-sm">{example.downloads}</span>
                    </button>
                  </div>
                  <button
                    onClick={() => handleShare(example.title, example.category)}
                    className="text-muted-foreground hover:text-blue-500 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-20 text-center"
        >
          <div className="bg-[image:var(--gradient-warm)] rounded-2xl p-12 text-white shadow-card">
            <h2 className="text-3xl font-bold mb-4">创造属于您的作品</h2>
            <p className="text-xl mb-8 opacity-90">上传宠物照片，开始您的创作之旅</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = "/upload"}
              className="bg-white/90 text-purple-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white transition-colors dark:bg-white/20 dark:text-white dark:hover:bg-white/30"
            >
              立即开始
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
