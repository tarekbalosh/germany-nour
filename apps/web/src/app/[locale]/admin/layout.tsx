'use client';

import { ReactNode, useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Settings, 
  LogOut,
  Bell,
  Search,
  Lock
} from 'lucide-react';
import { Link, usePathname } from '@/i18n/routing';

export default function AdminLayout({ children, params }: { children: ReactNode, params: { locale: string } }) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      fetchNotifications();
    }
  }, []);

  const fetchNotifications = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${apiUrl}/api/v1/admin/dashboard`);
      if (res.ok) {
        const data = await res.json();
        setRecentUsers(data.recentActivity?.users || []);
      }
    } catch (e) {
      console.error('Failed to fetch notifications', e);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '0000') {
      sessionStorage.setItem('admin_auth', 'true');
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setPassword('');
    }
  };

  const isActive = (path: string) => {
    if (path === '/admin' && pathname === '/admin') return true;
    if (path !== '/admin' && pathname.startsWith(path)) return true;
    return false;
  };

  const getLinkClasses = (path: string) => {
    const base = "flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors";
    return isActive(path) 
      ? `${base} bg-blue-50 text-blue-700 shadow-sm border border-blue-100` 
      : `${base} text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent`;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
        {/* Beautiful Animated Background */}
        <div className="absolute inset-0 z-0 bg-slate-950">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px]"></div>
          <div className="absolute left-1/4 top-1/4 -z-10 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/30 blur-[120px]"></div>
          <div className="absolute right-1/4 bottom-1/4 -z-10 h-[400px] w-[400px] translate-x-1/2 translate-y-1/2 rounded-full bg-indigo-600/30 blur-[120px]"></div>
          <div className="absolute left-1/2 top-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/20 blur-[150px] animate-pulse"></div>
        </div>

        <div className="relative z-10 bg-white/10 backdrop-blur-2xl max-w-md w-full rounded-[2rem] shadow-2xl border border-white/20 p-8 sm:p-10 transform transition-all animate-in zoom-in-95 fade-in">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(59,130,246,0.5)] border border-white/20 transform hover:scale-105 transition-transform duration-300">
              <Lock className="w-10 h-10" strokeWidth={1.5} />
            </div>
            <h1 className="text-3xl font-extrabold text-white mb-3 tracking-tight">Admin Access</h1>
            <p className="text-gray-300 font-medium">Please enter the master password to continue.</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <div className="relative group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••"
                  className={`w-full px-5 py-4 rounded-2xl border ${error ? 'border-red-400/50 bg-red-400/10 focus:border-red-400 text-red-200 placeholder-red-300/50' : 'border-white/20 bg-black/20 focus:border-blue-400 focus:bg-black/40 text-white placeholder-gray-500'} focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-300 text-center text-3xl tracking-[0.4em] font-mono shadow-inner`}
                  autoFocus
                />
              </div>
              {error && <p className="text-red-400 text-sm mt-3 text-center font-semibold animate-pulse">Incorrect password. Try again.</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-white text-gray-900 hover:bg-gray-100 font-bold py-4 rounded-2xl transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transform hover:-translate-y-1 mt-4"
            >
              Access Dashboard
            </button>
          </form>
          <div className="mt-8 text-center">
            <Link href="/" className="text-sm text-gray-400 hover:text-white font-medium transition-colors flex items-center justify-center gap-2 group">
              <span className="transform group-hover:-translate-x-1 transition-transform">&larr;</span> Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 hidden md:flex flex-col justify-between fixed h-full z-10 shadow-sm">
        <div>
          <div className="h-16 flex items-center px-6 border-b border-gray-100">
            <Link href="/" className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Admin Panel
            </Link>
          </div>
          <nav className="p-4 space-y-1">
            <Link href="/admin" className={getLinkClasses('/admin')}>
              <LayoutDashboard className="h-5 w-5" />
              Overview
            </Link>
            <Link href="/admin/users" className={getLinkClasses('/admin/users')}>
              <Users className="h-5 w-5" />
              Users
            </Link>
            <Link href="/admin/courses" className={getLinkClasses('/admin/courses')}>
              <BookOpen className="h-5 w-5" />
              Courses
            </Link>
            <Link href="/admin/settings" className={getLinkClasses('/admin/settings')}>
              <Settings className="h-5 w-5" />
              Settings
            </Link>
          </nav>
        </div>
        <div className="p-4 border-t border-gray-100">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors">
            <LogOut className="h-5 w-5" />
            Exit Admin
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen relative">
        {/* Top Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-10 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex-1 flex items-center gap-4">
            <div className="relative w-full max-w-md hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-4 relative">
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 text-gray-400 hover:text-gray-500 transition-colors focus:outline-none"
              >
                <Bell className="h-5 w-5" />
                {recentUsers.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white animate-pulse"></span>
                )}
              </button>
              
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-gray-50 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900">Notifications</h3>
                    <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{recentUsers.length} New</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {recentUsers.length > 0 ? (
                      recentUsers.map((user, idx) => (
                        <div key={idx} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 cursor-pointer transition-colors">
                          <p className="text-sm text-gray-800">
                            <span className="font-semibold text-blue-600">{user.name}</span> has just created an account.
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(user.createdAt).toLocaleDateString()} at {new Date(user.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-6 text-center text-gray-500 text-sm">
                        No new notifications.
                      </div>
                    )}
                  </div>
                  <div className="px-4 py-2 border-t border-gray-50 text-center">
                    <Link href="/admin/users" onClick={() => setNotificationsOpen(false)} className="text-xs font-bold text-blue-600 hover:text-blue-700">
                      View all users
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5">
              <div className="h-full w-full bg-white rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-blue-600">AD</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
