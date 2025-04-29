"use client";

import { useState } from "react";
import { CalendarDays, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Registrasi Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Variabel style
const primaryGreen = "bg-green-600";
const primaryGreenHover = "hover:bg-green-700";
const secondaryGray = "bg-gray-100";
const textPrimary = "text-gray-800";
const textSecondary = "text-gray-600";
const shadow = "shadow-md";
const rounded = "rounded-lg";
const transition = "transition ease-in-out duration-300";

// Data statis
const staticMonthlyZakatData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'],
  datasets: [
    {
      label: 'Total Zakat Bulanan',
      data: [1500000, 1800000, 1650000, 2000000, 1750000, 1900000, 1600000, 2100000, 1850000, 1950000, 1700000, 2200000],
      backgroundColor: 'rgba(75, 192, 192, 0.8)',
    },
  ],
};

const staticRecentPayments = [
  { name: "Kinata Dewa Ariandi", email: "ali@email.com", amount: 50000 },
  { name: "Raden", email: "@email.com", amount: 75000 },
  { name: "Diki", email: "a@email.com", amount: 30000 },
  { name: "Hanip", email: "a@email.com", amount: 100000 },
  { name: "Jantra", email: "a@email.com", amount: 60000 },
];

const staticMasjidInfo = {
  totalZakatBulanIni: 12500000,
  kegiatanMasjid: [
    { title: "Pengajian Rutin", image: "/kegiatan1.jpg" },
    { title: "Kajian Subuh", image: "/kegiatan2.jpg" },
    { title: "Bantuan Sosial", image: "/kegiatan3.jpg" },
    { title: "Tahsin Quran", image: "/kegiatan4.jpg" },
    { title: "Santunan Yatim", image: "/kegiatan5.jpg" },
  ],
  jadwalAdzan: {
    subuh: "04:30",
    dzuhur: "12:00",
    ashar: "15:30",
    maghrib: "18:00",
    isya: "19:15",
  },
};

// Opsi Chart
const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    title: { display: false },
  },
  scales: {
    y: { beginAtZero: true },
  },
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [currentSlide, setCurrentSlide] = useState(0);

  const totalSlides = staticMasjidInfo.kegiatanMasjid.length;

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className={`text-3xl font-bold ${textPrimary}`}>Dashboard</h1>
        <div className="flex items-center gap-3">
          <button className={`flex items-center gap-2 px-4 py-2 border border-gray-300 ${secondaryGray} ${textSecondary} rounded-md ${transition} hover:border-gray-400`}>
            <CalendarDays className="w-4 h-4" />
            <span>{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </button>
          <button className={`flex items-center gap-2 px-4 py-2 ${primaryGreen} text-white rounded-md ${shadow} ${transition} ${primaryGreenHover}`}>
            <Download className="w-4 h-4" />
            <span>Unduh Laporan</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-8">
        {["Overview", "Laporan Zakat", "Pengumuman"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 ${rounded} ${transition} ${
              activeTab === tab
                ? `${primaryGreen} text-white ${shadow}`
                : `${secondaryGray} ${textSecondary} hover:bg-gray-200`
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        
        {/* Grafik Zakat */}
        <div className="p-6 bg-gradient-to-br from-green-100 to-white rounded-lg shadow-lg md:col-span-2">
          <h2 className="text-xl font-bold text-green-700 mb-6 text-center">Grafik Zakat Bulanan</h2>
          <Bar data={staticMonthlyZakatData} options={chartOptions} />
        </div>

        {/* Pembayaran Terakhir */}
        <div className="p-6 bg-gradient-to-br from-green-100 to-white rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-green-700 mb-6 text-center">Pembayaran Zakat Terakhir</h2>
          <div className="space-y-4">
            {staticRecentPayments.map((payment, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-300 rounded-full flex items-center justify-center text-white font-bold">
                    {payment.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{payment.name}</p>
                    <p className="text-xs text-gray-500">{payment.email}</p>
                  </div>
                </div>
                <div className="text-sm font-bold text-green-800">Rp {payment.amount.toLocaleString('id-ID')}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Menu Bawah */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
  {/* Total Zakat */}
  <div className="bg-white border border-gray-200 rounded-md shadow-sm p-5 flex flex-col items-center justify-center">
    <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Zakat</h2>
    <p className="text-2xl font-bold text-green-600">
      Rp {staticMasjidInfo.totalZakatBulanIni.toLocaleString('id-ID')}
    </p>
    <p className="text-sm text-gray-500 mt-1">Bulan Ini</p>
  </div>

  {/* Carousel Kegiatan */}
  <div className="bg-white border border-gray-200 rounded-md shadow-sm p-5">
    <h2 className="text-lg font-semibold text-gray-700 text-center mb-3">Kegiatan</h2>
    <div className="relative rounded-md overflow-hidden">
      <img
        src={staticMasjidInfo.kegiatanMasjid[currentSlide].image}
        alt={staticMasjidInfo.kegiatanMasjid[currentSlide].title}
        className="w-full h-60 object-cover transition-opacity duration-300"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-3">
        <p className="text-sm font-medium">{staticMasjidInfo.kegiatanMasjid[currentSlide].title}</p>
      </div>
      {/* Tombol Carousel Minimalis */}
      <button
        onClick={handlePrev}
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-100 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-200 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={handleNext}
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-100 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-200 transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
    {/* Indicator Minimalis */}
    <div className="flex justify-center mt-3 space-x-1">
      {staticMasjidInfo.kegiatanMasjid.map((_, index) => (
        <button
          key={index}
          className={`w-2 h-2 rounded-full ${
            currentSlide === index ? 'bg-green-500' : 'bg-gray-300'
          } transition-colors duration-300`}
          onClick={() => setCurrentSlide(index)}
        ></button>
      ))}
    </div>
  </div>

  {/* Jadwal Adzan */}
  <div className="bg-white border border-gray-200 rounded-md shadow-sm p-5">
    <h2 className="text-lg font-semibold text-gray-700 text-center mb-3">Jadwal Adzan</h2>
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-gray-800">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="py-2 px-3 text-left rounded-tl-md">Waktu</th>
            <th className="py-2 px-3 text-left rounded-tr-md">Jam</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b"><td className="py-1 px-3">Subuh</td><td className="py-1 px-3">{staticMasjidInfo.jadwalAdzan.subuh}</td></tr>
          <tr className="border-b"><td className="py-1 px-3">Dzuhur</td><td className="py-1 px-3">{staticMasjidInfo.jadwalAdzan.dzuhur}</td></tr>
          <tr className="border-b"><td className="py-1 px-3">Ashar</td><td className="py-1 px-3">{staticMasjidInfo.jadwalAdzan.ashar}</td></tr>
          <tr className="border-b"><td className="py-1 px-3">Maghrib</td><td className="py-1 px-3">{staticMasjidInfo.jadwalAdzan.maghrib}</td></tr>
          <tr><td className="py-1 px-3 rounded-bl-md">Isya</td><td className="py-1 px-3 rounded-br-md">{staticMasjidInfo.jadwalAdzan.isya}</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</div>

    </div>
  );
}
