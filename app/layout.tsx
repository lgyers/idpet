import type { Metadata } from "next";
import { SessionProviderWrapper } from "@/components/SessionProviderWrapper";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "PetPhoto - 萌宠拟人化 AI 创意照片生成",
  description: "上传宠物照，AI 一键生成医生、宇航员等创意证件照。支持古装、和服等文化风格。",
  keywords: ["宠物照片", "AI 生成", "拟人化", "创意证件照", "宠物社交"],
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  metadataBase: new URL("https://petphoto.app"),
  alternates: {
    canonical: "https://petphoto.app",
  },
  openGraph: {
    title: "PetPhoto - 萌宠拟人化 AI 创意照片生成",
    description: "用 AI 为你的宠物生成创意拟人化照片",
    url: "https://petphoto.app",
    type: "website",
    locale: "zh_CN",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="application-name" content="PetPhoto" />
        <meta name="apple-mobile-web-app-title" content="PetPhoto" />
      </head>
      <body
        className="antialiased"
      >
        <SessionProviderWrapper>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
