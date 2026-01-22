"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

const navItems = [
  { label: "首页", href: "/" },
  { label: "功能", href: "/features" },
  { label: "示例", href: "/examples" },
  { label: "社区", href: "/community" },
  { label: "博客", href: "/blog" },
  { label: "价格", href: "/pricing" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const [themeMounted, setThemeMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setThemeMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const isDark = themeMounted && resolvedTheme === "dark";
  const handleSignOut = async () => {
    await signOut({ redirect: false });
    window.location.href = "/";
  };

  return (
    <nav className="sticky top-0 w-full bg-gray-100/60 dark:bg-gray-900/60 backdrop-blur-md border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center" aria-label="主页">
            <Image
              src="/svgexport-16.svg"
              alt="IDPET Logo"
              width={300}
              height={100}
              priority
              className="h-20 w-auto drop-shadow-[0_2px_2px_rgba(0,0,0,0.7)]"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-foreground hover:text-primary transition-colors relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button
              type="button"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="p-2 rounded-lg border border-border bg-[hsl(var(--glass-bg))] hover:bg-muted/60 transition-colors"
              aria-label={isDark ? "切换到浅色模式" : "切换到深色模式"}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {status === "loading" ? (
              <div className="h-10 w-20 bg-muted animate-pulse rounded-lg" />
            ) : session ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      width={40}
                      height={40}
                      className="rounded-full border border-border"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
                      {session.user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-border py-2 overflow-hidden"
                    >
                      <div className="px-4 py-2 border-b border-border">
                        <p className="text-sm font-medium text-foreground truncate">
                          {session.user?.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {session.user?.email}
                        </p>
                      </div>
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        控制台
                      </Link>
                      <Link
                        href="/history"
                        className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        生成历史
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        退出登录
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-4 py-2 rounded-lg text-foreground hover:bg-muted transition-colors"
                >
                  登录
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors"
                >
                  开始使用
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center gap-1.5">
              <span
                className={cn(
                  "w-full h-0.5 bg-foreground transition-all duration-300",
                  isOpen ? "rotate-45 translate-y-2" : ""
                )}
              />
              <span
                className={cn(
                  "w-full h-0.5 bg-foreground transition-all duration-300",
                  isOpen ? "opacity-0" : ""
                )}
              />
              <span
                className={cn(
                  "w-full h-0.5 bg-foreground transition-all duration-300",
                  isOpen ? "-rotate-45 -translate-y-2" : ""
                )}
              />
            </div>
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border overflow-hidden"
            >
              <div className="py-4 space-y-2">
                <button
                  type="button"
                  onClick={() => setTheme(isDark ? "light" : "dark")}
                  className="w-full px-4 py-2 flex items-center justify-between hover:bg-muted rounded-lg transition-colors"
                  aria-label={isDark ? "切换到浅色模式" : "切换到深色模式"}
                >
                  <span className="text-sm text-foreground">主题</span>
                  {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-2 hover:bg-muted rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="pt-4 border-t border-border space-y-2">
                  {session ? (
                    <>
                      <div className="px-4 py-2 flex items-center gap-3">
                        {session.user?.image ? (
                          <Image
                            src={session.user.image}
                            alt={session.user.name || "User"}
                            width={32}
                            height={32}
                            className="rounded-full border border-border"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
                            {session.user?.name?.[0]?.toUpperCase() || "U"}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {session.user?.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {session.user?.email}
                          </p>
                        </div>
                      </div>
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 hover:bg-muted rounded-lg transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        控制台
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        退出登录
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/auth/login"
                        className="block px-4 py-2 text-center hover:bg-muted rounded-lg transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        登录
                      </Link>
                      <Link
                        href="/auth/register"
                        className="block px-4 py-2 text-center bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        开始使用
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
