import {useTranslations} from 'next-intl';
export default function Contact() {
  const t = useTranslations('contact');
  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('form_name')}</label>
          <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('form_email')}</label>
          <input type="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700">{t('form_submit')}</button>
      </form>
    </div>
  );
}
