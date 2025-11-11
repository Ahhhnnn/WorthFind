"use client";

import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";

export function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="container mx-auto px-4 py-6 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <div className="bg-primary p-2 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground">
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2v20"></path>
            <path d="m2 12 4 4 4-4"></path>
            <path d="m22 12-4-4-4 4"></path>
          </svg>
        </div>
        <span className="text-2xl font-bold">工作价值计算器</span>
      </div>
      <div className="flex items-center space-x-4">
        <nav className="hidden md:flex space-x-8">
          <Link href="#features" className="text-foreground/80 hover:text-foreground transition-colors">功能特性</Link>
          <Link href="#how-it-works" className="text-foreground/80 hover:text-foreground transition-colors">如何运作</Link>
          <Link href="#testimonials" className="text-foreground/80 hover:text-foreground transition-colors">用户评价</Link>
        </nav>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="切换主题"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </div>
    </header>
  );
}