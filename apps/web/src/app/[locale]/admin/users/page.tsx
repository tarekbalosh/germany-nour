'use client';

import { useEffect, useState } from 'react';
import { Users as UsersIcon, UserPlus, Search, MoreVertical, Shield, FileText, X, Upload, Eye, Download, Trash2 } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [certTitle, setCertTitle] = useState('');
  const [certFile, setCertFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [studentCertificates, setStudentCertificates] = useState<any[]>([]);
  const [loadingCerts, setLoadingCerts] = useState(false);

  const fetchUsers = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${apiUrl}/api/v1/admin/users`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUploadClick = (user: any) => {
    setSelectedUser(user);
    setUploadModalOpen(true);
    setCertTitle('');
    setCertFile(null);
  };

  const handleViewCertificates = async (user: any) => {
    setSelectedUser(user);
    setViewModalOpen(true);
    setLoadingCerts(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${apiUrl}/api/v1/certificates/student/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setStudentCertificates(data);
      } else {
        setStudentCertificates([]);
      }
    } catch (error) {
      console.error('Failed to fetch certificates', error);
      setStudentCertificates([]);
    } finally {
      setLoadingCerts(false);
    }
  };

  const handleDeleteCertificate = async (certId: string) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${apiUrl}/api/v1/certificates/${certId}`, { method: 'DELETE' });
      if (res.ok) {
        setStudentCertificates(studentCertificates.filter(c => c.id !== certId));
        fetchUsers();
      } else {
        alert('Failed to delete certificate');
      }
    } catch (error) {
      console.error('Failed to delete certificate', error);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certFile || !selectedUser || !certTitle) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('studentId', selectedUser.id);
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
        fetchUsers();
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
  };  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <UsersIcon className="h-8 w-8 text-blue-600" />
            Users Management
          </h1>
          <p className="mt-2 text-gray-500 font-medium">Manage students, tutors, and admin accounts.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search users by name or email..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-sm"
            />
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <span>Filter by:</span>
            <select className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Roles</option>
              <option>Students</option>
              <option>Tutors</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Joined Date</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 font-bold border border-blue-200 shadow-sm flex-shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.phoneNumber || user.email || 'No contact info'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold
                        ${user.role === 'TUTOR' ? 'bg-purple-100 text-purple-700' : 
                          user.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-700' : 'bg-blue-100 text-blue-700'}`}>
                        {user.role === 'ADMIN' && <Shield className="h-3 w-3" />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
                        ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        {user.role === 'STUDENT' && (
                          <>
                            <button 
                              onClick={() => handleViewCertificates(user)}
                              className="relative text-indigo-600 hover:text-indigo-800 transition-colors p-2 rounded-lg hover:bg-indigo-50 flex items-center gap-1"
                              title="View Certificates"
                            >
                              <Eye className="h-5 w-5" />
                              {user._count?.certificates > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full ring-2 ring-white shadow-sm">
                                  {user._count.certificates}
                                </span>
                              )}
                              <span className="sr-only">View</span>
                            </button>
                            <button 
                              onClick={() => handleUploadClick(user)}
                              className="text-blue-600 hover:text-blue-800 transition-colors p-2 rounded-lg hover:bg-blue-50 flex items-center gap-1"
                              title="Upload Certificate"
                            >
                              <Upload className="h-4 w-4" />
                              <span className="sr-only">Upload</span>
                            </button>
                          </>
                        )}
                        <button className="text-gray-400 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50">
                          <MoreVertical className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {uploadModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                <input 
                  type="text" 
                  value={selectedUser.name} 
                  disabled 
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Certificate Title</label>
                <input 
                  type="text" 
                  value={certTitle}
                  onChange={(e) => setCertTitle(e.target.value)}
                  placeholder="e.g., A1 German Language Certificate"
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
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={uploading || !certFile || !certTitle}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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

      {/* View Certificates Modal */}
      {viewModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/80">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Certificates for {selectedUser.name}
                </h2>
                <p className="text-sm text-gray-500 mt-1">Manage and view uploaded language certificates.</p>
              </div>
              <button 
                onClick={() => setViewModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 bg-gray-50/30">
              {loadingCerts ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                </div>
              ) : studentCertificates.length === 0 ? (
                <div className="text-center py-12 px-4 rounded-xl border border-dashed border-gray-300 bg-white">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900">No certificates found</h3>
                  <p className="text-sm text-gray-500 mt-1">This student doesn't have any uploaded certificates yet.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {studentCertificates.map(cert => (
                    <div key={cert.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:border-blue-300 hover:shadow-md transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                          <FileText className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{cert.title}</h4>
                          <p className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                            <span>Uploaded on {new Date(cert.createdAt).toLocaleDateString()}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <a 
                          href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}${cert.fileUrl}`} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium"
                          title="View / Download"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                        <button 
                          onClick={() => handleDeleteCertificate(cert.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-100 bg-white flex justify-end">
              <button 
                onClick={() => setViewModalOpen(false)}
                className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
