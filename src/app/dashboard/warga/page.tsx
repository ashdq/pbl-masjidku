'use client';

import React, { useState, useEffect } from 'react';
import { CalendarDays } from "lucide-react";
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Logout from '../../components/Logout';
import Overview from '../../components/overview/Overview';
import Donasi from '../../components/donasi/Donasi';
import Galeri from '../../components/Galeri/Galeri';
import Aspirasi from '../../components/Aspirasi/Aspirasi';
import Artikel from '../../components/Artikel/ArtikelMenu';

export default function WargaDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Overview");

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">LOADINGG BOSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSs</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "Overview":
        return <Overview />;
      case "Donasi":
        return <Donasi />;
      case "Galeri":
        return <Galeri />;
      case "Aspirasi":
        return <Aspirasi />;
      case "Artikel":
        return <Artikel />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard Warga</h1>
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
        {["Overview", "Donasi", "Galeri", "Aspirasi", "Artikel"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-lg transition whitespace-nowrap ${
              activeTab === tab
                ? "bg-green-600 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab(tab)}
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
