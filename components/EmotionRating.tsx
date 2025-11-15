"use client";

import { cn } from "@/lib/utils";

interface EmotionRatingProps {
  value: number; // 1-5
  onChange: (value: number) => void;
  labels: [string, string, string, string, string];
  icons?: [string, string, string, string, string];
}

export function EmotionRating({ value, onChange, labels, icons = ["😡", "😟", "😐", "😊", "😄"] }: EmotionRatingProps) {
  const getEmotionColor = (score: number, index: number) => {
    if (index < 2) return "text-red-600 border-red-200";
    if (index < 3) return "text-yellow-600 border-yellow-200";
    return "text-green-600 border-green-200";
  };

  return (
    <div className="w-full">
      <div className="flex justify-between mb-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i + 1)}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-2 rounded-lg border transition-all hover:scale-105",
              value === i + 1
                ? `${getEmotionColor(i + 1, i)} bg-opacity-10 bg-current scale-105`
                : "border-border hover:border-muted-foreground/50"
            )}
          >
            <span className={cn("text-2xl", value === i + 1 && "drop-shadow")}>
              {icons[i]}
            </span>
            <span className={cn(
              "text-xs font-medium whitespace-nowrap",
              value === i + 1 ? "text-current" : "text-muted-foreground"
            )}>
              {labels[i]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
