'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';

type Aspirasi = {
  id: number;
  nama: string;
  jenis_aspirasi: string;
  description: string; // Changed from 'deskripsi' to 'description'
  created_at: string;
};

const LaporanAspirasi = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [aspirasiList, setAspirasiList] = useState<Aspirasi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('semua');
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const fetchAspirasi = async () => {
      try {
        setIsLoading(true);
        setError('');
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('Token tidak ditemukan');
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/aspirasi`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Gagal mengambil data aspirasi: ${response.status}`);
        }

        const responseData = await response.json();
        
        // Handle different API response structures
        let data = responseData;
        
        // If response has data property (Laravel default)
        if (responseData && responseData.data) {
          data = responseData.data;
        }

        // Validate data is an array
        if (!Array.isArray(data)) {
          throw new Error('Format data tidak valid - Harus berupa array');
        }

        // Transform data if needed (map description to deskripsi)
        const transformedData = data.map(item => ({
          ...item,
          // If you want to keep using 'deskripsi' in the frontend:
          // deskripsi: item.description 
          // Or just use 'description' directly
        }));

        setAspirasiList(transformedData);
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan saat memuat data');
        setAspirasiList([]);
        console.error('Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAspirasi();
  }, []);

  const toggleDescription = (id: number) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus aspirasi ini?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token tidak ditemukan');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/aspirasi/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Gagal menghapus aspirasi: ${response.status}`);
      }

      setAspirasiList(prev => prev.filter(aspirasi => aspirasi.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const filteredAspirasi = aspirasiList
    .filter(aspirasi => {
      if (!aspirasi) return false;
      
      const matchesSearch = 
        (aspirasi.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         aspirasi.jenis_aspirasi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         aspirasi.description?.toLowerCase().includes(searchTerm.toLowerCase())); // Changed to description
      
      const matchesFilter = filter === 'semua' || 
                          aspirasi.jenis_aspirasi?.toLowerCase() === filter.toLowerCase();
      
      return matchesSearch && matchesFilter;
    });

  if (!user || (user.role && !['admin', 'takmir'].includes(user.role.toLowerCase()))) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="max-w-md p-6 bg-white rounded-xl shadow-md">
          <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
            <h3 className="text-lg font-medium text-red-600">Akses Dibatasi</h3>
            <p className="mt-2 text-red-500">Hanya admin dan takmir yang dapat mengakses laporan ini</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Laporan Aspirasi Warga</h2>
              <p className="text-gray-600">Daftar aspirasi yang telah disampaikan oleh warga</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Cari aspirasi..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="semua">Semua Jenis</option>
                  <option value="fasilitas masjid">Fasilitas Masjid</option>
                  <option value="kegiatan dan program">Kegiatan & Program</option>
                  <option value="pengelolaan masjid">Pengelolaan Masjid</option>
                  <option value="social dan lingkungan">Sosial & Lingkungan</option>
                  <option value="dakwah dan Pendidikan">Dakwah & Pendidikan</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jenis Aspirasi
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deskripsi
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAspirasi.length > 0 ? (
                filteredAspirasi.map((aspirasi, index) => (
                  <tr key={aspirasi.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{aspirasi.nama}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        aspirasi.jenis_aspirasi.toLowerCase().includes('fasilitas') ? 'bg-blue-100 text-blue-800' :
                        aspirasi.jenis_aspirasi.toLowerCase().includes('kegiatan') ? 'bg-purple-100 text-purple-800' :
                        aspirasi.jenis_aspirasi.toLowerCase().includes('pengelolaan') ? 'bg-yellow-100 text-yellow-800' :
                        aspirasi.jenis_aspirasi.toLowerCase().includes('social') ? 'bg-green-100 text-green-800' :
                        'bg-indigo-100 text-indigo-800'
                      }`}>
                        {aspirasi.jenis_aspirasi}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-[300px]">
                        <div className="text-sm text-gray-900">
                        <p className={expandedDescriptions[aspirasi.id] ? '' : 'line-clamp-2'}>
                            {aspirasi.description} {/* Changed from deskripsi to description */}
                        </p>
                        {aspirasi.description.length > 100 && ( /* Changed from deskripsi to description */
                            <button 
                            onClick={() => toggleDescription(aspirasi.id)}
                            className="text-sm text-green-600 hover:text-green-800 mt-1 focus:outline-none"
                            >
                            {expandedDescriptions[aspirasi.id] ? 'Tampilkan lebih sedikit' : 'Tampilkan lebih banyak'}
                            </button>
                        )}
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(aspirasi.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete(aspirasi.id)}
                        className="text-red-600 hover:text-red-900 focus:outline-none"
                        title="Hapus Aspirasi"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    {aspirasiList.length === 0 ? 'Tidak ada data aspirasi' : 'Tidak ditemukan hasil pencarian'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredAspirasi.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Menampilkan <span className="font-medium">{filteredAspirasi.length}</span> dari <span className="font-medium">{aspirasiList.length}</span> aspirasi
            </div>
            <div className="flex space-x-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Sebelumnya
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LaporanAspirasi;