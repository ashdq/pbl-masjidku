'use client';

import React, { useState, useEffect  } from 'react';
import { AiOutlineUser, AiOutlineLock, AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { user, login } = useAuth();
  const router = useRouter();


  useEffect(() => {
    if (user) {
      router.push('/dashboard/' + user.roles);
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      await fetch('/sanctum/csrf-cookie', { credentials: 'include' });
      // 1. Dapatkan CSRF cookie terlebih dahulu
      const csrfResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sanctum/csrf-cookie`, {
        credentials: 'include',
      });

      if (!csrfResponse.ok) {
        throw new Error('Gagal mendapatkan CSRF token');
      }

      // 2. Lakukan login
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-XSRF-TOKEN': getCookie('XSRF-TOKEN') ?? '',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 422) {
          setErrors(data.errors || {});
        } else {
          throw new Error(data.message || 'Login failed');
        }
        return;
      }

      // Simpan token ke localStorage
      localStorage.setItem('token', data.access_token);
      
      // Update auth context dan redirect
      await login(data.user, data.access_token)
      router.push('/dashboard/' + data.user.roles);
    } catch (error: any) {
      if (error.message.includes('CSRF')) {
        setErrors({
          general: ['Sesi expired, silakan refresh halaman dan coba lagi']
        });
      } else {
        setErrors({
          general: [error.message || 'Terjadi kesalahan saat login']
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function untuk mengambil cookie
  function getCookie(name: string) {
    if (typeof window === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/masjid-login.jpg')" }}>
      <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg md:flex md:max-w-2xl lg:max-w-3xl overflow-hidden w-full">
        {/* Left Side (Form) */}
        <div className="p-8 md:p-12 lg:p-16 md:w-1/2 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">Login</h2>
          <p className="text-gray-700 text-sm">Masukkan Email dan Password Anda</p>
          
          {errors.general && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-sm text-red-700">{errors.general[0]}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <AiOutlineUser />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-base px-4 py-3 border-2 border-gray-300 rounded-md bg-white/90 text-gray-900 placeholder-gray-500"
                  placeholder="Alamat Email"
                />
              </div>
            </div>
            
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <AiOutlineLock />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  minLength={8}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-base px-4 py-3 border-2 border-gray-300 rounded-md bg-white/90 text-gray-900 placeholder-gray-500"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </button>
              </div>
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition duration-150 ease-in-out w-full disabled:opacity-50 border-2 border-green-600"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memproses...
                  </>
                ) : 'Masuk'}
              </button>
            </div>
          </form>
          
          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Atau masuk dengan</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              className="flex items-center justify-center bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition duration-150 ease-in-out w-full"
              type="button"
            >
              <FcGoogle className="mr-2" />
              Google
            </button>
            <button
              className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition duration-150 ease-in-out w-full"
              type="button"
            >
              <FaFacebook className="mr-2" />
              Facebook
            </button>
          </div>
          
          <div className="flex justify-between mt-4">
            <Link href="/forgot-password" className="text-sm text-gray-600 hover:text-indigo-500">
              Lupa Password?
            </Link>
            <Link href="/register" className="text-sm text-gray-600 hover:text-indigo-500">
              Belum punya akun? Daftar
            </Link>
          </div>

          <div className="mt-6 flex items-center justify-center">
            <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Kembali
            </Link>
          </div>
        </div>

        {/* Right Side (Image and Text) */}
        <div className="bg-gradient-to-r from-green-500 to-green-400 rounded-r-xl md:w-1/2 p-8 md:p-12 lg:p-16 text-white flex flex-col justify-center items-center relative overflow-hidden">
          <img
            src="/aa.png"
            alt="Masjid"
            className="w-[70%] h-auto absolute bottom-4 left-4"
          />
        </div>
      </div>
    </div>
  );
}
