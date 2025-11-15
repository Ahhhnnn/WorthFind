"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Target, TrendingUp, Lightbulb } from "lucide-react";
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export function Hero() {
  const t = useTranslations('Hero');
  return (
    <section className="container mx-auto px-4 py-16 md:py-24 flex flex-col items-center text-center">
      <h1 className="text-4xl md:text-6xl font-bold max-w-3xl leading-tight">
        {t('title')}<span className="text-primary">{t('titleHighlight')}</span>
      </h1>
      <p className="text-xl text-muted-foreground mt-6 max-w-2xl">
        {t('subtitle')}
      </p>
      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <Button size="lg" className="text-lg px-8 py-6" asChild>
          <Link href="/calculator">
            {t('cta.start')} <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
        <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
          <Link href="#how-it-works">{t('cta.learnMore')}</Link>
        </Button>
      </div>
      <div className="mt-16 rounded-xl bg-card border p-6 shadow-lg max-w-4xl w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center p-4">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">{t('highlights.precision.title')}</h3>
            <p className="text-muted-foreground text-sm mt-2">{t('highlights.precision.description')}</p>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">{t('highlights.dataDriven.title')}</h3>
            <p className="text-muted-foreground text-sm mt-2">{t('highlights.dataDriven.description')}</p>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <Lightbulb className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">{t('highlights.support.title')}</h3>
            <p className="text-muted-foreground text-sm mt-2">{t('highlights.support.description')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}