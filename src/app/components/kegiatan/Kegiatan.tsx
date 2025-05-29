'use client';
import Swal from 'sweetalert2';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/app/context/AuthContext';

interface Kegiatan {
  id?: number;
  nama_kegiatan: string;
  tanggal_kegiatan: string;
  waktu_kegiatan: string;
  gambar_kegiatan?: string;
}

export default function PengelolaanKegiatan() {
  const { user } = useAuth();
  const [kegiatan, setKegiatan] = useState<Kegiatan[]>([]);
  const [formData, setFormData] = useState<Kegiatan>({
    nama_kegiatan: '',
    tanggal_kegiatan: '',
    waktu_kegiatan: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Check if user has permission to manage kegiatan
  const canManageKegiatan = user?.roles?.includes('admin') || user?.roles?.includes('takmir');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch kegiatan data
  useEffect(() => {
    if (mounted && canManageKegiatan) {
      fetchKegiatan();
    }
  }, [mounted, canManageKegiatan]);

  const fetchKegiatan = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/kegiatan`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Gagal memuat data kegiatan');
      }
      
      const result = await response.json();
      setKegiatan(result.data);
    } catch (error) {
      console.error('Error fetching kegiatan:', error);
      setError('Gagal memuat data kegiatan');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validate file type
      if (!file.type.match('image/(jpeg|png|jpg)')) {
        setError('Format file harus jpeg, png, atau jpg');
        return;
      }
      // Validate file size (2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError('Ukuran file maksimal 2MB');
        return;
      }
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const formDataToSend = new FormData();
    // Jangan pernah append gambar_kegiatan dari formData (string path lama)
    Object.entries(formData).forEach(([key, value]) => {
      if (
        key !== 'gambar_kegiatan' && // <-- skip gambar_kegiatan dari formData
        value !== undefined &&
        value !== null
      ) {
        formDataToSend.append(key, value);
      }
    });

    // Tambahkan ini jika sedang edit
    if (isEditing) {
      formDataToSend.append('_method', 'PUT');
    }

    // Hanya kirim gambar_kegiatan jika user memilih gambar baru
    if (selectedImage) {
      formDataToSend.append('gambar_kegiatan', selectedImage);
    }

    try {
      const token = localStorage.getItem('token');
      const url = isEditing 
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/kegiatan/${formData.id}`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/kegiatan`;

      const response = await fetch(url, {
        method: isEditing ? 'POST' : 'POST', // POST untuk semua, PUT disimulasikan lewat _method
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Terjadi kesalahan');
      }

      const result = await response.json();
      fetchKegiatan();
      resetForm();
      alert(isEditing ? 'Kegiatan berhasil diperbarui' : 'Kegiatan berhasil ditambahkan');
    } catch (error) {
      console.error('Error saving kegiatan:', error);
      setError(error instanceof Error ? error.message : 'Terjadi kesalahan saat menyimpan kegiatan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (kegiatan: Kegiatan) => {
    setFormData(kegiatan);
    setIsEditing(true);
    if (kegiatan.gambar_kegiatan) {
      setPreviewUrl(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${kegiatan.gambar_kegiatan}`);
    }
  };


const handleDelete = async (id: number) => {
  Swal.fire({
    title: "Apakah Anda yakin?",
    text: "Data kegiatan akan dihapus dan tidak bisa dikembalikan!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Ya, hapus!"
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/kegiatan/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Gagal menghapus kegiatan');
        }

        fetchKegiatan();

        Swal.fire({
          title: "Berhasil!",
          text: "Kegiatan berhasil dihapus.",
          icon: "success"
        });
      } catch (error) {
        console.error('Error deleting kegiatan:', error);
        setError('Gagal menghapus kegiatan');

        Swal.fire({
          title: "Gagal!",
          text: "Terjadi kesalahan saat menghapus kegiatan.",
          icon: "error"
        });
      }
    }
  });
};

  const resetForm = () => {
    setFormData({
      nama_kegiatan: '',
      tanggal_kegiatan: '',
      waktu_kegiatan: '',
    });
    setSelectedImage(null);
    setPreviewUrl('');
    setIsEditing(false);
    setError('');
  };

  if (!mounted) {
    return null;
  }

  if (!canManageKegiatan) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-center text-gray-600">
          Anda tidak memiliki akses untuk mengelola kegiatan
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Form Section */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg transition-shadow duration-300 hover:shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          {isEditing ? 'Edit Kegiatan' : 'Tambah Kegiatan Baru'}
        </h2>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kegiatan</label>
            <input
              type="text"
              name="nama_kegiatan"
              value={formData.nama_kegiatan}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-400 transition"
              placeholder="Masukkan nama kegiatan"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Kegiatan</label>
              <input
                type="date"
                name="tanggal_kegiatan"
                value={formData.tanggal_kegiatan}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Waktu Kegiatan</label>
              <input
                type="time"
                name="waktu_kegiatan"
                value={formData.waktu_kegiatan}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gambar Kegiatan</label>
            <div className="mt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleImageChange}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200 transition"
              />
              {previewUrl && (
                <div className="relative w-24 h-24 rounded-md overflow-hidden shadow-md">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-500">Format: JPG, JPEG, PNG. Maksimal 2MB</p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={resetForm}
              className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 transition font-medium disabled:opacity-50"
              disabled={isLoading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-green-600 text-white hover:bg-green-700 transition font-medium disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Menyimpan...' : isEditing ? 'Update' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>


      {/* List Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Daftar Kegiatan</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Kegiatan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Waktu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gambar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {kegiatan.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                    {item.nama_kegiatan}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                    {new Date(item.tanggal_kegiatan).toLocaleDateString('id-ID')}
                  </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                    {
                      (() => {
                      const tanggalRaw = item.tanggal_kegiatan;
                      const waktuRaw = item.waktu_kegiatan;

                      // Ambil tanggal saja (YYYY-MM-DD)
                      const tanggal = tanggalRaw && tanggalRaw.includes('T')
                        ? tanggalRaw.split('T')[0]
                        : tanggalRaw;

                      // Ambil jam:menit:detik saja dari waktu (HH:mm:ss)
                      let waktu = waktuRaw;
                      if (waktuRaw && waktuRaw.includes('T')) {
                        const afterT = waktuRaw.split('T')[1];
                        waktu = afterT ? afterT.split('.')[0] : '';
                      } else if (waktuRaw && waktuRaw.length > 8) {
                        // Jika waktuRaw seperti '19:30:00.000000Z'
                        waktu = waktuRaw.split('.')[0];
                      }

                      // Jika waktu adalah '00:00:00', jangan tampilkan
                      return waktu && waktu !== '00:00:00'
                        ? `${tanggal} ${waktu}`
                        : tanggal;
                      })()
                    }
                    </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.gambar_kegiatan && (
                      <div className="relative w-16 h-16">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${item.gambar_kegiatan}`}
                          alt={item.nama_kegiatan}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => item.id && handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Hapus"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}