'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useRouter } from '@/i18n/routing';

export default function Login() {
  const countryCodes = [
    { code: '+49', label: '🇩🇪 +49' },
    { code: '+20', label: '🇪🇬 +20' },
    { code: '+966', label: '🇸🇦 +966' },
    { code: '+971', label: '🇦🇪 +971' },
    { code: '+965', label: '🇰🇼 +965' },
    { code: '+974', label: '🇶🇦 +974' },
    { code: '+973', label: '🇧🇭 +973' },
    { code: '+968', label: '🇴🇲 +968' },
    { code: '+962', label: '🇯🇴 +962' },
    { code: '+961', label: '🇱🇧 +961' },
    { code: '+212', label: '🇲🇦 +212' },
    { code: '+213', label: '🇩🇿 +213' },
    { code: '+216', label: '🇹🇳 +216' },
    { code: '+970', label: '🇵🇸 +970' },
    { code: '+964', label: '🇮🇶 +964' },
    { code: '+963', label: '🇸🇾 +963' },
    { code: '+1', label: '🇺🇸 +1' },
    { code: '+44', label: '🇬🇧 +44' }
  ];
  const t = useTranslations('login_page');
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState(true);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const countryCode = formData.get('countryCode') as string;
    const rawPhone = formData.get('phone') as string;
    const phone = `${countryCode}${rawPhone.replace(/^0+/, '')}`;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${apiUrl}/api/v1/auth/login-phone`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          localStorage.setItem('student_auth', JSON.stringify(data.user));
        }
        router.push('/');
      } else {
        const data = await res.json();
        setErrorMsg(data.error || 'Failed to login. Please try again.');
      }
    } catch (error) {
      console.error('Login error', error);
      setErrorMsg('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse" style={{ animationDelay: '4s' }}></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center transform transition-transform hover:scale-105 duration-300">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-800 text-white flex items-center justify-center rounded-2xl font-bold text-3xl shadow-xl shadow-blue-500/30 border border-white/20 backdrop-blur-sm">
            GA
          </div>
        </div>
        <h2 className="mt-8 text-center text-4xl font-extrabold text-gray-900 tracking-tight">
          {isLogin ? t('title') : 'Create Account'}
        </h2>
        <p className="mt-3 text-center text-base text-gray-600 px-4">
          {isLogin ? t('subtitle') : 'Join us and start learning German today.'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/70 backdrop-blur-xl py-10 px-6 shadow-2xl shadow-blue-900/10 sm:rounded-3xl sm:px-12 border border-white/50">
          <div className="flex p-1 mb-8 bg-gray-100/80 rounded-xl">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                isLogin ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                !isLogin ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Create Account
            </button>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-50/80 backdrop-blur border border-red-200 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
              <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              <p className="text-sm text-red-700 font-medium">{errorMsg}</p>
            </div>
          )}
          <form className="space-y-7" onSubmit={handleLogin}>
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1.5">
                {t('name')}
              </label>
              <div className="mt-1 relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  placeholder={t('name_placeholder')}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm sm:text-sm transition-all duration-200 hover:bg-white"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1.5">
                {t('phone')}
              </label>
              <div className="mt-1 flex group shadow-sm rounded-xl overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200">
                <select
                  name="countryCode"
                  className="appearance-none bg-gray-50/50 backdrop-blur-sm pl-3 pr-8 py-3 text-gray-700 sm:text-sm border-r border-gray-200 focus:outline-none cursor-pointer hover:bg-gray-100/50 transition-colors bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px_10px] bg-no-repeat bg-[position:right_10px_center]"
                  defaultValue="+49"
                >
                  {countryCodes.map(c => (
                    <option key={c.code} value={c.code}>{c.label}</option>
                  ))}
                </select>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  placeholder={t('phone_placeholder')}
                  className="flex-1 appearance-none block w-full px-3 py-3 focus:outline-none bg-white/50 backdrop-blur-sm sm:text-sm hover:bg-white"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg shadow-blue-500/30 transform transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('processing')}
                  </div>
                ) : (
                  <span className="flex items-center gap-2">
                    {isLogin ? t('submit') : 'Create Account'}
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

