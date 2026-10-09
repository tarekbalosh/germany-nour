import {useTranslations} from 'next-intl';
export default function FAQ() {
  const t = useTranslations('faq');
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="font-semibold text-lg mb-2">{t('q1')}</h3>
          <p className="text-gray-600">{t('a1')}</p>
        </div>
      </div>
    </div>
  );
}
