"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export function CallToAction() {
  const t = useTranslations('CallToAction');
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 md:p-12 text-center text-primary-foreground">
        <h2 className="text-3xl md:text-4xl font-bold">{t('title')}</h2>
        <p className="text-primary-foreground/90 mt-4 max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
        <Button size="lg" variant="secondary" className="mt-8 text-primary" asChild>
          <Link href="/calculator">
            {t('cta')} <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </section>
  );
}