import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // 匹配所有路径，除了 api、_next/static、_next/image 和 favicon.ico
  matcher: ['/', '/(zh-CN|en)/:path*', '/((?!_next|_vercel|.*\\..*).*)']
};
