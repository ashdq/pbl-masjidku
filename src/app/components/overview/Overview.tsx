'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Registrasi Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Type definitions
type Payment = {
  name: string;
  email: string;
  amount: number;
};

type Kegiatan = {
  title: string;
  image: string;
};

type JadwalAdzan = {
  subuh: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
};

type MasjidInfo = {
  totalZakatBulanIni: number;
  kegiatanMasjid: Kegiatan[];
  jadwalAdzan: JadwalAdzan;
};

// Komponen kecil untuk PaymentItem
const PaymentItem = ({ payment }: { payment: Payment }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-green-300 rounded-full flex items-center justify-center text-white font-bold">
        {payment.name.charAt(0)}
      </div>
      <div>
        <p className="font-semibold text-gray-800">{payment.name}</p>
        <p className="text-xs text-gray-500">{payment.email}</p>
      </div>
    </div>
    <div className="text-sm font-bold text-green-800">
      Rp {payment.amount.toLocaleString('id-ID')}
    </div>
  </div>
);

// Komponen kecil untuk JadwalAdzanTable
const JadwalAdzanTable = ({ jadwal }: { jadwal: JadwalAdzan }) => (
  <table className="w-full text-sm text-gray-800">
    <thead>
      <tr className="bg-gray-100 text-gray-700">
        <th className="py-2 px-3 text-left rounded-tl-md">Waktu</th>
        <th className="py-2 px-3 text-left rounded-tr-md">Jam</th>
      </tr>
    </thead>
    <tbody>
      <tr className="border-b"><td className="py-1 px-3">Subuh</td><td className="py-1 px-3">{jadwal.subuh}</td></tr>
      <tr className="border-b"><td className="py-1 px-3">Dzuhur</td><td className="py-1 px-3">{jadwal.dzuhur}</td></tr>
      <tr className="border-b"><td className="py-1 px-3">Ashar</td><td className="py-1 px-3">{jadwal.ashar}</td></tr>
      <tr className="border-b"><td className="py-1 px-3">Maghrib</td><td className="py-1 px-3">{jadwal.maghrib}</td></tr>
      <tr><td className="py-1 px-3 rounded-bl-md">Isya</td><td className="py-1 px-3 rounded-br-md">{jadwal.isya}</td></tr>
    </tbody>
  </table>
);

const Overview = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Data statis yang dipindahkan ke useMemo untuk optimasi
  const staticData = useMemo(() => ({
    monthlyZakatData: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'],
      datasets: [{
        label: 'Total Donasi Bulanan',
        data: [1500000, 1800000, 1650000, 2000000, 1750000, 1900000, 1600000, 2100000, 1850000, 1950000, 1700000, 2200000],
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
      }],
    },
    recentPayments: [
      { name: "Kinata Dewa Ariandi", email: "ali@email.com", amount: 50000 },
      { name: "Raden", email: "@email.com", amount: 75000 },
      { name: "Diki", email: "a@email.com", amount: 30000 },
      { name: "Hanip", email: "a@email.com", amount: 100000 },
      { name: "Jantra", email: "a@email.com", amount: 60000 },
    ] as Payment[],
    masjidInfo: {
      totalZakatBulanIni: 12500000,
      kegiatanMasjid: [
        { title: "Pengajian Rutin", image: "/kegiatan1.jpg" },
        { title: "Kajian Subuh", image: "/kegiatan2.jpg" },
        { title: "Bantuan Sosial", image: "/kegiatan3.jpg" },
        { title: "Tahsin Quran", image: "/kegiatan4.jpg" },
        { title: "Santunan Yatim", image: "/kegiatan5.jpg" },
      ] as Kegiatan[],
      jadwalAdzan: {
        subuh: "04:30",
        dzuhur: "12:00",
        ashar: "15:30",
        maghrib: "18:00",
        isya: "19:15",
      } as JadwalAdzan,
    } as MasjidInfo,
  }), []);

  // Opsi Chart
  const chartOptions = useMemo(() => ({
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  }), []);

  // Event handlers dengan useCallback
  const handleNext = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % staticData.masjidInfo.kegiatanMasjid.length);
  }, [staticData.masjidInfo.kegiatanMasjid.length]);

  const handlePrev = useCallback(() => {
    setCurrentSlide(prev => (prev - 1 + staticData.masjidInfo.kegiatanMasjid.length) % 
      staticData.masjidInfo.kegiatanMasjid.length);
  }, [staticData.masjidInfo.kegiatanMasjid.length]);

  return (
    <div className="space-y-6">
      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Grafik Zakat */}
        <div className="p-4 md:p-6 bg-gradient-to-br from-green-50 to-white rounded-lg shadow-lg md:col-span-2">
          <h2 className="text-xl font-bold text-green-700 mb-4 text-center">Grafik Donasi Bulanan</h2>
          <div className="h-64 md:h-80">
            <Bar 
              data={staticData.monthlyZakatData} 
              options={chartOptions} 
              height="100%"
            />
          </div>
        </div>

        {/* Pembayaran Terakhir */}
        <div className="p-4 md:p-6 bg-gradient-to-br from-green-50 to-white rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-green-700 mb-4 text-center">Riwayat Donasi Terakhir</h2>
          <div className="space-y-3">
            {staticData.recentPayments.map((payment, idx) => (
              <PaymentItem key={idx} payment={payment} />
            ))}
          </div>
        </div>
      </div>

      {/* Menu Bawah */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Zakat */}
        <div className="bg-white border border-gray-200 rounded-md shadow-sm p-4 flex flex-col items-center justify-center">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Donasi</h2>
          <p className="text-2xl font-bold text-green-600">
            Rp {staticData.masjidInfo.totalZakatBulanIni.toLocaleString('id-ID')}
          </p>
          <p className="text-sm text-gray-500 mt-1">Bulan Ini</p>
        </div>

        {/* Carousel Kegiatan */}
        <div className="bg-white border border-gray-200 rounded-md shadow-sm p-4">
          <h2 className="text-lg font-semibold text-gray-700 text-center mb-3">Kegiatan</h2>
          <div className="relative rounded-md overflow-hidden">
            <div className="w-full h-48 md:h-60 bg-gray-200 flex items-center justify-center">
              <img
                src={staticData.masjidInfo.kegiatanMasjid[currentSlide].image}
                alt={staticData.masjidInfo.kegiatanMasjid[currentSlide].title}
                className="w-full h-full object-cover transition-opacity duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                }}
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2">
              <p className="text-sm font-medium">{staticData.masjidInfo.kegiatanMasjid[currentSlide].title}</p>
            </div>
            <button
              onClick={handlePrev}
              className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/80 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center hover:bg-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/80 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center hover:bg-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex justify-center mt-2 space-x-1">
            {staticData.masjidInfo.kegiatanMasjid.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full ${
                  currentSlide === index ? 'bg-green-500' : 'bg-gray-300'
                } transition-colors duration-300`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Jadwal Adzan */}
        <div className="bg-white border border-gray-200 rounded-md shadow-sm p-4">
          <h2 className="text-lg font-semibold text-gray-700 text-center mb-3">Jadwal Adzan</h2>
          <div className="overflow-x-auto">
            <JadwalAdzanTable jadwal={staticData.masjidInfo.jadwalAdzan} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview; 