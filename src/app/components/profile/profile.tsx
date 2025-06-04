'use client';

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Shield, Calendar, MapPin, Phone } from 'lucide-react';

const Profile = () => {
  const { user, loading } = useAuth();

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

  // Dummy data for demonstration if user object is incomplete
  const dummyUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Pengguna Aktif',
    joinedDate: '2023-01-15',
    location: 'Surakarta, Indonesia',
    phone: '+62 812 3456 7890',
    // Add more fields as needed for the profile display
  };

  const currentUser = user || dummyUser; // Use dummy data if user is not fully populated

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
          {/* Cover Image */}
          <div className="h-48 md:h-60 bg-gradient-to-r from-emerald-500 to-green-600 relative flex items-center justify-center">
            {/* You can add a subtle pattern or texture here for more visual interest */}
          </div>

          {/* Profile Picture & Basic Info */}
          <div className="relative -mt-20 sm:-mt-24 flex flex-col items-center pb-8 px-8">
            <div className="h-32 w-32 sm:h-40 sm:w-40 rounded-full border-4 border-white bg-white shadow-lg flex items-center justify-center text-emerald-600 overflow-hidden">
              {/* This is where a user's avatar image would go */}
              {/* For now, keeping the icon as a placeholder */}
              <User className="h-20 w-20 sm:h-24 sm:w-24" />
            </div>

            <h1 className="mt-6 text-3xl sm:text-4xl font-extrabold text-gray-900 text-center">
              {currentUser.name}
            </h1>
            <p className="mt-2 text-lg text-gray-600 capitalize">{currentUser.role}</p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full justify-center">
              <button className="flex-1 sm:flex-none px-8 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-all duration-200 font-semibold shadow-sm">
                Edit Profil
              </button>
              <button className="flex-1 sm:flex-none px-8 py-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-all duration-200 font-semibold shadow-md">
                Simpan Perubahan
              </button>
            </div>
          </div>

          <hr className="border-gray-200 mx-8" />

          {/* Detailed Information */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 text-gray-700">
            {/* Email */}
            <div className="flex items-center space-x-3">
              <Mail className="h-6 w-6 text-emerald-500 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-800">Email</p>
                <p className="text-gray-600">{currentUser.email}</p>
              </div>
            </div>

            {/* Role */}
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6 text-emerald-500 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-800">Peran</p>
                <p className="text-gray-600 capitalize">{currentUser.roles}</p>
              </div>
            </div>

            {/* <div className="flex items-center space-x-3">
              <Calendar className="h-6 w-6 text-emerald-500 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-800">Tanggal Bergabung</p>
                <p className="text-gray-600">{currentUser.joinedDate}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <MapPin className="h-6 w-6 text-emerald-500 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-800">Lokasi</p>
                <p className="text-gray-600">{currentUser.location}</p>
              </div>
            </div>

            {currentUser.phone && (
              <div className="flex items-center space-x-3">
                <Phone className="h-6 w-6 text-emerald-500 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800">Telepon</p>
                  <p className="text-gray-600">{currentUser.phone}</p>
                </div>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;