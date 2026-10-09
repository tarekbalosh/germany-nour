import {useTranslations} from 'next-intl';
export default function About() {
  const t = useTranslations('about');
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">{t('title')}</h1>
      <p className="text-lg text-gray-700 leading-relaxed">{t('description')}</p>
    </div>
  );
}
