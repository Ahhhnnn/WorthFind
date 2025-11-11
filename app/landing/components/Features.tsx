"use client";

import { Calculator, Target, TrendingUp, Users, Lightbulb, ArrowRight } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: <Calculator className="h-6 w-6" />,
      title: "个性化评估模型",
      description: "根据你的具体情况定制评估标准，确保结果贴合实际"
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "多维度分析",
      description: "综合考虑薪资、成长空间、工作环境等多个关键因素"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "趋势预测",
      description: "不仅评估现状，还能预测未来发展潜力"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "同行对比",
      description: "匿名对比行业平均水平，了解自身定位"
    },
    {
      icon: <Lightbulb className="h-6 w-6" />,
      title: "改进建议",
      description: "基于评估结果提供可操作的优化建议"
    },
    {
      icon: <ArrowRight className="h-6 w-6" />,
      title: "决策支持",
      description: "为跳槽、升职谈判等重要决策提供数据支撑"
    }
  ];

  return (
    <section id="features" className="container mx-auto px-4 py-16 md:py-24">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-bold">为什么选择我们的工作价值计算器？</h2>
        <p className="text-muted-foreground mt-4">
          我们提供一套完整的解决方案，帮助你全面评估工作性价比
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="bg-card border rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="bg-primary/10 p-2 rounded-lg w-fit">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold mt-4">{feature.title}</h3>
            <p className="text-muted-foreground mt-2">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}