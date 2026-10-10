"use client";

import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { useState, useRef, useEffect } from 'react';

export default function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [student, setStudent] = useState<any>(null);
  const pathname = usePathname();

  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    // Check auth
    const authData = localStorage.getItem('student_auth');
    if (authData) {
      try {
        setStudent(JSON.parse(authData));
      } catch (e) {}
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('student_auth');
    setStudent(null);
    window.location.href = '/';
  };

  const links = [
    { href: '/', label: t('home') },
    { href: '/courses', label: t('courses') },
    { href: '/about', label: t('about') },
    { href: '/contact', label: t('contact') },
  ];

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'de', label: 'Deutsch' },
    { code: 'ar', label: 'العربية' }
  ];

  if (pathname.includes('/admin')) return null;

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 text-white flex items-center justify-center rounded-xl font-bold text-xl shadow-md group-hover:shadow-lg transition-all duration-300 transform group-hover:-translate-y-0.5">
              GA
            </div>
            <span className="font-bold text-2xl text-gray-900 tracking-tight">{t('logo')}</span>
          </Link>
          
          <nav className="hidden lg:flex space-x-8 rtl:space-x-reverse items-center">
            {links.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className={`font-medium transition-colors ${pathname === link.href ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="w-px h-6 bg-gray-200 mx-2"></div>
            
            {/* Language Dropdown */}
            <div className="relative" ref={langRef}>
              <button 
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-bold text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all uppercase tracking-wider focus:outline-none"
              >
                <span>{locale}</span>
                <svg className={`w-4 h-4 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              {isLangOpen && (
                <div className="absolute top-full right-0 mt-2 w-36 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100 py-2 z-50 animate-fade-in-down overflow-hidden">
                  {languages.map((lang) => (
                    <Link
                      key={lang.code}
                      href={pathname}
                      locale={lang.code}
                      className={`flex items-center justify-between px-4 py-2.5 text-sm font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors ${locale === lang.code ? 'text-blue-600 bg-blue-50/50' : 'text-gray-700'}`}
                      onClick={() => setIsLangOpen(false)}
                    >
                      <span>{lang.label}</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase">{lang.code}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            
            {student ? (
              <div className="flex items-center gap-3">
                <Link href="/portal" className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                  My Account
                </Link>
                <button onClick={handleLogout} className="bg-red-50 text-red-600 px-4 py-2.5 rounded-xl font-semibold hover:bg-red-100 transition-all">
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                {t('login')}
              </Link>
            )}
          </nav>
          
          {/* Mobile menu button */}
          <button 
            className="lg:hidden p-2 text-gray-600 hover:text-blue-600 focus:outline-none transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl absolute w-full inset-x-0 overflow-hidden rounded-b-2xl animate-fade-in-down">
          <div className="px-4 pt-3 pb-6 space-y-1">
            {links.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${pathname === link.href ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'}`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-gray-100 my-4"></div>
            <div className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Language</div>
            <div className="grid grid-cols-3 gap-2 px-4 mb-4">
              {languages.map((lang) => (
                <Link 
                  key={lang.code}
                  href={pathname} 
                  locale={lang.code} 
                  className={`text-center py-2 rounded-lg text-sm font-bold transition-colors ${locale === lang.code ? 'bg-blue-100 text-blue-700' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                >
                  {lang.code.toUpperCase()}
                </Link>
              ))}
            </div>
            {student ? (
              <>
                <Link 
                  href="/portal" 
                  className="block w-full text-center mt-4 bg-indigo-600 text-white px-5 py-3.5 rounded-xl font-semibold hover:bg-indigo-700 transition shadow-md active:scale-95"
                  onClick={() => setIsOpen(false)}
                >
                  My Account
                </Link>
                <button 
                  onClick={() => { setIsOpen(false); handleLogout(); }} 
                  className="block w-full text-center mt-2 bg-red-50 text-red-600 px-5 py-3.5 rounded-xl font-semibold hover:bg-red-100 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                href="/login" 
                className="block w-full text-center mt-4 bg-blue-600 text-white px-5 py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition shadow-md active:scale-95"
                onClick={() => setIsOpen(false)}
              >
                {t('login')}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
