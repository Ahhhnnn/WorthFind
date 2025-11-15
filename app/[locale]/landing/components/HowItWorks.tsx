"use client";

import { Button } from "@/components/ui/button";
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export function HowItWorks() {
  const t = useTranslations('HowItWorks');
  
  const steps = [
    {
      number: "1",
      title: t('steps.step1.title'),
      description: t('steps.step1.description')
    },
    {
      number: "2",
      title: t('steps.step2.title'),
      description: t('steps.step2.description')
    },
    {
      number: "3",
      title: t('steps.step3.title'),
      description: t('steps.step3.description')
    }
  ];

  return (
    <section id="how-it-works" className="container mx-auto px-4 py-16 md:py-24 bg-muted/50 rounded-2xl">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-bold">{t('title')}</h2>
        <p className="text-muted-foreground mt-4">
          {t('subtitle')}
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
          <Link href="/calculator">{t('cta')}</Link>
        </Button>
      </div>
    </section>
  );
}