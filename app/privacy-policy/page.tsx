import { Metadata } from "next";
import { PrivacyPolicyContent } from "@/components/PrivacyPolicyContent";

export const metadata: Metadata = {
  title: "隐私政策 | PetPhoto AI",
  description: "了解 PetPhoto AI 如何收集、使用和保护您的个人信息",
};

export default function PrivacyPolicy() {
  return <PrivacyPolicyContent />;
}