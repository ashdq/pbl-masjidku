'use client';

import React, { useState, useEffect } from 'react';
import { CalendarDays, Download } from "lucide-react";
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Logout from '../../components/Logout';
import Overview from '../../components/overview/Overview';
import PengelolaanKegiatan from '../../components/kegiatan/Kegiatan';
import LaporanDonasi from '../../components/donasi/LaporanDonasi';
import Pengeluaran from '../../components/pengeluaran/Pengeluaran';
import LaporanAspirasi from '../../components/Aspirasi/LaporanAspirasi';
import Profile from '../../components/profile/profile';


export default function TakmirDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Overview");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Redirect ke login jika tidak ada user dan loading selesai
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // Tampilkan loading spinner yang lebih menarik
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  // Jika tidak ada user, jangan tampilkan apa-apa (akan di-redirect oleh useEffect)
  if (!user) {
    return null;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "Overview":
        return <Overview />;
      case "Laporan Donasi":
        return <LaporanDonasi />;
      case "Pengelolaan Kegiatan":
        return <PengelolaanKegiatan />;
      case "Laporan Keuangan":
        return <Pengeluaran />;
      case "Laporan Aspirasi":
        return <LaporanAspirasi />;
      case "Profile":
        return <Profile />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard Takmir</h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 bg-gray-100 text-gray-600 rounded-md transition hover:border-gray-400 w-full sm:w-auto justify-center">
            <CalendarDays className="w-4 h-4" />
            <span>{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </button>
          <Logout />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {["Overview", "Laporan Keuangan", "Laporan Donasi", "Laporan Aspirasi", "Pengelolaan Kegiatan", "Profile"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-lg transition whitespace-nowrap ${
              activeTab === tab
                ? "bg-green-600 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => handleTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
}