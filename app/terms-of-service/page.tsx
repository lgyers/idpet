import { Metadata } from "next";
import { TermsOfServiceContent } from "@/components/TermsOfServiceContent";

export const metadata: Metadata = {
  title: "服务条款 | PetPhoto AI",
  description: "使用 PetPhoto AI 服务的条款和条件",
};

export default function TermsOfService() {
  return <TermsOfServiceContent />;
}