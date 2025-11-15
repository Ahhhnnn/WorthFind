"use client";

import { Button } from "@/components/ui/button";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from 'next-intl';

export function Footer() {
  const { setTheme } = useTheme();
  const t = useTranslations('Footer');

  return (
    <footer className="container mx-auto px-4 py-8 border-t">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="bg-primary p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground">
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2v20"></path>
              <path d="m2 12 4 4 4-4"></path>
              <path d="m22 12-4-4-4 4"></path>
            </svg>
          </div>
          <span className="text-lg font-semibold">{t('title')}</span>
        </div>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTheme("light")}
            aria-label={t('theme.lightLabel')}
          >
            <Sun className="h-4 w-4 mr-2" />
            {t('theme.light')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTheme("dark")}
            aria-label={t('theme.darkLabel')}
          >
            <Moon className="h-4 w-4 mr-2" />
            {t('theme.dark')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTheme("system")}
            aria-label={t('theme.systemLabel')}
          >
            <Monitor className="h-4 w-4 mr-2" />
            {t('theme.system')}
          </Button>
        </div>
        <div className="mt-4 md:mt-0 text-muted-foreground text-sm">
          {t('copyright', { year: new Date().getFullYear() })}
        </div>
      </div>
    </footer>
  );
}