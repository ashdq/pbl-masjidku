'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { 
  FiPlus, 
  FiClock, 
  FiDollarSign, 
  FiCalendar, 
  FiFileText,
  FiRefreshCw,
  FiDownload,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Donasi {
  id: number;
  nama: string;
  jumlah_donasi: number;
  date: string;
  note: string | null;
  user_id: number;
  donatur_id: number | null;
}

interface DonasiStats {
  total_donasi: number;
  jumlah_donasi: number;
  monthly_statistics?: Array<{
    month: number;
    total: number;
    count: number;
  }>;
  riwayat_donasi: Donasi[];
  user?: {
    id: number;
    name: string;
    email: string;
    roles: 'admin' | 'takmir' | 'warga';
  };
}

const Donasi = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    nama: user?.name || '',
    jumlah_donasi: '',
    date: new Date().toISOString().split('T')[0],
    note: ''
  });
  const [donasiStats, setDonasiStats] = useState<DonasiStats>({
    total_donasi: 0,
    jumlah_donasi: 0,
    riwayat_donasi: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [dateFilter, setDateFilter] = useState({
    start: new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    total: 0
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        nama: user.name || ''
      }));
      fetchMyDonations();
    }
  }, [user, pagination.page, pagination.perPage]);

  const fetchMyDonations = async () => {
    try {
      setIsLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      const url = new URL(`${baseUrl}/api/donasi/my-donations`);
      url.searchParams.append('page', pagination.page.toString());
      url.searchParams.append('per_page', pagination.perPage.toString());
      url.searchParams.append('start_date', dateFilter.start);
      url.searchParams.append('end_date', dateFilter.end);

      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expired. Please login again.');
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to load donation data');
      }

      const responseData = await response.json();
      
      if (responseData.status !== 'success' || !responseData.data) {
        throw new Error('Invalid data format received from server');
      }

      setDonasiStats({
        total_donasi: responseData.data.total_donasi || 0,
        jumlah_donasi: responseData.data.jumlah_donasi || 0,
        monthly_statistics: responseData.data.monthly_statistics || [],
        riwayat_donasi: responseData.data.riwayat_donasi || [],
        user: responseData.data.user
      });

      setPagination(prev => ({
        ...prev,
        total: responseData.data.total || responseData.data.riwayat_donasi?.length || 0
      }));

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching donations:', error);
      setError(error instanceof Error ? error.message : 'Failed to load donation data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      
      const response = await fetch(`${baseUrl}/api/donasi`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          nama: formData.nama,
          jumlah_donasi: parseFloat(formData.jumlah_donasi),
          date: formData.date,
          note: formData.note || null,
          user_id: user?.id,
          donatur_id: user?.id || null
        })
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (response.status === 422 && responseData.errors) {
          const errorMessages = Object.entries(responseData.errors)
            .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
            .join('\n');
          throw new Error(errorMessages);
        }
        throw new Error(responseData.message || 'Failed to create donation');
      }

      setSuccess('Donation created successfully');
      setFormData(prev => ({
        ...prev,
        jumlah_donasi: '',
        note: ''
      }));
      await fetchMyDonations();
    } catch (error) {
      console.error('Error creating donation:', error);
      setError(error instanceof Error ? error.message : 'Failed to create donation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExport = async (format: 'csv' | 'pdf') => {
    try {
      const token = localStorage.getItem('token');
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      
      const response = await fetch(`${baseUrl}/api/donasi/export?format=${format}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to export data');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `donasi-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      setSuccess(`Data exported successfully as ${format.toUpperCase()}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to export data');
    }
  };

  const formatRupiah = (angka: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(angka);
  };

  const formatMonth = (monthNumber: number): string => {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return months[monthNumber - 1] || '';
  };

  const chartData = {
    labels: donasiStats.monthly_statistics?.map(stat => formatMonth(stat.month)) || [],
    datasets: [
      {
        label: 'Total Donasi per Bulan',
        data: donasiStats.monthly_statistics?.map(stat => stat.total) || [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Form Donasi */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Buat Donasi Baru</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Donatur
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiPlus className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                required
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm text-lg font-medium text-gray-900"
                placeholder="Masukkan nama donatur"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jumlah Donasi
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400 text-sm font-medium">Rp</span>
              </div>
              <input
                type="number"
                name="jumlah_donasi"
                value={formData.jumlah_donasi}
                onChange={handleChange}
                required
                min="0"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm text-lg font-medium text-gray-900"
                placeholder="Masukkan jumlah donasi"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Donasi
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm text-lg font-medium text-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catatan (Opsional)
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                <FiFileText className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                rows={3}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm text-lg font-medium text-gray-900"
                placeholder="Tambahkan catatan (opsional)"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {isLoading ? 'Memproses...' : 'Buat Donasi'}
          </button>
        </form>
      </div>

      {/* Statistik Donasi */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Statistik Donasi Saya</h2>
          <div className="flex space-x-2">
            <button 
              onClick={fetchMyDonations}
              className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <FiRefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <div className="relative">
              <select
                value={pagination.perPage}
                onChange={(e) => setPagination({...pagination, perPage: Number(e.target.value), page: 1})}
                className="block w-full pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
              >
                <option value="5">5 per halaman</option>
                <option value="10">10 per halaman</option>
                <option value="25">25 per halaman</option>
                <option value="50">50 per halaman</option>
              </select>
            </div>
          </div>
        </div>
        
        {lastUpdated && (
          <div className="text-sm text-gray-500 mb-4">
            Terakhir diperbarui: {new Date(lastUpdated).toLocaleString('id-ID')}
          </div>
        )}

        {/* Export Buttons */}
        <div className="flex justify-end mb-4 space-x-2">
          <button
            onClick={() => handleExport('csv')}
            className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <FiDownload className="mr-2 h-4 w-4" />
            Export CSV
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <FiDownload className="mr-2 h-4 w-4" />
            Export PDF
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-green-800">Total Donasi</h3>
              <div className="bg-green-200 p-2 rounded-lg">
                <FiDollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-green-700 mb-2">
              {formatRupiah(donasiStats.total_donasi)}
            </p>
            <p className="text-sm text-green-600">Total donasi yang telah Anda berikan</p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-blue-800">Jumlah Donasi</h3>
              <div className="bg-blue-200 p-2 rounded-lg">
                <FiClock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-blue-700 mb-2">
              {donasiStats.jumlah_donasi} kali
            </p>
            <p className="text-sm text-blue-600">Total donasi yang telah Anda lakukan</p>
          </div>
        </div>

        {/* Chart Visualization */}
        {donasiStats.monthly_statistics && donasiStats.monthly_statistics.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Visualisasi Donasi Bulanan</h3>
            <div className="bg-white p-4 rounded-lg shadow">
              <Bar 
                data={chartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return formatRupiah(context.raw as number);
                        }
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: function(value) {
                          return formatRupiah(value as number).replace('Rp', '').trim();
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* Monthly Statistics */}
        {donasiStats.monthly_statistics && donasiStats.monthly_statistics.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Statistik Bulanan</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {donasiStats.monthly_statistics.map((stat) => (
                <div key={stat.month} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-800">{formatMonth(stat.month)}</h4>
                  <div className="mt-2 flex justify-between">
                    <span className="text-sm text-gray-600">Total: {formatRupiah(stat.total)}</span>
                    <span className="text-sm text-gray-600">{stat.count} kali</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Riwayat Donasi */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Riwayat Donasi</h3>
          <div className="text-sm text-gray-500">
            Menampilkan {((pagination.page - 1) * pagination.perPage) + 1} -{' '}
            {Math.min(pagination.page * pagination.perPage, pagination.total)} dari {pagination.total} donasi
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jumlah
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catatan
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    </div>
                  </td>
                </tr>
              ) : donasiStats.riwayat_donasi && donasiStats.riwayat_donasi.length > 0 ? (
                donasiStats.riwayat_donasi.map((donasi) => (
                  <tr key={donasi.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(donasi.date).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {donasi.nama}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      {formatRupiah(donasi.jumlah_donasi)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {donasi.note || '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    Belum ada riwayat donasi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {donasiStats.riwayat_donasi && donasiStats.riwayat_donasi.length > 0 && (
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => setPagination({...pagination, page: Math.max(1, pagination.page - 1)})}
              disabled={pagination.page === 1}
              className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              <FiChevronLeft className="h-4 w-4 mr-1" />
              Sebelumnya
            </button>
            <div className="text-sm text-gray-700">
              Halaman {pagination.page} dari {Math.ceil(pagination.total / pagination.perPage)}
            </div>
            <button
              onClick={() => setPagination({...pagination, page: pagination.page + 1})}
              disabled={pagination.page * pagination.perPage >= pagination.total}
              className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Selanjutnya
              <FiChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Donasi;