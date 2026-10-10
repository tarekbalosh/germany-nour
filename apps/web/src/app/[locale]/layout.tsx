import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import {notFound} from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import '@/app/globals.css';

export default async function LocaleLayout({children, params}: {children: React.ReactNode, params: Promise<{locale: string}>}) {
  const {locale} = await params;
  if (!routing.locales.includes(locale as "en" | "de" | "ar")) notFound();
  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir}>
      <body className="bg-gray-50 text-gray-900 min-h-screen flex flex-col font-sans selection:bg-blue-200 selection:text-blue-900">
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="flex-grow w-full">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
