"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CallToAction() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 md:p-12 text-center text-primary-foreground">
        <h2 className="text-3xl md:text-4xl font-bold">准备好评估你的工作价值了吗？</h2>
        <p className="text-primary-foreground/90 mt-4 max-w-2xl mx-auto">
          加入数千名职场人士，通过科学方法了解自己的工作性价比，做出更明智的职业决策
        </p>
        <Button size="lg" variant="secondary" className="mt-8 text-primary" asChild>
          <Link href="/calculator">
            免费开始计算 <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </section>
  );
}