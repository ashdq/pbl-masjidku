'use client'
import React, { useState, useEffect } from 'react'
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiEdit2, FiTrash2, FiSave, FiX } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'

interface User {
  id: number;
  name: string;
  email: string;
  roles: 'admin' | 'takmir' | 'warga';
  password?: string;
}

interface PaginationData {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

const ManajemenPengguna = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    roles: 'warga' as 'warga' | 'takmir'
  })
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)
  const [editingUserId, setEditingUserId] = useState<number | null>(null)
  const [editFormData, setEditFormData] = useState<Omit<User, 'id'> & { password?: string }>({
    name: '',
    email: '',
    roles: 'warga'
  })
  const [pagination, setPagination] = useState<PaginationData>({
    current_page: 1,
    last_page: 1,
    per_page: 7,
    total: 0
  })
  const [editPassword, setEditPassword] = useState('')
  const [showEditPassword, setShowEditPassword] = useState(false)
  const { user: currentUser } = useAuth()
  
  const fetchUsers = async (page: number = 1) => {
    setIsLoadingUsers(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        credentials: 'include',
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }
      
      const data = await response.json()
      console.log('Full response data:', data)
      
      if (Array.isArray(data)) {
        // Implement client-side pagination
        const startIndex = (page - 1) * 7
        const endIndex = startIndex + 7
        const paginatedData = data.slice(startIndex, endIndex)
        
        setUsers(paginatedData)
        setPagination({
          current_page: page,
          last_page: Math.ceil(data.length / 7),
          per_page: 7,
          total: data.length
        })
      } else {
        console.log('Invalid data format received:', data)
        setUsers([])
        setPagination({
          current_page: 1,
          last_page: 1,
          per_page: 7,
          total: 0
        })
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      alert('Gagal mengambil data pengguna')
      setUsers([])
    } finally {
      setIsLoadingUsers(false)
    }
  }

  useEffect(() => {
    if (currentUser?.roles === 'admin') {
      fetchUsers()
    }
  }, [currentUser])

  const handleDelete = async (userId: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        credentials: 'include',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete user')
      }
      
      fetchUsers(pagination.current_page)
      alert('Pengguna berhasil dihapus')
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Gagal menghapus pengguna')
    }
  }

  const handleEdit = (user: User) => {
    setEditingUserId(user.id)
    setEditFormData({
      name: user.name,
      email: user.email,
      roles: user.roles
    })
    setEditPassword('')
    setShowEditPassword(false)
  }
  
  const handleEditSubmit = async (userId: number) => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      const updateData = {
        ...editFormData,
        ...(editPassword && { password: editPassword })
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updateData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update user')
      }

      setEditingUserId(null)
      setEditPassword('')
      setShowEditPassword(false)
      fetchUsers(pagination.current_page)
      alert('Pengguna berhasil diperbarui')
    } catch (error) {
      console.error('Error updating user:', error)
      alert('Gagal memperbarui pengguna')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingUserId(null)
    setEditPassword('')
    setShowEditPassword(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    const token = localStorage.getItem('token');
    if (!token) {
      setErrors({ general: ['Anda harus login terlebih dahulu'] });
      setIsLoading(false);
      return;
    }
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData)
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || JSON.stringify(errorData.errors) || 'Registrasi gagal');
      }
  
      alert('Registrasi berhasil!');
      // Reset form setelah sukses
      setFormData({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        roles: 'warga'
      });
    } catch (error: any) {
      setErrors({ general: [error.message || 'Terjadi kesalahan saat registrasi'] });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function untuk mengambil cookie
  function getCookie(name: string) {
    if (typeof window === 'undefined') return null
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()?.split(';').shift()
    return null
  }

  if (currentUser?.roles !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-100 py-12 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow sm:rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Akses Ditolak</h2>
            <p className="text-gray-600">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Registration Form Card */}
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Registrasi Pengguna Baru
              </h2>
              {errors.general && (
                <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
                  <p className="text-sm text-red-700">{errors.general[0]}</p>
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nama Lengkap
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      maxLength={255}
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className={`block w-full pl-10 pr-3 py-2 border ${errors.name ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm text-gray-600 font-medium`}
                    />
                  </div>
                  {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name[0]}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Alamat Email
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      maxLength={255}
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className={`block w-full pl-10 pr-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm text-gray-600 font-medium`}
                    />
                  </div>
                  {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email[0]}</p>}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      minLength={8}
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className={`block w-full pl-10 pr-10 py-2 border ${errors.password ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm text-gray-600 font-medium`}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                      ) : (
                        <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                      )}
                    </button>
                  </div>
                  {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password[0]}</p>}
                </div>

                <div>
                  <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                    Konfirmasi Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password_confirmation"
                      name="password_confirmation"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      minLength={8}
                      value={formData.password_confirmation}
                      onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})}
                      className={`block w-full pl-10 pr-10 py-2 border ${errors.password_confirmation ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm text-gray-600 font-medium`}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                      ) : (
                        <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Daftar sebagai:
                  </label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio h-4 w-4 text-green-600"
                        name="roles"
                        value="warga"
                        checked={formData.roles === 'warga'}
                        onChange={(e) => setFormData({...formData, roles: 'warga'})}
                      />
                      <span className="ml-2 text-sm text-gray-700">Warga</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio h-4 w-4 text-green-600"
                        name="roles"
                        value="takmir"
                        checked={formData.roles === 'takmir'}
                        onChange={(e) => setFormData({...formData, roles: 'takmir'})}
                      />
                      <span className="ml-2 text-sm text-gray-700">Takmir</span>
                    </label>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Memproses...
                      </>
                    ) : 'Daftar'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* User Management Table Card */}
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Manajemen Pengguna
              </h2>
              {isLoadingUsers ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Password</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {users && users.length > 0 ? (
                          users.map((user) => (
                            <tr key={user.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {editingUserId === user.id ? (
                                  <input
                                    type="text"
                                    value={editFormData.name}
                                    onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                                    className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                  />
                                ) : (
                                  <div className="text-sm text-gray-900">{user.name}</div>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {editingUserId === user.id ? (
                                  <input
                                    type="email"
                                    value={editFormData.email}
                                    onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                                    className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                  />
                                ) : (
                                  <div className="text-sm text-gray-500">{user.email}</div>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {editingUserId === user.id ? (
                                  <select
                                    value={editFormData.roles}
                                    onChange={(e) => setEditFormData({...editFormData, roles: e.target.value as any})}
                                    className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                  >
                                    <option value="warga">Warga</option>
                                    <option value="takmir">Takmir</option>
                                    <option value="admin">Admin</option>
                                  </select>
                                ) : (
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    ${user.roles === 'admin' ? 'bg-red-100 text-red-800' : 
                                      user.roles === 'takmir' ? 'bg-yellow-100 text-yellow-800' : 
                                      'bg-green-100 text-green-800'}`}>
                                    {user.roles}
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {editingUserId === user.id ? (
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="password"
                                      value={editPassword}
                                      onChange={(e) => setEditPassword(e.target.value)}
                                      placeholder="Password baru (kosongkan jika tidak diubah)"
                                      className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    />
                                  </div>
                                ) : (
                                  <div className="text-sm text-gray-500">••••••••</div>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                {editingUserId === user.id ? (
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() => handleEditSubmit(user.id)}
                                      disabled={isLoading}
                                      className="text-green-600 hover:text-green-900"
                                    >
                                      <FiSave className="h-5 w-5" />
                                    </button>
                                    <button
                                      onClick={handleCancelEdit}
                                      className="text-red-600 hover:text-red-900"
                                    >
                                      <FiX className="h-5 w-5" />
                                    </button>
                                  </div>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => handleEdit(user)}
                                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                                    >
                                      <FiEdit2 className="h-5 w-5" />
                                    </button>
                                    {currentUser?.id !== user.id && (
                                      <button
                                        onClick={() => handleDelete(user.id)}
                                        className="text-red-600 hover:text-red-900"
                                      >
                                        <FiTrash2 className="h-5 w-5" />
                                      </button>
                                    )}
                                  </>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                              Tidak ada data pengguna
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Pagination */}
                  {users && users.length > 0 && (
                    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
                      <div className="flex justify-between flex-1 sm:hidden">
                        <button
                          onClick={() => fetchUsers(pagination.current_page - 1)}
                          disabled={pagination.current_page === 1}
                          className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => fetchUsers(pagination.current_page + 1)}
                          disabled={pagination.current_page === pagination.last_page}
                          className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm text-gray-700">
                            Showing <span className="font-medium">{((pagination.current_page - 1) * pagination.per_page) + 1}</span> to{' '}
                            <span className="font-medium">
                              {Math.min(pagination.current_page * pagination.per_page, pagination.total)}
                            </span>{' '}
                            of <span className="font-medium">{pagination.total}</span> results
                          </p>
                        </div>
                        <div>
                          <nav className="inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                            <button
                              onClick={() => fetchUsers(pagination.current_page - 1)}
                              disabled={pagination.current_page === 1}
                              className="relative inline-flex items-center px-2 py-2 text-gray-400 rounded-l-md border border-gray-300 bg-white text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Previous
                            </button>
                            {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
                              <button
                                key={page}
                                onClick={() => fetchUsers(page)}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                  page === pagination.current_page
                                    ? 'z-10 bg-green-50 border-green-500 text-green-600'
                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                }`}
                              >
                                {page}
                              </button>
                            ))}
                            <button
                              onClick={() => fetchUsers(pagination.current_page + 1)}
                              disabled={pagination.current_page === pagination.last_page}
                              className="relative inline-flex items-center px-2 py-2 text-gray-400 rounded-r-md border border-gray-300 bg-white text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Next
                            </button>
                          </nav>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManajemenPengguna