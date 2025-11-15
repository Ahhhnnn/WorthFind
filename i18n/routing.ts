import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // 支持的所有语言
  locales: ['zh-CN', 'en'],

  // 默认语言
  defaultLocale: 'zh-CN'
});

// 轻量级包装器，用于 Next.js 的导航 API，支持国际化
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
