'use client';

import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useRouter } from '@/i18n/routing';

export default function Contact() {
  const t = useTranslations('contact_page');
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const courseId = searchParams.get('courseId');
  const courseTitle = searchParams.get('courseTitle');
  
  const [student, setStudent] = useState<any>(null);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollSuccess, setEnrollSuccess] = useState(false);
  const [contactPhone, setContactPhone] = useState('+49123456789');

  useEffect(() => {
    const auth = localStorage.getItem('student_auth');
    if (auth) {
      try {
        setStudent(JSON.parse(auth));
      } catch (e) {
        console.error(e);
      }
    }

    const fetchSettings = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const res = await fetch(`${apiUrl}/api/v1/admin/settings`);
        if (res.ok) {
          const data = await res.json();
          if (data.contactPhone) setContactPhone(data.contactPhone);
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const handleDirectEnroll = async () => {
    if (!student || !courseId) return;
    setEnrolling(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${apiUrl}/api/v1/courses/${courseId}/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: student.id })
      });
      if (res.ok) {
        setEnrollSuccess(true);
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } else {
        const err = await res.json();
        alert(err.error?.message || 'Failed to enroll');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred');
    } finally {
      setEnrolling(false);
    }
  };

  const whatsappPhone = contactPhone.replace(/[^0-9]/g, '');
  const whatsappLink = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(`Hello Admin,\n\nA new student wants to enroll in a course.\n\nStudent Details:\nName: ${student?.name || ''}\nEmail: ${student?.email || 'N/A'}\nPhone: ${student?.phoneNumber || 'N/A'}\n\nCourse Details:\nTitle: ${courseTitle || ''}\n\nPlease confirm the booking with the student.`)}`;

  if (courseId && student) {
    return (
      <div className="bg-gray-50 min-h-screen py-20 flex items-center justify-center p-4">
        <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12 text-center animate-in zoom-in-95 fade-in">
          {enrollSuccess ? (
            <div>
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">Booking Successful!</h2>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                You have successfully booked <br/><strong className="text-blue-600 text-xl">{courseTitle}</strong>.<br/>We will contact you shortly to arrange the schedule.
              </p>
            </div>
          ) : (
            <div>
              <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-3xl rotate-3 flex items-center justify-center mx-auto mb-8 shadow-sm">
                <svg className="w-12 h-12 -rotate-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477-4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">Direct Enrollment</h2>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                Hello <strong className="text-gray-900">{student.name}</strong>!<br/>
                Since you are already logged in, you can directly book this course:
                <span className="text-blue-600 font-bold text-2xl mt-4 block p-4 bg-blue-50/50 rounded-2xl border border-blue-100">{courseTitle}</span>
              </p>
              <a 
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  handleDirectEnroll();
                }}
                className={`block w-full text-center bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 ${enrolling ? 'opacity-50 pointer-events-none' : ''}`}
              >
                {enrolling ? 'Booking in progress...' : 'Confirm Booking'}
              </a>
              <button 
                onClick={() => router.push('/courses')}
                className="w-full mt-4 text-gray-500 hover:text-gray-700 font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">{t('title')}</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col lg:flex-row">
          {/* Contact Information (Left Side) */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-12 lg:w-2/5 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 end-0 -me-8 -mt-8 w-40 h-40 rounded-full bg-white opacity-10"></div>
            <div className="absolute bottom-0 start-0 -ms-10 -mb-10 w-60 h-60 rounded-full bg-white opacity-10"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-8">Contact Information</h2>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-500/30 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-blue-200 text-sm uppercase tracking-wider font-semibold mb-1">{t('office')}</h3>
                    <p className="text-lg">{t('address')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-500/30 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-blue-200 text-sm uppercase tracking-wider font-semibold mb-1">{t('email')}</h3>
                    <a href={`mailto:${t('email_address')}`} className="text-lg hover:underline">{t('email_address')}</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-500/30 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-blue-200 text-sm uppercase tracking-wider font-semibold mb-1">{t('phone')}</h3>
                    <a href={`tel:${t('phone_number')}`} className="text-lg hover:underline">{t('phone_number')}</a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-16 flex gap-4 relative z-10">
              <a href="#" className="bg-blue-500/30 p-3 rounded-full hover:bg-blue-500/50 transition-colors">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
              </a>
              <a href="#" className="bg-blue-500/30 p-3 rounded-full hover:bg-blue-500/50 transition-colors">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
              </a>
            </div>
          </div>

          {/* Contact Form (Right Side) */}
          <div className="p-12 lg:w-3/5 bg-white">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">{t('form.name')}</label>
                  <input 
                    type="text" 
                    defaultValue={student?.name || ''}
                    placeholder={t('form.name_placeholder')} 
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent p-4 transition-all" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">{t('form.email')}</label>
                  <input 
                    type="email" 
                    placeholder={t('form.email_placeholder')} 
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent p-4 transition-all" 
                    required 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{t('form.subject')}</label>
                <input 
                  type="text" 
                  defaultValue={courseTitle ? `Inquiry about ${courseTitle}` : ''}
                  placeholder={t('form.subject_placeholder')} 
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent p-4 transition-all" 
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{t('form.message')}</label>
                <textarea 
                  rows={5} 
                  placeholder={t('form.message_placeholder')} 
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent p-4 transition-all resize-none" 
                  required 
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="w-full bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                {t('form.submit')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
