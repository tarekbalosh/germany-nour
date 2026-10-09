import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import {notFound} from 'next/navigation';
import {Link} from '@/i18n/routing';
import '@/app/globals.css';

export default async function LocaleLayout({children, params}: {children: React.ReactNode, params: Promise<{locale: string}>}) {
  const {locale} = await params;
  if (!routing.locales.includes(locale as "en" | "de" | "ar")) notFound();
  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir}>
      <body className="bg-gray-50 text-gray-900 min-h-screen flex flex-col font-sans">
        <NextIntlClientProvider messages={messages}>
          <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16 items-center">
                <Link href="/" className="font-bold text-xl text-blue-600">German Academy</Link>
                <nav className="flex space-x-4 rtl:space-x-reverse gap-4">
                  <Link href="/courses" className="text-gray-600 hover:text-gray-900">Courses</Link>
                  <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
                  <Link href="/faq" className="text-gray-600 hover:text-gray-900">FAQ</Link>
                  <Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
                  <div className="border-l rtl:border-r border-gray-300 h-6 mx-2"></div>
                  <Link href="/" locale="en" className="text-sm font-medium">EN</Link>
                  <Link href="/" locale="de" className="text-sm font-medium">DE</Link>
                  <Link href="/" locale="ar" className="text-sm font-medium">AR</Link>
                </nav>
              </div>
            </div>
          </header>
          <main className="flex-grow">{children}</main>
          <footer className="bg-gray-800 text-white py-8 text-center text-sm">
            &copy; {new Date().getFullYear()} German Online Academy. All rights reserved.
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
