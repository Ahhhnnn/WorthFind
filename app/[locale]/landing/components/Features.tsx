"use client";

import { Calculator, Target, TrendingUp, Users, Lightbulb, ArrowRight } from "lucide-react";
import { useTranslations } from 'next-intl';

export function Features() {
  const t = useTranslations('Features');
  
  const features = [
    {
      icon: <Calculator className="h-6 w-6" />,
      title: t('list.customized.title'),
      description: t('list.customized.description')
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: t('list.multiDimensional.title'),
      description: t('list.multiDimensional.description')
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: t('list.trend.title'),
      description: t('list.trend.description')
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: t('list.comparison.title'),
      description: t('list.comparison.description')
    },
    {
      icon: <Lightbulb className="h-6 w-6" />,
      title: t('list.suggestions.title'),
      description: t('list.suggestions.description')
    },
    {
      icon: <ArrowRight className="h-6 w-6" />,
      title: t('list.decision.title'),
      description: t('list.decision.description')
    }
  ];

  return (
    <section id="features" className="container mx-auto px-4 py-16 md:py-24">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-bold">{t('title')}</h2>
        <p className="text-muted-foreground mt-4">
          {t('subtitle')}
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