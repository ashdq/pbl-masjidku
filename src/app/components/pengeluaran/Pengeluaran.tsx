'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { FiRefreshCw, FiTrash2, FiPlus } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { CalendarDays, Download } from "lucide-react";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface KeuanganMasjid {
  saldo: number;
  last_updated: string;
}

interface PengeluaranItem {
  id: number;
  keperluan: string;
  jumlah_pengeluaran: number;
  tanggal: string;
  deskripsi: string;
  user_id: number;
  nota?: string;
  user?: {
    name: string;
  };
}

const Pengeluaran: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [keuangan, setKeuangan] = useState<KeuanganMasjid | null>(null);
  const [pengeluaran, setPengeluaran] = useState<PengeluaranItem[]>([]);
  const [totalDonasi, setTotalDonasi] = useState<number>(0);
  const [totalPengeluaran, setTotalPengeluaran] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showTambahForm, setShowTambahForm] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const canManagePengeluaran = user?.roles?.includes('admin') || user?.roles?.includes('takmir');

  const fetchData = async () => {
    try {
      setError(null);
      setIsRefreshing(true);
      
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token autentikasi tidak ditemukan');

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      };

      const [keuanganRes, donasiRes, pengeluaranRes, pengeluaranTotalRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/keuangan`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/donasi-total`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pengeluaran`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pengeluaran-total`, { headers })
      ]);

      if (!keuanganRes.ok) throw new Error('Gagal memuat data keuangan');
      if (!donasiRes.ok) throw new Error('Gagal memuat total donasi');
      if (!pengeluaranRes.ok) throw new Error('Gagal memuat data pengeluaran');
      if (!pengeluaranTotalRes.ok) throw new Error('Gagal memuat total pengeluaran');

      const keuanganData = await keuanganRes.json();
      const donasiData = await donasiRes.json();
      const pengeluaranData = await pengeluaranRes.json();
      const pengeluaranTotalData = await pengeluaranTotalRes.json();

      // Pastikan saldo tidak null
      const saldo = keuanganData.data?.saldo ?? 0;
      
      setKeuangan({
        saldo: saldo,
        last_updated: keuanganData.data?.last_updated || new Date().toISOString()
      });
      setTotalDonasi(donasiData.total_donasi || 0);
      setTotalPengeluaran(pengeluaranTotalData.total_pengeluaran || 0);
      setPengeluaran(pengeluaranData.data || []);
    } catch (error: any) {
      console.error("Error:", error);
      setError(error.message || 'Terjadi kesalahan saat memuat data');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (canManagePengeluaran) fetchData();
  }, [canManagePengeluaran]);

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pengeluaran ini?')) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token autentikasi tidak ditemukan');

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pengeluaran/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menghapus pengeluaran');
      }

      // Update local state without refetching all data
      const deletedItem = pengeluaran.find(item => item.id === id);
      if (deletedItem) {
        setPengeluaran(prev => prev.filter(item => item.id !== id));
        setTotalPengeluaran(prev => prev - deletedItem.jumlah_pengeluaran);
        
        // Update keuangan saldo (add back the deleted amount)
        if (keuangan) {
          setKeuangan({
            ...keuangan,
            saldo: keuangan.saldo + deletedItem.jumlah_pengeluaran,
            last_updated: new Date().toISOString()
          });
        }
      }
    } catch (error: any) {
      setError(error.message || 'Terjadi kesalahan saat menghapus pengeluaran');
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const formatDateTime = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    doc.text('Laporan Pengeluaran Masjid', 14, 15);
    doc.setFontSize(10);
    doc.text(`Tanggal: ${new Date().toLocaleDateString('id-ID')}`, 14, 22);

    autoTable(doc, {
      startY: 30,
      head: [['No', 'Keperluan', 'Jumlah', 'Tanggal', 'Deskripsi', 'Nota', 'Dibuat Oleh']],
      body: pengeluaran.map((item, index) => [
        index + 1,
        item.keperluan,
        `Rp ${item.jumlah_pengeluaran.toLocaleString('id-ID')}`,
        formatDate(item.tanggal),
        item.deskripsi,
        item.nota ? 'Ada' : 'Tidak ada',
        item.user?.name || 'Tidak diketahui'
      ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [34, 197, 94] }, // warna hijau
    });

    doc.save('laporan_pengeluaran.pdf');
  };

  // Handler untuk submit form tambah pengeluaran
  const handleTambahPengeluaran = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    const form = e.currentTarget;
    const keperluan = (form.keperluan as HTMLInputElement).value.trim();
    const jumlah_pengeluaran = (form.jumlah_pengeluaran as HTMLInputElement).value.trim();
    const tanggal = (form.tanggal as HTMLInputElement).value.trim();

    // Validasi frontend
    if (!keperluan || !jumlah_pengeluaran || !tanggal) {
      setFormError("Semua field wajib diisi.");
      return;
    }

    const formData = new FormData(form);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token autentikasi tidak ditemukan');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pengeluaran`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menambah pengeluaran');
      }
      setShowTambahForm(false);
      setFormError(null);
      fetchData();
      form.reset();
    } catch (error: any) {
      setFormError(error.message || 'Terjadi kesalahan saat menambah pengeluaran');
    }
  };

  if (!canManagePengeluaran) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <p className="text-gray-600">Anda tidak memiliki akses untuk mengelola pengeluaran</p>
      </div>
    );
  }

  if (loading && !isRefreshing) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
            <button 
              onClick={fetchData}
              className="mt-2 text-sm text-red-500 hover:text-red-700 font-medium"
            >
              Coba lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Ringkasan Keuangan Masjid</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowTambahForm((prev) => !prev)}
              className="flex items-center px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
            >
              <FiPlus className="mr-1" /> Tambah Pengeluaran
            </button>
            <button
              onClick={fetchData}
              disabled={isRefreshing}
              className={`flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm ${isRefreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <FiRefreshCw className={`mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-green-800">Total Donasi</h3>
            <p className="text-2xl font-semibold text-green-600">
              Rp {totalDonasi.toLocaleString('id-ID')}
            </p>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-red-800">Total Pengeluaran</h3>
            <p className="text-2xl font-semibold text-red-600">
              Rp {totalPengeluaran.toLocaleString('id-ID')}
            </p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800">Saldo Masjid</h3>
            <p className="text-2xl font-semibold text-blue-600">
              Rp {keuangan?.saldo.toLocaleString('id-ID') || 0}
            </p>
            {keuangan?.last_updated && (
              <p className="text-xs text-gray-500 mt-1">
                Terakhir diperbarui: {formatDateTime(keuangan.last_updated)}
              </p>
            )}
          </div>
        </div>
      </div>
      {/* Tambah Pengeluaran Form */}
      {showTambahForm && (
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 max-w-2xl mx-auto mt-2">
          <h3 className="text-2xl font-bold mb-6 text-green-700 flex items-center gap-2">
            <FiPlus className="text-green-600" /> Tambah Pengeluaran
          </h3>
          {formError && (
            <div className="mb-4 px-4 py-3 rounded bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" />
              </svg>
              {formError}
            </div>
          )}
          <form onSubmit={handleTambahPengeluaran} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Keperluan <span className="text-red-500">*</span></label>
              <input
                name="keperluan"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-700 transition"
                placeholder="Contoh: Pembelian karpet"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Jumlah Pengeluaran <span className="text-red-500">*</span></label>
              <input
                name="jumlah_pengeluaran"
                type="number"
                min={1}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-700 transition"
                placeholder="Contoh: 500000"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tanggal <span className="text-red-500">*</span></label>
              <input
                name="tanggal"
                type="date"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-700 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi</label>
              <textarea
                name="deskripsi"
                rows={2}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-700 transition"
                placeholder="Keterangan tambahan (opsional)"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nota <span className="text-gray-400">(opsional)</span>
              </label>
              <input
              name="nota"
              type="file"
              accept="image/*,application/pdf"
              className="w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-green-50 file:text-green-700 hover:file:bg-green-100 transition"
              aria-label="Unggah nota (opsional)"
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) {
                const allowedTypes = [
                  "image/jpeg",
                  "image/png",
                  "image/jpg",
                  "application/pdf"
                ];
                if (!allowedTypes.includes(file.type)) {
                  alert("File harus berupa gambar (JPG/PNG) atau PDF.");
                  e.target.value = "";
                } else if (file.size > 2 * 1024 * 1024) {
                  alert("Ukuran file maksimal 2MB.");
                  e.target.value = "";
                }
                }
              }}
              />
              <p className="text-xs text-gray-500 mt-1">
              Format: JPG, PNG, atau PDF. Maksimal 2MB.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition"
              >
                Simpan
              </button>
              <button
                type="button"
                onClick={() => { setShowTambahForm(false); setFormError(null); }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-6 py-2 rounded-lg transition"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">  
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Daftar Pengeluaran</h2>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md shadow-md transition hover:bg-green-700 mb-6"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Laporan</span>
            </button>
            </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keperluan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nota</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dibuat Oleh</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pengeluaran.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    Tidak ada data pengeluaran
                  </td>
                </tr>
              ) : (
                pengeluaran.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{idx + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{item.keperluan}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      Rp {item.jumlah_pengeluaran.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {formatDate(item.tanggal)}
                    </td>
                    <td className="px-6 py-4 text-gray-900 max-w-xs">
                      <div className="line-clamp-2">{item.deskripsi}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.nota ? (
                        <img
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${item.nota}`}
                          alt="Nota"
                          className="h-12 w-auto rounded shadow object-contain cursor-pointer"
                          onClick={() => window.open(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${item.nota}`, '_blank')}
                        />
                      ) : (
                        <span className="text-gray-400">Tidak ada</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {item.user?.name || `User ID: ${item.user_id}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900 flex items-center"
                        title="Hapus"
                      >
                        <FiTrash2 className="mr-1" /> Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Pengeluaran;