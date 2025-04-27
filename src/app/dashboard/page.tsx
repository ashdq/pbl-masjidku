"use client";

import { useState } from "react";
import { CalendarDays, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const primaryGreen = "bg-green-600";
const primaryGreenHover = "hover:bg-green-700";
const secondaryGray = "bg-gray-100";
const textPrimary = "text-gray-800";
const textSecondary = "text-gray-600";
const shadow = "shadow-md";
const rounded = "rounded-lg";
const transition = "transition ease-in-out duration-300";

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

const chartOptions = {
    responsive: true,
    plugins: {
        legend: {
            display: false,
        },
        title: {
            display: false,
            text: 'Total Zakat Bulanan',
        },
    },
    scales: {
        y: {
            beginAtZero: true,
        },
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

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-gradient-to-br from-green-100 to-white rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold text-center text-green-700 mb-6">Total Zakat Bulan Ini</h2>
            <h2 className="text-2xl font-bold text-green-700">
                Rp {staticMasjidInfo.totalZakatBulanIni.toLocaleString('id-ID')}
            </h2>
            </div>


                {/* Kegiatan Masjid Carousel */}
            <div className="p-6 bg-gradient-to-br from-green-100 to-white rounded-lg shadow-lg mb-8">
                <h2 className="text-xl font-bold text-green-700 text-center mb-6">Kegiatan</h2>

            <div className="relative">
            <div className="overflow-hidden rounded-lg">
            <div className="relative w-full">
                <img
                    src={staticMasjidInfo.kegiatanMasjid[currentSlide].image}
                    alt={staticMasjidInfo.kegiatanMasjid[currentSlide].title}
                    className="w-full h-[300px] object-cover rounded-lg transition-all duration-500"
                />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 rounded-b-lg">
                <p className="text-white text-lg font-semibold">
                    {staticMasjidInfo.kegiatanMasjid[currentSlide].title}
                </p>
                </div>
            </div>
    </div>

        {/* Tombol Kiri */}
        <div className="absolute top-1/2 left-3 transform -translate-y-1/2">
            <button onClick={handlePrev} className="bg-white text-green-700 p-2 rounded-full shadow hover:bg-green-100 transition">
                <ChevronLeft className="w-5 h-5" />
            </button>
        </div>

            {/* Tombol Kanan */}
            <div className="absolute top-1/2 right-3 transform -translate-y-1/2">
                <button onClick={handleNext} className="bg-white text-green-700 p-2 rounded-full shadow hover:bg-blgreenue-100 transition">
                <ChevronRight className="w-5 h-5" />
                </button>
            </div>

                {/* Indicator */}
                <div className="flex justify-center mt-4 space-x-2">
                    {staticMasjidInfo.kegiatanMasjid.map((_, index) => (
                <button
                key={index}
                className={`w-3 h-3 rounded-full ${currentSlide === index ? 'bg-green-500' : 'bg-gray-300'}`}
                onClick={() => setCurrentSlide(index)}
                ></button>
                ))}   
                </div>
            </div>
        </div>


        <div className="p-6 bg-gradient-to-br from-green-100 to-white rounded-lg shadow-lg">
  <h2 className="text-xl font-bold text-center text-green-700 mb-6">Jadwal Adzan</h2>

        <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-800">
            <thead>
            <tr className="bg-green-200 text-green-800">
                <th className="py-2 px-4 text-left rounded-tl-lg">Waktu</th>
                <th className="py-2 px-4 text-left rounded-tr-lg">Jam</th>
            </tr>
            </thead>
            <tbody>
            <tr className="border-b">
                <td className="py-2 px-4">Subuh</td>
                <td className="py-2 px-4">{staticMasjidInfo.jadwalAdzan?.subuh}</td>
            </tr>
            <tr className="border-b">
                <td className="py-2 px-4">Dzuhur</td>
                <td className="py-2 px-4">{staticMasjidInfo.jadwalAdzan?.dzuhur}</td>
            </tr>
            <tr className="border-b">
                <td className="py-2 px-4">Ashar</td>
                <td className="py-2 px-4">{staticMasjidInfo.jadwalAdzan?.ashar}</td>
            </tr>
            <tr className="border-b">
                <td className="py-2 px-4">Maghrib</td>
                <td className="py-2 px-4">{staticMasjidInfo.jadwalAdzan?.maghrib}</td>
            </tr>
            <tr>
                <td className="py-2 px-4">Isya</td>
                <td className="py-2 px-4">{staticMasjidInfo.jadwalAdzan?.isya}</td>
            </tr>
            </tbody>
            </table>
            </div>
        </div>
    </div>

            {/* Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  
            {/* Grafik Zakat Bulanan */}
            <div className="p-6 bg-gradient-to-br from-green-100 to-white rounded-lg shadow-lg md:col-span-2">
                <h2 className="text-xl font-bold text-green-700 mb-6 text-center">Grafik Zakat Bulanan</h2>
                    <Bar data={staticMonthlyZakatData} options={chartOptions} />
            </div>

            {/* Pembayaran Zakat Terakhir */}
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
        </div>
    );
}