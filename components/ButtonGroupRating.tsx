"use client";

import { cn } from "@/lib/utils";

interface ButtonGroupRatingProps {
  value: number; // 1-5
  onChange: (value: number) => void;
  labels: [string, string, string, string, string];
  color?: "blue" | "green" | "purple" | "yellow" | "red" | "gray";
}

export function ButtonGroupRating({ value, onChange, labels, color = "blue" }: ButtonGroupRatingProps) {
  const colorClasses = {
    blue: {
      base: "text-blue-600",
      border: "border-blue-200",
      bg: "bg-blue-600",
    },
    green: {
      base: "text-green-600",
      border: "border-green-200",
      bg: "bg-green-600",
    },
    purple: {
      base: "text-purple-600",
      border: "border-purple-200",
      bg: "bg-purple-600",
    },
    yellow: {
      base: "text-yellow-600",
      border: "border-yellow-200",
      bg: "bg-yellow-600",
    },
    red: {
      base: "text-red-600",
      border: "border-red-200",
      bg: "bg-red-600",
    },
    gray: {
      base: "text-gray-600",
      border: "border-gray-200",
      bg: "bg-gray-600",
    },
  };

  const selected = colorClasses[color];

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="text-xs text-muted-foreground">{labels[0]}</span>
        <span className="text-xs text-muted-foreground">{labels[4]}</span>
      </div>

      <div className="flex justify-between">
        {[0, 1, 2, 3, 4].map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i + 1)}
            className={cn(
              "flex-1 py-3 px-2 text-sm font-medium border transition-all",
              i < 4 && "border-r-0",
              "first:rounded-l-lg last:rounded-r-lg",
              value === i + 1
                ? `${selected.base} border-current bg-current bg-opacity-10 shadow`
                : "border-border hover:bg-muted/30"
            )}
          >
            <span className={cn(value === i + 1 && "font-semibold")}>{i + 1}</span>
            <span className={cn("block mt-1 text-xs", value === i + 1 ? "text-current" : "text-muted-foreground")}>
              {labels[i]}
            </span>
          </button>
        ))}
      </div>

      <div className="w-full">
        <div className={cn("w-full bg-muted rounded-full h-2")}>
          <div
            className={cn("h-2 rounded-full transition-all", selected.bg)}
            style={{ width: `${(value / 5) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
