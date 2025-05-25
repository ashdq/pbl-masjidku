'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';


const Aspirasi = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [jenisAspirasi, setJenisAspirasi] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Initialize CSRF token
  useEffect(() => {
    const initCsrf = async () => {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sanctum/csrf-cookie`, {
          credentials: 'include',
        });
      } catch (err) {
        console.error('CSRF token initialization failed:', err);
      }
    };
    initCsrf();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!jenisAspirasi || !description) {
      setError('Semua field harus diisi!');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      // Ambil CSRF cookie TEPAT sebelum submit
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sanctum/csrf-cookie`, {
        credentials: 'include'
      });

      // Ambil XSRF-TOKEN dari cookie setelah request di atas
      const xsrfToken = getCookie('XSRF-TOKEN');

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/aspirasi`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
          ...(xsrfToken && { 'X-XSRF-TOKEN': decodeURIComponent(xsrfToken) })
        },
        body: JSON.stringify({
          jenis_aspirasi: jenisAspirasi.toLowerCase(),
          description
        })
      });

      if (response.status === 419) {
        throw new Error('CSRF token mismatch. Silakan refresh halaman dan coba lagi.');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal mengirim aspirasi');
      }

      alert('Aspirasi berhasil dikirim!');
      setJenisAspirasi('');
      setDescription('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to get cookie
  function getCookie(name: string) {
    if (typeof document === 'undefined') return '';
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
  }

  // Tampilkan loading jika user masih null/undefined (belum selesai fetch)
  if (user === undefined) {
    return (
      <div className="p-4 text-center text-gray-500">
        Memuat data pengguna...
      </div>
    );
  }

  // Pastikan role dicek tanpa case sensitive
  if (!user || (user.role && user.role.toLowerCase() !== 'warga')) {
    return (
      <div className="p-4 text-center text-red-500">
        Hanya warga yang dapat mengirim aspirasi
      </div>
    );
  }

  return (
    <div className="max-w-[600px] mx-auto my-10 p-6 border border-gray-300 rounded-xl bg-gray-50 shadow-sm">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Form Aspirasi Warga</h2>
      
      {error && (
        <div className="mb-4 p-3 text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-gray-900">
        Jenis Aspirasi:
          </label>
          <select
        value={jenisAspirasi}
        onChange={(e) => setJenisAspirasi(e.target.value)}
        className="w-full p-3 mt-1 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
        required
        disabled={isSubmitting}
          >
        <option value="" className="text-gray-700">-- Pilih jenis aspirasi --</option>
        <option value="fasilitas masjid" className="text-gray-900">Fasilitas Masjid</option>
        <option value="kegiatan dan program" className="text-gray-900">Kegiatan dan Program</option>
        <option value="pengelolaan masjid" className="text-gray-900">Pengelolaan Masjid</option>
        <option value="social dan lingkungan" className="text-gray-900">Sosial dan Lingkungan</option>
        <option value="dakwah dan Pendidikan" className="text-gray-900">Dakwah dan Pendidikan</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-semibold text-gray-900">
        Deskripsi Aspirasi:
          </label>
          <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-3 mt-1 border border-gray-400 rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
        placeholder="Tuliskan detail aspirasi Anda..."
        required
        disabled={isSubmitting}
          />
        </div>

        <button
          type="submit"
          className={`mt-3 py-3 px-6 font-bold text-lg rounded-xl ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600 shadow-md shadow-green-200'
          } text-white transition-colors`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Mengirim...' : 'Kirim Aspirasi'}
        </button>
      </form>
    </div>
  );
};

export default Aspirasi;