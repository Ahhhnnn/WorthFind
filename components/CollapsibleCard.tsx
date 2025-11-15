"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollapsibleCardProps {
  title: string;
  icon?: React.ReactNode;
  score?: number; // 0-100
  defaultExpanded?: boolean;
  children: React.ReactNode;
  color?: "blue" | "green" | "purple" | "yellow" | "red" | "gray";
}

export function CollapsibleCard({
  title,
  icon,
  score = 0,
  defaultExpanded = false,
  children,
  color = "gray",
}: CollapsibleCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const colorClasses = {
    blue: "border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20",
    green: "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20",
    purple: "border-purple-200 bg-purple-50/50 dark:border-purple-800 dark:bg-purple-950/20",
    yellow: "border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-950/20",
    red: "border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20",
    gray: "border-border bg-card",
  };

  // 根据得分获取颜色
  const getScoreColor = () => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className={cn("mb-4 rounded-xl border shadow-sm transition-all", colorClasses[color])}>
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon}
          <div>
            <h3 className="text-lg font-semibold text-left">{title}</h3>
            {score > 0 && (
              <span className={cn("text-sm font-medium", getScoreColor())}>
                得分: {score.toFixed(1)}
              </span>
            )}
          </div>
        </div>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-muted-foreground transition-transform",
            isExpanded && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
