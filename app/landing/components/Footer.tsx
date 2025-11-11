"use client";

import { Button } from "@/components/ui/button";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

export function Footer() {
  const { setTheme } = useTheme();

  return (
    <footer className="container mx-auto px-4 py-8 border-t">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="bg-primary p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground">
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2v20"></path>
              <path d="m2 12 4 4 4-4"></path>
              <path d="m22 12-4-4-4 4"></path>
            </svg>
          </div>
          <span className="text-lg font-semibold">工作价值计算器</span>
        </div>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTheme("light")}
            aria-label="浅色模式"
          >
            <Sun className="h-4 w-4 mr-2" />
            浅色
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTheme("dark")}
            aria-label="深色模式"
          >
            <Moon className="h-4 w-4 mr-2" />
            深色
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTheme("system")}
            aria-label="跟随系统"
          >
            <Monitor className="h-4 w-4 mr-2" />
            跟随系统
          </Button>
        </div>
        <div className="mt-4 md:mt-0 text-muted-foreground text-sm">
          © {new Date().getFullYear()} 工作价值计算器. 保留所有权利.
        </div>
      </div>
    </footer>
  );
}