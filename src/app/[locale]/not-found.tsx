'use client';
import { Link } from "@/i18n/navigation";
import { useTranslations } from 'next-intl';


export default function Component() {
  const t = useTranslations('NotFoundPage');
  return (
    <div className="flex items-center min-h-screen px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <div className="w-full space-y-6 text-center">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-primary tracking-tighter sm:text-5xl">404</h1>
          <h2 className="text-2xl font-bold tracking-tighter text-primary sm:text-3xl">{t('title')}</h2>
          <p className="text-primary/90">{t('description')}</p>
        </div>
        <Link
          href="/"
          className="inline-flex h-10 items-center rounded-md bg-primary px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-primary dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
          prefetch={false}
        >
          {t('goHome')}
        </Link>
      </div>
    </div>
  )
}