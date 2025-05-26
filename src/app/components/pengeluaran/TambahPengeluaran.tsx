// src/app/components/pengeluaran/TambahPengeluaran.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { FiArrowLeft, FiDollarSign, FiCalendar, FiFileText, FiCheckCircle, FiUpload } from 'react-icons/fi';
import { motion } from 'framer-motion';

const TambahPengeluaran = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    keperluan: '',
    jumlah_pengeluaran: '',
    tanggal: new Date().toISOString().split('T')[0],
    deskripsi: '',
    nota: null as File | null
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        router.push('../../dashboard/admin');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [success, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('File harus berupa gambar');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Ukuran file maksimal 5MB');
        return;
      }

      setFormData(prev => ({
        ...prev,
        nota: file
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validasi nota wajib diisi
    if (!formData.nota) {
      setError('Nota pembayaran wajib diupload!');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token tidak ditemukan');

      // Create FormData object to handle file upload
      const formDataToSend = new FormData();
      formDataToSend.append('keperluan', formData.keperluan);
      formDataToSend.append('jumlah_pengeluaran', formData.jumlah_pengeluaran);
      formDataToSend.append('tanggal', formData.tanggal);
      formDataToSend.append('deskripsi', formData.deskripsi);
      if (formData.nota) {
        formDataToSend.append('nota', formData.nota);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pengeluaran`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal menambahkan pengeluaran');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-gray-50"
      >
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-4"
          >
            <FiCheckCircle className="text-green-500 text-5xl" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Pengeluaran Berhasil Ditambahkan!</h2>
          <p className="text-gray-600 mb-6">Anda akan diarahkan kembali ke halaman pengeluaran...</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.5 }}
              className="bg-green-500 h-2.5 rounded-full"
            />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-md mx-auto">
        <motion.div
          whileHover={{ x: -5 }}
          className="mb-6"
        >
          <button
            onClick={() => router.push('../../dashboard/admin')}
            className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            <FiArrowLeft className="mr-2" /> Kembali ke Dashboard 
          </button>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white p-8 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Tambah Pengeluaran Baru</h1>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded"
            >
              <p>{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="keperluan">
                Keperluan
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="keperluan"
                  name="keperluan"
                  value={formData.keperluan}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-800"
                  placeholder="Contoh: Belanja kebutuhan bulanan"
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiFileText className="text-gray-400" />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="jumlah_pengeluaran">
                Jumlah Pengeluaran (Rp)
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="jumlah_pengeluaran"
                  name="jumlah_pengeluaran"
                  value={formData.jumlah_pengeluaran}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-800"
                  placeholder="500000"
                  min="0"
                  step="1000"
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-sm font-medium">Rp</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="tanggal">
                Tanggal
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="tanggal"
                  name="tanggal"
                  value={formData.tanggal}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-800"
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiCalendar className="text-gray-400" />
                </div>
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="deskripsi">
                Deskripsi
              </label>
              <textarea
                id="deskripsi"
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-800"
                rows={4}
                placeholder="Detail pengeluaran (opsional)"
              />
            </div>

            <div className="mb-8">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="nota">
                Nota Pembayaran
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  {previewUrl ? (
                    <div className="mb-4">
                      <img
                        src={previewUrl}
                        alt="Preview nota"
                        className="mx-auto h-32 w-auto object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewUrl(null);
                          setFormData(prev => ({ ...prev, nota: null }));
                        }}
                        className="mt-2 text-sm text-red-600 hover:text-red-800"
                      >
                        Hapus gambar
                      </button>
                    </div>
                  ) : (
                    <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                  )}
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="nota"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>{previewUrl ? 'Ganti gambar' : 'Upload gambar'}</span>
                      <input
                        id="nota"
                        name="nota"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="sr-only"
                        required
                      />
                    </label>
                    <p className="pl-1">atau drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF sampai 5MB
                  </p>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-md transition ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Menyimpan...
              </span>
              ) : (
              'Simpan Pengeluaran'
              )}
            </motion.button>
          </form>
        </motion.div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Pastikan data yang dimasukkan sudah benar sebelum menyimpan</p>
        </div>
      </div>
    </motion.div>
  );
};

export default TambahPengeluaran;