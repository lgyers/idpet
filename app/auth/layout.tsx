import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "认证 - PetPhoto AI",
  description: "登录或注册 PetPhoto AI 账户",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}