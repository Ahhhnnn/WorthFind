"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Target, TrendingUp, Lightbulb } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24 flex flex-col items-center text-center">
      <h1 className="text-4xl md:text-6xl font-bold max-w-3xl leading-tight">
        科学评估你的工作<span className="text-primary">性价比</span>
      </h1>
      <p className="text-xl text-muted-foreground mt-6 max-w-2xl">
        通过结构化模型，全面分析你的工作投入与产出比例，帮助你做出更明智的职业决策
      </p>
      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <Button size="lg" className="text-lg px-8 py-6" asChild>
          <Link href="/calculator">
            开始计算 <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
        <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
          <Link href="#how-it-works">了解更多</Link>
        </Button>
      </div>
      <div className="mt-16 rounded-xl bg-card border p-6 shadow-lg max-w-4xl w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center p-4">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">精准测量</h3>
            <p className="text-muted-foreground text-sm mt-2">多维度评估工作回报与付出</p>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">数据驱动</h3>
            <p className="text-muted-foreground text-sm mt-2">基于科学模型的客观分析</p>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <Lightbulb className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">决策支持</h3>
            <p className="text-muted-foreground text-sm mt-2">为职业发展提供有力参考</p>
          </div>
        </div>
      </div>
    </section>
  );
}