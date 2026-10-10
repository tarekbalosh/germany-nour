'use client';

import { Link } from '@/i18n/routing';
import { useEffect, useState } from 'react';
import { 
  Users, 
  BookOpen, 
  CalendarCheck, 
  Activity, 
  TrendingUp, 
  UserPlus, 
  Clock, 
  GraduationCap,
  Settings
} from 'lucide-react';

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const res = await fetch(`${apiUrl}/api/v1/admin/dashboard`);
        if (!res.ok) {
          throw new Error('Failed to fetch data');
        }
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 border-t-transparent shadow-lg shadow-blue-500/20"></div>
          <p className="text-gray-500 font-medium animate-pulse">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl shadow-sm border border-red-100 flex flex-col items-center max-w-md text-center">
          <Activity className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-lg font-bold mb-2">Error Loading Dashboard</h2>
          <p className="text-sm opacity-90">{error}</p>
        </div>
      </div>
    );
  }

  const { stats, recentActivity } = data;

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-blue-500', trend: '+12%' },
    { title: 'Total Courses', value: stats.totalCourses, icon: BookOpen, color: 'bg-indigo-500', trend: '+3%' },
    { title: 'Total Enrollments', value: stats.totalEnrollments, icon: GraduationCap, color: 'bg-purple-500', trend: '+24%' },
    { title: 'Total Bookings', value: stats.totalBookings, icon: CalendarCheck, color: 'bg-teal-500', trend: '+8%' },
  ];

  return (
    <div className="bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 w-full">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500 font-medium">Overview of your academy's activity and performance.</p>
          </div>
          <div className="hidden sm:flex p-3 bg-blue-50 rounded-xl">
            <Activity className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 group"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className={`p-4 rounded-xl ${stat.color} bg-opacity-10 text-white flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className={`h-7 w-7 text-${stat.color.split('-')[1]}-600`} aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-semibold text-gray-500 truncate">
                        {stat.title}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-3xl font-bold text-gray-900 mt-1">
                          {stat.value}
                        </div>
                        <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {stat.trend}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
                <div className="text-sm">
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500 flex items-center">
                    View details
                    <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg leading-6 font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link href="/admin/users" className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-500 hover:shadow-md transition-all group">
              <div className="bg-blue-100 p-3 rounded-full text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Users className="h-5 w-5" />
              </div>
              <span className="mt-2 text-sm font-semibold text-gray-700">View Users</span>
            </Link>
            <Link href="/admin/courses" className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-indigo-500 hover:shadow-md transition-all group">
              <div className="bg-indigo-100 p-3 rounded-full text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="mt-2 text-sm font-semibold text-gray-700">New Course</span>
            </Link>
            <Link href="/admin" className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-purple-500 hover:shadow-md transition-all group">
              <div className="bg-purple-100 p-3 rounded-full text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Activity className="h-5 w-5" />
              </div>
              <span className="mt-2 text-sm font-semibold text-gray-700">Generate Report</span>
            </Link>
            <Link href="/admin/settings" className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-teal-500 hover:shadow-md transition-all group">
              <div className="bg-teal-100 p-3 rounded-full text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <Settings className="h-5 w-5" />
              </div>
              <span className="mt-2 text-sm font-semibold text-gray-700">Settings</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Users */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg leading-6 font-bold text-gray-900 flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-blue-500" />
                Recent Users
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              {recentActivity.users.length === 0 ? (
                <div className="p-6 text-center text-gray-500">No recent users.</div>
              ) : (
                recentActivity.users.map((user: any) => (
                  <div key={user.id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${user.role === 'TUTOR' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                        {user.role}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Enrollments */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg leading-6 font-bold text-gray-900 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-indigo-500" />
                Recent Enrollments
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              {recentActivity.enrollments.length === 0 ? (
                <div className="p-6 text-center text-gray-500">No recent enrollments.</div>
              ) : (
                recentActivity.enrollments.map((enrollment: any) => (
                  <div key={enrollment.id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{enrollment.course.titleEn}</p>
                        <p className="text-xs text-gray-500">Student: <span className="font-medium text-gray-700">{enrollment.student.name}</span></p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                      {new Date(enrollment.enrolledAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden lg:col-span-2">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg leading-6 font-bold text-gray-900 flex items-center gap-2">
                <CalendarCheck className="h-5 w-5 text-teal-500" />
                Recent Bookings
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              {recentActivity.bookings.length === 0 ? (
                <div className="p-6 text-center text-gray-500">No recent bookings.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentActivity.bookings.map((booking: any) => (
                        <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-xs mr-3">
                                {booking.student.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="text-sm font-medium text-gray-900">{booking.student.name}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 font-medium">{booking.course?.titleEn || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 flex items-center gap-2">
                              <CalendarCheck className="h-4 w-4 text-gray-400" />
                              {new Date(booking.startsAt).toLocaleString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 
                                booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'}`}>
                              {booking.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Activity Overview Simulated Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-8">
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="text-lg leading-6 font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              Activity Overview
            </h3>
            <span className="text-xs font-semibold text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">Last 7 Days</span>
          </div>
          <div className="p-6">
            <div className="flex items-end justify-between h-48 gap-2">
              {[40, 70, 45, 90, 65, 85, 100].map((height, i) => (
                <div key={i} className="w-full flex flex-col items-center gap-2 group">
                  <div className="w-full bg-gray-100 rounded-t-lg relative h-full flex items-end">
                    <div 
                      className="w-full bg-gradient-to-t from-blue-600 to-indigo-400 rounded-t-lg transition-all duration-1000 ease-out group-hover:from-blue-500 group-hover:to-indigo-300"
                      style={{ height: `${height}%` }}
                    ></div>
                    {/* Tooltip on hover */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {height * 12} views
                    </div>
                  </div>
                  <span className="text-xs font-medium text-gray-400">Day {i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
