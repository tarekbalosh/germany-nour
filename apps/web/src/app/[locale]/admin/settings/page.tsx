'use client';

import { useState, useEffect } from 'react';
import { Settings, Globe, Mail, Shield, Bell, Save, CheckCircle } from 'lucide-react';

export default function AdminSettings() {
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    academyName: 'German Academy',
    contactEmail: 'admin@germanacademy.com',
    contactPhone: '+49123456789',
    defaultLanguage: 'English',
    timezone: 'Europe/Berlin (CET)',
    enableRegistrations: true,
    maintenanceMode: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const res = await fetch(`${apiUrl}/api/v1/admin/settings`);
        if (res.ok) {
          const data = await res.json();
          setFormData({
            academyName: data.academyName || 'German Academy',
            contactEmail: data.contactEmail || 'admin@germanacademy.com',
            contactPhone: data.contactPhone || '+49123456789',
            defaultLanguage: data.defaultLanguage || 'English',
            timezone: data.timezone || 'Europe/Berlin (CET)',
            enableRegistrations: data.enableRegistrations ?? true,
            maintenanceMode: data.maintenanceMode ?? false
          });
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${apiUrl}/api/v1/admin/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500 font-medium animate-pulse">Loading settings...</div>;
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
          <Settings className="h-8 w-8 text-teal-600" />
          Platform Settings
        </h1>
        <p className="mt-2 text-gray-500 font-medium">Manage your academy's global preferences and configurations.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Settings Navigation */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <nav className="space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-teal-50 text-teal-700 rounded-xl font-bold transition-colors">
              <Globe className="h-5 w-5" /> General
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium transition-colors">
              <Mail className="h-5 w-5" /> Notifications
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium transition-colors">
              <Shield className="h-5 w-5" /> Security
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-medium transition-colors">
              <Bell className="h-5 w-5" /> Announcements
            </button>
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg leading-6 font-bold text-gray-900">General Settings</h3>
            </div>
            
            <div className="p-6 space-y-8">
              {/* Academy Info */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Academy Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Academy Name</label>
                    <input type="text" value={formData.academyName} onChange={(e) => setFormData({...formData, academyName: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Email</label>
                    <input type="email" value={formData.contactEmail} onChange={(e) => setFormData({...formData, contactEmail: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Phone</label>
                    <input type="text" value={formData.contactPhone} onChange={(e) => setFormData({...formData, contactPhone: e.target.value})} placeholder="+49 123 456" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all" />
                  </div>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Localization */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Localization</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Default Language</label>
                    <select value={formData.defaultLanguage} onChange={(e) => setFormData({...formData, defaultLanguage: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-white">
                      <option value="English">English</option>
                      <option value="German">German</option>
                      <option value="Arabic">Arabic</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Timezone</label>
                    <select value={formData.timezone} onChange={(e) => setFormData({...formData, timezone: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-white">
                      <option value="Europe/Berlin (CET)">Europe/Berlin (CET)</option>
                      <option value="Asia/Dubai (GST)">Asia/Dubai (GST)</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Advanced */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Features</h4>
                <div className="space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <div className="relative flex items-center">
                      <input type="checkbox" checked={formData.enableRegistrations} onChange={(e) => setFormData({...formData, enableRegistrations: e.target.checked})} className="peer sr-only" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Enable New Registrations</p>
                      <p className="text-xs text-gray-500">Allow new students to create accounts.</p>
                    </div>
                  </label>
                  
                  <label className="flex items-start gap-3 cursor-pointer">
                    <div className="relative flex items-center">
                      <input type="checkbox" checked={formData.maintenanceMode} onChange={(e) => setFormData({...formData, maintenanceMode: e.target.checked})} className="peer sr-only" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Maintenance Mode</p>
                      <p className="text-xs text-gray-500">Disable access for non-admin users.</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <div>
                {saved && (
                  <span className="flex items-center gap-2 text-sm font-bold text-green-600 animate-in fade-in slide-in-from-left-4">
                    <CheckCircle className="h-5 w-5" /> Settings saved successfully
                  </span>
                )}
              </div>
              <button 
                type="submit" 
                className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-colors shadow-sm"
              >
                <Save className="h-5 w-5" /> Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
