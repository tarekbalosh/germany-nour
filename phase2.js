const fs = require('fs');
const path = require('path');

const write = (p, content) => {
  const fullPath = path.resolve(__dirname, p);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n');
};

// 1. Dictionaries
const dictionaries = {
  en: {
    home: { title: "Welcome to German Online Academy", subtitle: "Learn German effectively with expert tutors", courses: "View Courses", booking: "Book a Trial Lesson" },
    nav: { home: "Home", courses: "Courses", about: "About Us", faq: "FAQ", contact: "Contact", login: "Login" },
    courses: { title: "Our Courses", description: "Explore our German courses for all levels." },
    about: { title: "Teaching Approach", description: "We focus on interactive, practical learning." },
    faq: { title: "Frequently Asked Questions", q1: "How does it work?", a1: "Book a lesson, join online." },
    contact: { title: "Contact Us", form_name: "Name", form_email: "Email", form_submit: "Send Message" },
    common: { loading: "Loading...", error: "An error occurred", not_found: "Page not found" }
  },
  de: {
    home: { title: "Willkommen bei der German Online Academy", subtitle: "Lernen Sie effektiv Deutsch mit Experten", courses: "Kurse ansehen", booking: "Probestunde buchen" },
    nav: { home: "Startseite", courses: "Kurse", about: "Über uns", faq: "FAQ", contact: "Kontakt", login: "Anmelden" },
    courses: { title: "Unsere Kurse", description: "Entdecken Sie unsere Deutschkurse für alle Niveaus." },
    about: { title: "Lehransatz", description: "Wir konzentrieren uns auf interaktives, praktisches Lernen." },
    faq: { title: "Häufig gestellte Fragen", q1: "Wie funktioniert das?", a1: "Buchen Sie eine Lektion, nehmen Sie online teil." },
    contact: { title: "Kontakt", form_name: "Name", form_email: "E-Mail", form_submit: "Nachricht senden" },
    common: { loading: "Lädt...", error: "Ein Fehler ist aufgetreten", not_found: "Seite nicht gefunden" }
  },
  ar: {
    home: { title: "مرحبًا بك في الأكاديمية الألمانية على الإنترنت", subtitle: "تعلم الألمانية بفعالية مع معلمين خبراء", courses: "عرض الدورات", booking: "حجز درس تجريبي" },
    nav: { home: "الرئيسية", courses: "الدورات", about: "معلومات عنا", faq: "الأسئلة الشائعة", contact: "اتصل بنا", login: "تسجيل الدخول" },
    courses: { title: "دوراتنا", description: "استكشف دورات اللغة الألمانية لجميع المستويات." },
    about: { title: "نهج التدريس", description: "نركز على التعلم التفاعلي والعملي." },
    faq: { title: "الأسئلة الشائعة", q1: "كيف يعمل؟", a1: "احجز درساً، وانضم عبر الإنترنت." },
    contact: { title: "اتصل بنا", form_name: "الاسم", form_email: "البريد الإلكتروني", form_submit: "إرسال رسالة" },
    common: { loading: "جاري التحميل...", error: "حدث خطأ", not_found: "الصفحة غير موجودة" }
  }
};

write('apps/web/src/dictionaries/en.json', JSON.stringify(dictionaries.en, null, 2));
write('apps/web/src/dictionaries/de.json', JSON.stringify(dictionaries.de, null, 2));
write('apps/web/src/dictionaries/ar.json', JSON.stringify(dictionaries.ar, null, 2));

// 2. middleware.ts
write('apps/web/src/middleware.ts', `
import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
export default createMiddleware(routing);
export const config = { matcher: ['/', '/(de|en|ar)/:path*'] };
`);

// 3. i18n/routing.ts
write('apps/web/src/i18n/routing.ts', `
import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';
export const routing = defineRouting({ locales: ['en', 'de', 'ar'], defaultLocale: 'en' });
export const {Link, redirect, usePathname, useRouter} = createNavigation(routing);
`);

// 4. i18n/request.ts
write('apps/web/src/i18n/request.ts', `
import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';
export default getRequestConfig(async ({requestLocale}) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as any)) locale = routing.defaultLocale;
  return { locale, messages: (await import(\`../dictionaries/\${locale}.json\`)).default };
});
`);

// 5. next.config.ts update
write('apps/web/next.config.ts', `
import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
const nextConfig: NextConfig = {};
export default withNextIntl(nextConfig);
`);

// 6. Layout
write('apps/web/src/app/[locale]/layout.tsx', `
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import {notFound} from 'next/navigation';
import {Link} from '@/i18n/routing';
import '@/app/globals.css';

export default async function LocaleLayout({children, params}: {children: React.ReactNode, params: Promise<{locale: string}>}) {
  const {locale} = await params;
  if (!routing.locales.includes(locale as any)) notFound();
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
`);

// 7. Globals css
write('apps/web/src/app/globals.css', `
@tailwind base;
@tailwind components;
@tailwind utilities;
`);

// 8. Pages
write('apps/web/src/app/[locale]/page.tsx', `
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
`);

write('apps/web/src/app/[locale]/courses/page.tsx', `
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';
export default function Courses() {
  const t = useTranslations('courses');
  const levels = ['A1', 'A2', 'B1', 'B2', 'C1'];
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-4">{t('title')}</h1>
      <p className="text-gray-600 mb-8">{t('description')}</p>
      <div className="grid md:grid-cols-3 gap-6">
        {levels.map(lvl => (
          <div key={lvl} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-blue-600 mb-2">{lvl} Course</h2>
            <p className="text-gray-600 mb-4">Sample description for {lvl} level.</p>
            <Link href={\`/courses/\${lvl.toLowerCase()}\`} className="text-blue-600 font-medium hover:underline">View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
`);

write('apps/web/src/app/[locale]/courses/[id]/page.tsx', `
import {useTranslations} from 'next-intl';
export default async function CourseDetail({params}: {params: Promise<{id: string}>}) {
  const t = useTranslations('courses');
  const {id} = await params;
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4 uppercase">{id} Course</h1>
      <p className="text-lg text-gray-700">Detailed information about the {id} course will appear here.</p>
    </div>
  );
}
`);

write('apps/web/src/app/[locale]/about/page.tsx', `
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
`);

write('apps/web/src/app/[locale]/faq/page.tsx', `
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
`);

write('apps/web/src/app/[locale]/contact/page.tsx', `
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
`);

// Clean up root layout & page
try { fs.unlinkSync('apps/web/src/app/page.tsx'); } catch(e){}
try { fs.unlinkSync('apps/web/src/app/layout.tsx'); } catch(e){}

console.log("Phase 2 scaffolding complete");
