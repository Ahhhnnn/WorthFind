"use client";

import { Button } from "@/components/ui/button";
import { Sun, Moon, Languages } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations, useLocale } from 'next-intl';
import { Link, useRouter, usePathname } from '@/i18n/routing';

export function Header() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations('Header');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const newLocale = locale === 'zh-CN' ? 'en' : 'zh-CN';
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <header className="container mx-auto px-4 py-6 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <div className="bg-primary p-2 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground">
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2v20"></path>
            <path d="m2 12 4 4 4-4"></path>
            <path d="m22 12-4-4-4 4"></path>
          </svg>
        </div>
        <span className="text-2xl font-bold">{t('title')}</span>
      </div>
      <div className="flex items-center space-x-4">
        <nav className="hidden md:flex space-x-8">
          <Link href="#features" className="text-foreground/80 hover:text-foreground transition-colors">{t('nav.features')}</Link>
          <Link href="#how-it-works" className="text-foreground/80 hover:text-foreground transition-colors">{t('nav.howItWorks')}</Link>
          <Link href="#testimonials" className="text-foreground/80 hover:text-foreground transition-colors">{t('nav.testimonials')}</Link>
        </nav>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleLocale}
          aria-label={t('language.toggle')}
        >
          <Languages className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label={t('theme.toggle')}
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </div>
    </header>
  );
}