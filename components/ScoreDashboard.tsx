"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DimensionScore {
  score: number; // 0-100
  label: string;
  percentage: number; // 权重百分比
  icon?: string;
}

interface ScoreDashboardProps {
  totalScore: number; // 0-100
  dimensions: DimensionScore[];
}

// 根据得分获取颜色
const getScoreColor = (score: number) => {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-blue-600";
  if (score >= 40) return "text-yellow-600";
  return "text-red-600";
};

// 仪表盘环形进度条
const CircularProgress = ({ score, size = 120 }: { score: number; size?: number }) => {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <div className={cn("relative", `w-${size / 4} h-${size / 4}`)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-muted"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          className={getScoreColor(score)}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("text-2xl font-bold", getScoreColor(score))}>
          {score.toFixed(0)}
        </span>
        <span className="text-xs text-muted-foreground">综合得分</span>
      </div>
    </div>
  );
};

// 小进度条
const MiniProgressBar = ({ score }: { score: number }) => {
  return (
    <div className="w-full bg-muted rounded-full h-1.5 mt-1">
      <motion.div
        className={cn("h-1.5 rounded-full", getScoreColor(score))}
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </div>
  );
};

export function ScoreDashboard({ totalScore, dimensions }: ScoreDashboardProps) {

  return (
    <div className="mb-8 rounded-xl border bg-card shadow-sm overflow-hidden">
      {/* 顶部 - 综合得分仪表盘 */}
      <div className="px-6 py-6 bg-linear-to-r from-primary/5 to-secondary/5 border-b">
        <div className="flex items-center justify-center gap-8">
          <CircularProgress score={totalScore} size={160} />
          <div className="space-y-1">
            <h2 className="text-xl font-bold">工作性价比评分</h2>
            <p className={cn("text-3xl font-extrabold", getScoreColor(totalScore))}>
              {totalScore.toFixed(1)}
            </p>
            <p className="text-sm text-muted-foreground">
              {totalScore >= 80 && "🎉 优秀 - 你的工作性价比很高！"}
              {totalScore >= 60 && totalScore < 80 && "💼 良好 - 整体表现不错"}
              {totalScore >= 40 && totalScore < 60 && "😊 中等 - 还有提升空间"}
              {totalScore < 40 && "📈 待改善 - 建议重新评估"}
            </p>
          </div>
        </div>
      </div>

      {/* 底部 - 各维度小指标 */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {dimensions.map((dim, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{dim.icon}</span>
                  <span className="text-xs font-medium text-muted-foreground">
                    {dim.label}
                  </span>
                </div>
                <span className={cn("text-xs font-bold", getScoreColor(dim.score))}>
                  {dim.score.toFixed(1)}
                </span>
              </div>
              <MiniProgressBar score={dim.score} />
              <span className="text-xs text-muted-foreground mt-1 block">
                权重: {dim.percentage}%
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
