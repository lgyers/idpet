"use client";

import { motion } from "framer-motion";
import { Hammer } from "lucide-react";

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-[image:var(--gradient-soft)] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto"
      >
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Hammer className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-4">功能开发中</h1>
        <p className="text-muted-foreground text-lg mb-8">
          社区功能正在紧锣密鼓地开发中，敬请期待！在这里您将能看到更多精彩的宠物创作。
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
