'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { FileText, Upload, Download, Trash2, X } from 'lucide-react';

export default function StudentPortalPage() {
  const t = useTranslations('Index'); // Fallback to index if no portal translations
  const [student, setStudent] = useState<any>(null);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Upload state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [certTitle, setCertTitle] = useState('');
  const [certFile, setCertFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const authData = localStorage.getItem('student_auth');
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        setStudent(parsed);
        fetchCertificates(parsed.id);
      } catch (e) {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCertificates = async (studentId: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${apiUrl}/api/v1/certificates/student/${studentId}`);
      if (res.ok) {
        const data = await res.json();
        setCertificates(data);
      }
    } catch (error) {
      console.error('Failed to fetch certificates', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certFile || !student || !certTitle) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('studentId', student.id);
      formData.append('title', certTitle);
      formData.append('file', certFile);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${apiUrl}/api/v1/certificates/upload`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        alert('Certificate uploaded successfully!');
        setUploadModalOpen(false);
        setCertTitle('');
        setCertFile(null);
        fetchCertificates(student.id); // Refresh
      } else {
        const err = await res.json();
        alert(`Failed to upload: ${err.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Upload failed', error);
      alert('Failed to upload certificate');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteCertificate = async (certId: string) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${apiUrl}/api/v1/certificates/${certId}`, { method: 'DELETE' });
      if (res.ok) {
        setCertificates(certificates.filter(c => c.id !== certId));
      } else {
        alert('Failed to delete certificate');
      }
    } catch (error) {
      console.error('Failed to delete certificate', error);
    }
  };

  if (!student && !loading) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-4">My Account</h1>
        <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-200">
          <p>Please log in to view your account.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">My Account</h1>
          <p className="text-gray-500 mt-1">Welcome back, {student?.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <section className="bg-white shadow-sm border border-gray-100 p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-4 text-gray-900">My Materials</h2>
          <p className="text-gray-500 text-sm">No new materials uploaded.</p>
        </section>
        
        <section className="bg-white shadow-sm border border-gray-100 p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-4 text-gray-900">My Progress</h2>
          <p className="text-gray-500 text-sm">No new tutor feedback.</p>
        </section>

        {/* Certificates Section */}
        <section className="bg-white shadow-sm border border-gray-100 p-6 rounded-2xl md:col-span-2 lg:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              My Certificates
            </h2>
            <button 
              onClick={() => setUploadModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload Certificate
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : certificates.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-xl border border-dashed border-gray-300 bg-gray-50">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900">No certificates uploaded</h3>
              <p className="text-sm text-gray-500 mt-1">Upload your language certificates here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {certificates.map(cert => (
                <div key={cert.id} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col hover:border-blue-300 hover:shadow-md transition-all group">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 line-clamp-2">{cert.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(cert.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-auto flex items-center gap-2 pt-4 border-t border-gray-50">
                    <a 
                      href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}${cert.fileUrl}`} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-3 py-2 text-center text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Download className="h-4 w-4" />
                      View
                    </a>
                    <button 
                      onClick={() => handleDeleteCertificate(cert.id)}
                      className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Upload Certificate
              </h2>
              <button 
                onClick={() => setUploadModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleUploadSubmit} className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Certificate Title</label>
                <input 
                  type="text" 
                  value={certTitle}
                  onChange={(e) => setCertTitle(e.target.value)}
                  placeholder="e.g., B1 German Language Certificate"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">PDF File</label>
                <input 
                  type="file" 
                  accept=".pdf"
                  onChange={(e) => setCertFile(e.target.files ? e.target.files[0] : null)}
                  required
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={uploading || !certFile || !certTitle}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Upload
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
