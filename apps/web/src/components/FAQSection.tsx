import { useTranslations } from 'next-intl';

export default function FAQSection() {
  const t = useTranslations('faq_page');
  const items = [0, 1, 2, 3, 4]; // Dummy keys

  return (
    <section className="bg-gray-50 py-24 border-t border-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">{t('title')}</h2>
          <p className="text-xl text-gray-600">{t('subtitle')}</p>
        </div>

        <div className="space-y-4">
          {items.map((key) => (
            <details 
              key={key} 
              className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 p-6 text-gray-900 focus:outline-none hover:bg-gray-50 transition-colors">
                <h3 className="text-lg font-semibold">{t(`items.${key}.q`)}</h3>
                <div className="relative h-5 w-5 shrink-0 text-blue-600">
                  <svg
                    className="absolute inset-0 h-5 w-5 opacity-100 group-open:opacity-0 transition-opacity"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  <svg
                    className="absolute inset-0 h-5 w-5 opacity-0 group-open:opacity-100 transition-opacity"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                  </svg>
                </div>
              </summary>
              <div className="p-6 pt-0 text-gray-600 leading-relaxed border-t border-gray-50 bg-white">
                <p>{t(`items.${key}.a`)}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
