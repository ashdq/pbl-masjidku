'use client';

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Shield, Calendar, MapPin, Phone } from 'lucide-react';

const Profile = () => {
  const { user, loading } = useAuth();
  const [isEditingPassword, setIsEditingPassword] = React.useState(false);
  const [oldPassword, setOldPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);


  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword) {
      alert('Harap isi kedua kolom password lama dan baru');
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/change-password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal mengganti password');
      }

      alert('Password berhasil diubah');
      setOldPassword('');
      setNewPassword('');
      setIsEditingPassword(false);
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Gagal mengganti password');
    } finally {
      setIsLoading(false);
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Or a message indicating no user is logged in
  }

  const currentUser = user; // Use dummy data if user is not fully populated

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-emerald-100 to-green-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden relative">
          {/* Decorative Gradient Cover */}
          <div className="h-48 md:h-60 bg-gradient-to-r from-emerald-500 via-green-400 to-green-600 relative flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 200" fill="none">
              <circle cx="100" cy="100" r="80" fill="#34d399" />
              <circle cx="300" cy="80" r="60" fill="#10b981" />
              <circle cx="200" cy="160" r="40" fill="#6ee7b7" />
            </svg>
          </div>

          {/* Profile Picture & Basic Info */}
          <div className="relative -mt-20 sm:-mt-24 flex flex-col items-center pb-10 px-8">
            <div className="h-32 w-32 sm:h-40 sm:w-40 rounded-full border-4 border-white bg-gradient-to-tr from-emerald-100 to-green-200 shadow-lg flex items-center justify-center text-emerald-600 overflow-hidden ring-4 ring-emerald-200">
              {/* Avatar Placeholder */}
              <User className="h-20 w-20 sm:h-24 sm:w-24" />
            </div>

            <h1 className="mt-6 text-3xl sm:text-4xl font-extrabold text-gray-900 text-center drop-shadow-lg">
              {currentUser.name}
            </h1>
            <p className="mt-2 text-lg text-emerald-700 capitalize font-medium">{currentUser.role}</p>
          </div>

          <hr className="border-gray-200 mx-8" />

          {/* Detailed Information */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-10 text-gray-700">
            {/* Email */}
            <div className="flex items-center space-x-4 bg-emerald-50 rounded-xl p-4 shadow-sm">
              <Mail className="h-7 w-7 text-emerald-500 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-800">Email</p>
                <p className="text-gray-600">{currentUser.email}</p>
              </div>
            </div>

            {/* Password */}
              <div className="flex flex-col space-y-2 bg-emerald-50 rounded-xl p-4 shadow-sm">
                <div className="flex items-center space-x-4 bg-emerald-50 rounded-xl p-4 shadow-sm">
                  <Shield className="h-7 w-7 text-emerald-500 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">Password</p>
                    {isEditingPassword ? (
                      <div className="space-y-2 mt-2">
                        <input
                          type="password"
                          placeholder="Password Lama"
                          className="w-full border px-3 py-2 rounded-lg"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                        />
                        <input
                          type="password"
                          placeholder="Password Baru"
                          className="w-full border px-3 py-2 rounded-lg"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
                            onClick={handlePasswordChange}
                            disabled={isLoading}
                          >
                            {isLoading ? 'Menyimpan...' : 'Simpan Password'}
                          </button>
                          <button
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                            onClick={() => {
                              setIsEditingPassword(false);
                              setOldPassword('');
                              setNewPassword('');
                            }}
                          >
                            Batal
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-gray-600 tracking-wider">••••••••••••••</p>
                        {/* <button
                          className="text-emerald-600 underline ml-4"
                          onClick={() => setIsEditingPassword(true)}
                        >
                          Ganti Password
                        </button> */}
                      </div>
                    )}
                  </div>
                </div>
              </div>
          </div>

            {/* Action Buttons moved to the bottom, full width */}
            <div className="px-8 pb-8 flex flex-col sm:flex-row gap-4 w-full justify-center">
            {!isEditingPassword ? (
              <button
              type="button"
              onClick={() => setIsEditingPassword(true)}
              className="flex-1 sm:flex-none px-8 py-3 bg-white border border-emerald-200 text-emerald-700 rounded-full hover:bg-emerald-50 transition-all duration-200 font-semibold shadow"
              >
              Edit Profil
              </button>
            ) : (
              <button
              type="button"
              onClick={() => {
                setIsEditingPassword(false);
                setOldPassword('');
                setNewPassword('');
              }}
              className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-full hover:from-emerald-600 hover:to-green-600 transition-all duration-200 font-semibold shadow-lg"
              >
              Batal Edit
              </button>
            )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;