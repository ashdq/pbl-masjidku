'use client';

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
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });
    
    if (selectedImage) {
      formDataToSend.append('gambar_kegiatan', selectedImage);
    }

    try {
      const token = localStorage.getItem('token');
      const url = isEditing 
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/kegiatan/${formData.id}`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/kegiatan`;
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
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
    if (window.confirm('Apakah Anda yakin ingin menghapus kegiatan ini?')) {
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
        alert('Kegiatan berhasil dihapus');
      } catch (error) {
        console.error('Error deleting kegiatan:', error);
        setError('Gagal menghapus kegiatan');
      }
    }
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
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          {isEditing ? 'Edit Kegiatan' : 'Tambah Kegiatan Baru'}
        </h2>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama Kegiatan</label>
            <input
              type="text"
              name="nama_kegiatan"
              value={formData.nama_kegiatan}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-gray-900 placeholder-gray-400"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tanggal Kegiatan</label>
              <input
                type="date"
                name="tanggal_kegiatan"
                value={formData.tanggal_kegiatan}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Waktu Kegiatan</label>
              <input
                type="time"
                name="waktu_kegiatan"
                value={formData.waktu_kegiatan}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-gray-900"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Gambar Kegiatan</label>
            <div className="mt-1 flex items-center space-x-4">
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              />
              {previewUrl && (
                <div className="relative w-20 h-20">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Format: JPG, JPEG, PNG. Maksimal 2MB
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
              disabled={isLoading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 font-medium"
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
                    {item.waktu_kegiatan}
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