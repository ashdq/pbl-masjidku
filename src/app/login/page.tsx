'use client';

import React, { useState, useEffect } from 'react';
import { AiOutlineUser, AiOutlineLock, AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import 'animate.css'; // <- Import animate.css

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
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
      const csrfResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sanctum/csrf-cookie`, {
        credentials: 'include',
      });

      if (!csrfResponse.ok) throw new Error('Gagal mendapatkan CSRF token');

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

      localStorage.setItem('token', data.access_token);
      await login(data.user, data.access_token);
      router.push('/dashboard/' + data.user.roles);
    } catch (error: any) {
      setErrors({
        general: [error.message.includes('CSRF') ? 'Sesi expired, silakan refresh halaman dan coba lagi' : error.message || 'Terjadi kesalahan saat login']
      });
    } finally {
      setIsLoading(false);
    }
  };

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
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat px-4 sm:px-6 lg:px-8">
  <div className="bg-white/70 backdrop-blur-lg rounded-xl shadow-2xl w-full max-w-4xl mx-auto overflow-hidden flex flex-col md:flex-row animate__animated animate__fadeInDown">
    {/* Left Form Side */}
    <div className="w-full md:w-1/2 p-6 sm:p-10 lg:p-16 space-y-5 animate__animated animate__fadeInLeft">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Selamat Datang</h2>
      <p className="text-gray-600 text-sm">Silakan login ke akun Anda untuk melanjutkan</p>

      {errors.general && (
        <div className="mb-4 bg-red-100 border-l-4 border-red-500 p-4 rounded-md">
          <p className="text-sm text-red-700">{errors.general[0]}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
            <AiOutlineUser />
          </span>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full pl-10 pr-4 py-3 rounded-md border-2 border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none bg-white placeholder-gray-500 text-gray-800"
            placeholder="Alamat Email"
          />
        </div>

        {/* Password */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
            <AiOutlineLock />
          </span>
          <input
            type={showPassword ? 'text' : 'password'}
            required
            value={formData.password}
            minLength={8}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full pl-10 pr-10 py-3 rounded-md border-2 border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none bg-white placeholder-gray-500 text-gray-800"
            placeholder="Password"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md shadow-md transition-transform transform hover:-translate-y-0.5 disabled:opacity-50"
        >
          {isLoading ? (
            <span className="flex justify-center items-center">
              <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
              </svg>
              Memproses...
            </span>
          ) : 'Masuk'}
        </button>
      </form>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 text-sm space-y-2 sm:space-y-0 sm:space-x-2">
        <Link href="/forgot-password" className="text-gray-600 hover:text-green-600">Lupa Password?</Link>
        <Link href="/register" className="text-gray-600 hover:text-green-600">Belum punya akun? Daftar</Link>
      </div>

      <div className="mt-6 flex items-center justify-center">
        <Link href="/" className="text-gray-600 hover:text-green-700 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Beranda
        </Link>
      </div>
    </div>

    {/* Right Image Side */}
    <div className="hidden md:flex w-full md:w-1/2 bg-gradient-to-br from-green-600 to-green-400 text-white relative items-center justify-center animate__animated animate__fadeInRight">
      <img
        src="/aa.png"
        alt="Masjid"
        className="w-[60%] max-w-xs md:max-w-sm lg:max-w-md h-auto absolute bottom-4 left-4 object-contain"
      />
    </div>
  </div>
</div>
  );
}
