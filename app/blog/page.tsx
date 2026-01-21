"use client";

import { motion } from "framer-motion";
import { Coffee } from "lucide-react";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[image:var(--gradient-soft)] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto"
      >
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Coffee className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-4">功能开发中</h1>
        <p className="text-muted-foreground text-lg mb-8">
          博客板块正在建设中，我们将很快为您带来最新的宠物摄影技巧和行业动态。
        </p>
        <button 
          onClick={() => window.history.back()}
          className="px-6 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          返回上一页
        </button>
      </motion.div>
    </div>
  );
}
