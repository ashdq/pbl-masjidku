'use client';

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Shield, Calendar, MapPin, Phone } from 'lucide-react';

const Profile = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Cover Image */}
          <div className="h-48 bg-gradient-to-r from-green-400 to-green-600 relative">
            <div className="absolute -bottom-16 left-8">
              <div className="h-32 w-32 rounded-full border-4 border-white bg-white shadow-lg flex items-center justify-center">
                <User className="h-16 w-16 text-green-600" />
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-20 pb-8 px-8">
            {/* Name and Role */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-500 mt-1 capitalize">{user.role}</p>
            </div>
            {/* Action Buttons */}
            <div className="mt-8 flex justify-end space-x-4">
              <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                Edit Profil
              </button>
              <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 