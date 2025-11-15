"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "填写评估表",
      description: "输入关于薪资、福利、工作强度、成长机会等详细信息"
    },
    {
      number: "2",
      title: "智能分析",
      description: "系统基于科学模型对各项指标进行量化分析和加权计算"
    },
    {
      number: "3",
      title: "获取报告",
      description: "获得详细的价值评分和个性化改进建议"
    }
  ];

  return (
    <section id="how-it-works" className="container mx-auto px-4 py-16 md:py-24 bg-muted/50 rounded-2xl">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-bold">工作价值评估是如何运作的？</h2>
        <p className="text-muted-foreground mt-4">
          简单三步，全面了解你的工作性价比
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {steps.map((step, index) => (
          <div key={index} className="text-center">
            <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-6 text-xl font-bold">
              {step.number}
            </div>
            <h3 className="text-xl font-semibold">{step.title}</h3>
            <p className="text-muted-foreground mt-2">
              {step.description}
            </p>
          </div>
        ))}
      </div>
      <div className="text-center mt-12">
        <Button size="lg" asChild>
          <Link href="/calculator">立即体验</Link>
        </Button>
      </div>
    </section>
  );
}