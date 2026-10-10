'use client';

import { useEffect, useState } from 'react';
import { BookOpen, Plus, Search, MoreVertical, Edit, Trash2 } from 'lucide-react';

export default function AdminCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ 
    titleEn: '', titleDe: '', titleAr: '', 
    level: 'A1', durationHours: '', price: '',
    descriptionEn: '', descriptionDe: '', descriptionAr: '',
    hasFreeTrial: false
  });

  const fetchCourses = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${apiUrl}/api/v1/admin/courses`);
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      }
    } catch (error) {
      console.error('Failed to fetch courses', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      
      const url = editingId ? `${apiUrl}/api/v1/admin/courses/${editingId}` : `${apiUrl}/api/v1/admin/courses`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowAddModal(false);
        setEditingId(null);
        setFormData({ titleEn: '', titleDe: '', titleAr: '', level: 'A1', durationHours: '', price: '', descriptionEn: '', descriptionDe: '', descriptionAr: '', hasFreeTrial: false });
        fetchCourses();
      }
    } catch (error) {
      console.error('Failed to save course', error);
    }
  };

  const handleEditClick = (course: any) => {
    setEditingId(course.id);
    setFormData({
      titleEn: course.titleEn || '',
      titleDe: course.titleDe || '',
      titleAr: course.titleAr || '',
      level: course.level || 'A1',
      durationHours: course.durationHours || '',
      price: course.price || '',
      descriptionEn: course.descriptionEn || '',
      descriptionDe: course.descriptionDe || '',
      descriptionAr: course.descriptionAr || '',
      hasFreeTrial: course.hasFreeTrial || false
    });
    setShowAddModal(true);
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${apiUrl}/api/v1/admin/courses/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchCourses();
      }
    } catch (error) {
      console.error('Failed to delete course', error);
    }
  };

  const handleTogglePublish = async (course: any) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      
      // We send all existing data to pass validation, just toggling isPublished
      const payload = {
        titleEn: course.titleEn,
        titleDe: course.titleDe,
        titleAr: course.titleAr,
        level: course.level,
        descriptionEn: course.descriptionEn,
        descriptionDe: course.descriptionDe,
        descriptionAr: course.descriptionAr,
        durationHours: course.durationHours,
        price: course.price,
        isPublished: !course.isPublished
      };

      const res = await fetch(`${apiUrl}/api/v1/admin/courses/${course.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        fetchCourses();
      }
    } catch (error) {
      console.error('Failed to toggle course status', error);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-indigo-600" />
            Courses Management
          </h1>
          <p className="mt-2 text-gray-500 font-medium">Create and manage academy courses and materials.</p>
        </div>
        <button 
          onClick={() => {
            setEditingId(null);
            setFormData({ titleEn: '', titleDe: '', titleAr: '', level: 'A1', durationHours: '', price: '', descriptionEn: '', descriptionDe: '', descriptionAr: '', hasFreeTrial: false });
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-sm"
        >
          <Plus className="h-5 w-5" />
          Add New Course
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search courses..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-gray-50/30">
            {courses.map((course) => (
              <div key={course.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow group flex flex-col h-full">
                <div className="h-32 bg-gradient-to-br from-indigo-500 to-purple-600 p-6 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="flex justify-between items-start z-10">
                    <span className="bg-white/20 text-white backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/20">
                      {course.level}
                    </span>
                    <button className="text-white/80 hover:text-white transition-colors bg-black/10 hover:bg-black/20 p-1.5 rounded-lg backdrop-blur-sm">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                  <h3 className="text-xl font-bold text-white z-10 truncate">{course.titleEn}</h3>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">{course.descriptionEn || 'No description provided.'}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                        {course.durationHours} hours
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                        €{course.price || '0'}
                      </span>
                      {course.hasFreeTrial && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-purple-100 text-purple-800">
                          Free Trial
                        </span>
                      )}
                      <div className="flex items-center gap-2 mt-2 w-full">
                        <button
                          onClick={() => handleTogglePublish(course)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${course.isPublished ? 'bg-green-500' : 'bg-gray-200'}`}
                        >
                          <span className="sr-only">Toggle availability</span>
                          <span
                            aria-hidden="true"
                            className={`pointer-events-none absolute left-0 inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${course.isPublished ? 'translate-x-4' : 'translate-x-1'}`}
                          />
                        </button>
                        <span className={`text-xs font-bold ${course.isPublished ? 'text-green-600' : 'text-gray-400'}`}>
                          {course.isPublished ? 'Available Now (متاح الان)' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <button onClick={() => handleEditClick(course)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                      <Edit className="h-4 w-4" /> Edit
                    </button>
                    <button onClick={() => handleDeleteCourse(course.id)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-red-100 bg-red-50 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors">
                      <Trash2 className="h-4 w-4" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {courses.length === 0 && (
              <div className="col-span-full p-12 text-center text-gray-500 bg-white border border-dashed border-gray-300 rounded-2xl">
                No courses found. Click "Add New Course" to get started.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Course Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 sticky top-0 z-10">
              <h3 className="text-lg font-bold text-gray-900">{editingId ? 'Edit Course' : 'Add New Course'}</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleAddCourse} className="p-6">
              <div className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Title (EN)</label>
                    <input required type="text" value={formData.titleEn} onChange={(e) => setFormData({...formData, titleEn: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Title (DE)</label>
                    <input required type="text" value={formData.titleDe} onChange={(e) => setFormData({...formData, titleDe: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Title (AR)</label>
                    <input required type="text" value={formData.titleAr} onChange={(e) => setFormData({...formData, titleAr: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" dir="rtl" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Level</label>
                    <select value={formData.level} onChange={(e) => setFormData({...formData, level: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white">
                      {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Duration (Hours)</label>
                    <input required type="number" min="0" value={formData.durationHours} onChange={(e) => setFormData({...formData, durationHours: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Price (€)</label>
                    <input required type="number" min="0" step="0.01" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Description (EN)</label>
                    <textarea rows={3} value={formData.descriptionEn} onChange={(e) => setFormData({...formData, descriptionEn: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Description (DE)</label>
                    <textarea rows={3} value={formData.descriptionDe} onChange={(e) => setFormData({...formData, descriptionDe: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Description (AR)</label>
                    <textarea rows={3} value={formData.descriptionAr} onChange={(e) => setFormData({...formData, descriptionAr: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none" dir="rtl"></textarea>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-2 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <input 
                    type="checkbox" 
                    id="freeTrial"
                    checked={formData.hasFreeTrial}
                    onChange={(e) => setFormData({...formData, hasFreeTrial: e.target.checked})}
                    className="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 cursor-pointer"
                  />
                  <label htmlFor="freeTrial" className="text-sm font-semibold text-gray-700 cursor-pointer">
                    Offer Free Trial Session for this Course
                  </label>
                </div>
                
              </div>
              <div className="pt-6 flex gap-3 justify-end border-t border-gray-100 mt-6">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-6 py-2.5 rounded-xl font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-md">
                  {editingId ? 'Save Changes' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
