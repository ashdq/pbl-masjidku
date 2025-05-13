'use client';

import React, { useState, useEffect } from 'react';
import { FiDownload, FiSearch, FiFilter } from 'react-icons/fi';
import { useRef } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


interface Donasi {
  id: number;
  nama: string;
  jumlah_donasi: number;
  date: string;
  note: string | null;
  donatur: {
    id: number;
    name: string;
    email: string;
  };
}

interface DonasiStats {
  total_donasi: number;
  jumlah_donasi: number;
  donations: Donasi[];
}

const LaporanDonasi = () => {
  const [donasiStats, setDonasiStats] = useState<DonasiStats>({
    total_donasi: 0,
    jumlah_donasi: 0,
    donations: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });


  useEffect(() => {
    fetchAllDonations();
  }, []);

  const fetchAllDonations = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/donasi`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Gagal memuat data donasi');
      }

      const responseData = await response.json();
      
      if (responseData.status === 'success' && responseData.data) {
        const donations = responseData.data;
        const totalDonasi = donations.reduce((total: number, donasi: Donasi) => {
          const jumlah = typeof donasi.jumlah_donasi === 'string' 
            ? parseFloat(donasi.jumlah_donasi) 
            : donasi.jumlah_donasi;
          return total + (isNaN(jumlah) ? 0 : jumlah);
        }, 0);
        
        const jumlahDonasi = donations.length;

        setDonasiStats({
          total_donasi: totalDonasi,
          jumlah_donasi: jumlahDonasi,
          donations: donations
        });
      } else {
        throw new Error('Format data tidak valid');
      }
    } catch (error) {
      console.error('Error fetching donations:', error);
      setError('Gagal memuat data donasi');
    } finally {
      setIsLoading(false);
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

  const filteredDonations = donasiStats.donations.filter(donasi => {
    const matchesSearch = 
      donasi.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donasi.donatur.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donasi.donatur.email.toLowerCase().includes(searchTerm.toLowerCase());

    const donationDate = new Date(donasi.date);
    const matchesDateFilter = 
      (!dateFilter.startDate || donationDate >= new Date(dateFilter.startDate)) &&
      (!dateFilter.endDate || donationDate <= new Date(dateFilter.endDate));

    return matchesSearch && matchesDateFilter;
  });

  const handleExport = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Laporan Donasi', 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [['Tanggal', 'Nama Donatur', 'Email', 'Jumlah', 'Catatan']],
      body: filteredDonations.map((donasi) => [
        new Date(donasi.date).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
        donasi.donatur.name,
        donasi.donatur.email,
        formatRupiah(donasi.jumlah_donasi),
        donasi.note || '-',
      ]),
      styles: {
        fontSize: 10,
      },
      headStyles: {
        fillColor: [22, 163, 74], // hijau tailwind
      },
    });

    doc.save('laporan-donasi.pdf');
  };




  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div id="laporan-pdf" className="space-y-6">
      {/* Header dan Statistik */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-xl font-semibold text-gray-900">Laporan Donasi</h2>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <FiDownload className="w-5 h-5" />
            <span>Unduh Laporan</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
            <h3 className="text-lg font-medium text-green-800 mb-2">Total Donasi</h3>
            <p className="text-3xl font-bold text-green-700">
              {formatRupiah(donasiStats.total_donasi)}
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
            <h3 className="text-lg font-medium text-blue-800 mb-2">Jumlah Donasi</h3>
            <p className="text-3xl font-bold text-blue-700">
              {donasiStats.jumlah_donasi} kali
            </p>
          </div>
        </div>

        {/* Filter dan Pencarian */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Cari nama atau email donatur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiFilter className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              value={dateFilter.startDate}
              onChange={(e) => setDateFilter(prev => ({ ...prev, startDate: e.target.value }))}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiFilter className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              value={dateFilter.endDate}
              onChange={(e) => setDateFilter(prev => ({ ...prev, endDate: e.target.value }))}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        {/* Tabel Donasi */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Donatur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
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
              {filteredDonations.map((donasi) => (
                <tr key={donasi.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(donasi.date).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {donasi.donatur.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {donasi.donatur.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    {formatRupiah(donasi.jumlah_donasi)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {donasi.note || '-'}
                  </td>
                </tr>
              ))}
              {filteredDonations.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    {searchTerm || dateFilter.startDate || dateFilter.endDate
                      ? 'Tidak ada donasi yang sesuai dengan filter'
                      : 'Belum ada data donasi'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LaporanDonasi; 