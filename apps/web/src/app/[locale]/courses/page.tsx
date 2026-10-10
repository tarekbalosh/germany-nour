import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';

export default async function CoursesPage({ params }: { params: { locale: string } }) {
  const t = await getTranslations('courses');
  
  let courses: any[] = [];
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const res = await fetch(`${apiUrl}/api/v1/courses`, { cache: 'no-store' });
    if (res.ok) {
      courses = await res.json();
    }
  } catch (error) {
    console.error('Failed to fetch courses:', error);
  }

  const getLocalizedField = (course: any, field: 'title' | 'description', locale: string) => {
    if (locale === 'de') return course[`${field}De`] || course[`${field}En`];
    if (locale === 'ar') return course[`${field}Ar`] || course[`${field}En`];
    return course[`${field}En`];
  };

  const getNotAvailableText = (locale: string) => {
    if (locale === 'ar') return 'غير متاح حالياً';
    if (locale === 'de') return 'Derzeit nicht verfügbar';
    return 'Not available currently';
  };

  return (
    <div className="bg-gray-50 min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">{t('title')}</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full group">
              {/* Card Header / Badge */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 flex justify-center items-center border-b border-blue-100 group-hover:from-blue-600 group-hover:to-blue-800 transition-colors duration-500">
                <span className="text-5xl font-black text-blue-200 group-hover:text-blue-100 transition-colors duration-500 drop-shadow-sm">
                  {course.level}
                </span>
              </div>
              
              {/* Card Body */}
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{getLocalizedField(course, 'title', params.locale)}</h3>
                <p className="text-gray-600 mb-8 flex-grow leading-relaxed line-clamp-3">{getLocalizedField(course, 'description', params.locale) || t('default_desc')}</p>
                
                {/* Details Footer */}
                <div className="flex justify-between items-center py-4 border-t border-gray-100 mb-6">
                  <div>
                    <span className="text-sm text-gray-500 block uppercase tracking-wider font-semibold mb-1">{t('duration')}</span>
                    <span className="font-bold text-gray-900">{course.durationHours} {t('hours') || 'hours'}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-500 block uppercase tracking-wider font-semibold mb-1">{t('price')}</span>
                    <span className="font-bold text-blue-600 text-xl">€{course.price || '0'}</span>
                  </div>
                </div>

                {course.isPublished ? (
                  <div className="flex flex-col gap-3 mt-2">
                    <Link 
                      href={`/contact?courseId=${course.id}&courseTitle=${encodeURIComponent(getLocalizedField(course, 'title', params.locale))}`}
                      className="block w-full text-center bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
                    >
                      {t('enroll')}
                    </Link>
                    {course.hasFreeTrial && (
                      <Link 
                        href={`/contact?courseId=${course.id}&courseTitle=${encodeURIComponent(getLocalizedField(course, 'title', params.locale))}&trial=true`}
                        className="block w-full text-center bg-purple-50 text-purple-700 font-bold py-3.5 rounded-xl border border-purple-100 hover:bg-purple-600 hover:text-white transition-all shadow-sm hover:shadow-md"
                      >
                        {params.locale === 'ar' ? 'احجز جلسة مجانية' : (params.locale === 'de' ? 'Kostenlose Probestunde buchen' : 'Book Free Session')}
                      </Link>
                    )}
                  </div>
                ) : (
                  <button 
                    disabled
                    className="block w-full text-center bg-gray-100 text-gray-500 font-bold py-3.5 rounded-xl cursor-not-allowed opacity-80"
                  >
                    {getNotAvailableText(params.locale)}
                  </button>
                )}
              </div>
            </div>
          ))}
          
          {courses.length === 0 && (
            <div className="col-span-full py-20 text-center text-gray-500">
              <p className="text-xl">{t('no_courses') || 'No courses available right now.'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
