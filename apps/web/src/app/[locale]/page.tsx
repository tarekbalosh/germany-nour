import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';
export default function Home() {
  const t = useTranslations('home');
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-6">{t('title')}</h1>
      <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">{t('subtitle')}</p>
      <div className="flex justify-center gap-4">
        <Link href="/courses" className="bg-blue-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-700 transition shadow-md">{t('courses')}</Link>
        <Link href="/contact" className="bg-white text-blue-600 border border-blue-600 px-8 py-3 rounded-md font-semibold hover:bg-blue-50 transition">{t('booking')}</Link>
      </div>
    </div>
  );
}
