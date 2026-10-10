import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import FAQSection from '@/components/FAQSection';

type Course = {
  id: string;
  titleEn: string;
  titleDe: string;
  titleAr: string;
  level: string;
  descriptionEn: string;
  descriptionDe: string;
  descriptionAr: string;
  durationHours: number;
  price: number;
  isPublished: boolean;
  hasFreeTrial: boolean;
};

async function getCourses(): Promise<Course[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const res = await fetch(`${apiUrl}/api/v1/courses`, { 
      next: { revalidate: 60 }
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error('Failed to fetch courses', error);
    return [];
  }
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tHero = await getTranslations('hero');
  const tFeatures = await getTranslations('features');
  const tCourses = await getTranslations('courses');
  const tTestimonials = await getTranslations('testimonials');

  const allCourses = await getCourses();
  
  const desiredLevels = ['A1', 'A2.1', 'A2.2'];
  const publishedCourses = allCourses.filter(c => c.isPublished);
  
  let featuredCourses = publishedCourses
    .filter(c => desiredLevels.includes(c.level))
    .sort((a, b) => desiredLevels.indexOf(a.level) - desiredLevels.indexOf(b.level))
    .slice(0, 3);
    
  if (featuredCourses.length < 3) {
    const remaining = publishedCourses.filter(c => !featuredCourses.find(fc => fc.id === c.id));
    featuredCourses = [...featuredCourses, ...remaining].slice(0, 3);
  }

  const featuresItems = [
    { key: 0, icon: '🎓' },
    { key: 1, icon: '🗓️' },
    { key: 2, icon: '📜' },
    { key: 3, icon: '💻' }
  ];

  const getLocalizedField = (course: Course, field: 'title' | 'description', currentLocale: string) => {
    if (currentLocale === 'ar') return course[`${field}Ar` as keyof Course];
    if (currentLocale === 'de') return course[`${field}De` as keyof Course];
    return course[`${field}En` as keyof Course];
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-24 pb-32">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 opacity-20 blur-[100px]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-block bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 border border-blue-100 shadow-sm">
            {tHero('badge')}
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-8 tracking-tight leading-tight">
            {tHero('title')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            {tHero('subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/courses" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
              {tHero('cta_primary')}
            </Link>
            <Link href="/contact" className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-md hover:-translate-y-1">
              {tHero('cta_secondary')}
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{tFeatures('title')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{tFeatures('subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuresItems.map((item) => (
              <div key={item.key} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 group">
                <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{tFeatures(`items.${item.key}.title`)}</h3>
                <p className="text-gray-600 leading-relaxed">{tFeatures(`items.${item.key}.description`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses Overview */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{tCourses('title')}</h2>
              <p className="text-lg text-gray-600">{tCourses('subtitle')}</p>
            </div>
            <Link href="/courses" className="mt-6 md:mt-0 text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-2 group">
              {locale === 'ar' ? 'عرض جميع الكورسات' : (locale === 'de' ? 'Alle Kurse ansehen' : 'View All Courses')}
              <span className="transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">→</span>
            </Link>
          </div>
          
          {featuredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredCourses.map((course) => (
                <div key={course.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full group">
                  <div className="bg-blue-50 p-8 flex justify-center items-center border-b border-gray-100 group-hover:bg-blue-600 transition-colors">
                    <span className="text-4xl font-black text-blue-200 group-hover:text-blue-300 transition-colors">{course.level}</span>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-900">{getLocalizedField(course, 'title', locale) as string}</h3>
                    </div>
                    <p className="text-gray-600 mb-6 flex-grow">{getLocalizedField(course, 'description', locale) as string}</p>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <div>
                        <span className="text-sm text-gray-500 block">{tCourses('duration')}</span>
                        <span className="font-semibold text-gray-900">{course.durationHours} {tCourses('hours')}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-gray-500 block">{tCourses('price')}</span>
                        <span className="font-bold text-blue-600 text-lg">€{course.price}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 mt-4">
                      <Link 
                        href={`/contact?courseId=${course.id}&courseTitle=${encodeURIComponent(getLocalizedField(course, 'title', locale) as string)}`}
                        className="block w-full text-center bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
                      >
                        {locale === 'ar' ? 'التسجيل في الكورس' : (locale === 'de' ? 'Für Kurs anmelden' : 'Enroll in Course')}
                      </Link>
                      {course.hasFreeTrial && (
                        <Link 
                          href={`/contact?courseId=${course.id}&courseTitle=${encodeURIComponent(getLocalizedField(course, 'title', locale) as string)}&trial=true`}
                          className="block w-full text-center bg-purple-50 text-purple-700 font-bold py-3 rounded-xl border border-purple-100 hover:bg-purple-600 hover:text-white transition-all shadow-sm hover:shadow-md"
                        >
                          {locale === 'ar' ? 'احجز جلسة مجانية' : (locale === 'de' ? 'Kostenlose Probestunde buchen' : 'Book Free Session')}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-gray-500">
                {locale === 'ar' ? 'لا توجد كورسات متاحة في الوقت الحالي.' : (locale === 'de' ? 'Derzeit sind keine Kurse verfügbar.' : 'No courses available at the moment.')}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />

      {/* CTA Banner */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {locale === 'ar' ? 'هل أنت مستعد لبدء التعلم؟' : (locale === 'de' ? 'Bereit, mit dem Lernen zu beginnen?' : 'Ready to Start Learning?')}
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            {locale === 'ar' ? 'انضم إلى آلاف الطلاب الذين حققوا أهدافهم مع مدرسينا الخبراء.' : (locale === 'de' ? 'Schließen Sie sich Tausenden von Schülern an, die ihre Ziele mit unseren erfahrenen Lehrern erreicht haben.' : 'Join thousands of students who have achieved their goals with our expert tutors.')}
          </p>
          <Link href="/contact" className="inline-block bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all shadow-lg hover:-translate-y-1">
            {locale === 'ar' ? 'احجز جلستك التجريبية المجانية اليوم' : (locale === 'de' ? 'Buchen Sie noch heute Ihre kostenlose Probestunde' : 'Book Your Free Trial Today')}
          </Link>
        </div>
      </section>
    </div>
  );
}
