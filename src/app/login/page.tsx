'use client';

import React, { useState } from 'react';
import { AiOutlineUser, AiOutlineLock, AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'; // Import ikon mata
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import Link from "next/link";

function Login() {
  const [showPassword, setShowPassword] = useState(false); // State untuk mengatur visibilitas password

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="bg-white rounded-xl shadow-lg md:flex md:max-w-2xl lg:max-w-3xl overflow-hidden w-full">
        {/* Left Side (Form) */}
        <div className="p-8 md:p-12 lg:p-16 md:w-1/2 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">Login</h2>
          <p className="text-gray-600 text-sm">Masukkan Username dan Password Anda</p>
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <AiOutlineUser />
              </div>
              <input
                type="text"
                id="username"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-base px-4 py-3 border-gray-300 rounded-md"
                placeholder="Your username"
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
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-base px-4 py-3 border-gray-300 rounded-md"
                placeholder="Your password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>
          </div>
          <Link
            href="/dashboard"
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition duration-150 ease-in-out w-full"
          >
            Sign In
          </Link>
          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Or sign in with</span>
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
          {/* Lupa Password */}
          <div className="text-right mt-2">
            <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500">
              Lupa Password?
            </a>
          </div>
        </div>

        {/* Right Side (Image and Text) */}
        <div className="bg-gradient-to-r from-green-500 to-green-400 rounded-r-xl md:w-1/2 p-8 md:p-12 lg:p-16 text-white flex flex-col justify-center items-center relative overflow-hidden">
          <img
            src="/aa.png"
            alt="Deskripsi Gambar"
            className="w-[70%] h-auto absolute bottom-4 left-4"
          />
        </div>
      </div>
    </div>
  );
}

export default Login;
