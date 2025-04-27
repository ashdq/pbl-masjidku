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
                <div className={`p-5 ${secondaryGray} ${rounded} ${shadow}`}>
                    <p className={`text-sm ${textSecondary}`}>Total Zakat Bulan Ini</p>
                    <h2 className={`text-2xl font-bold ${textPrimary}`}>Rp {staticMasjidInfo.totalZakatBulanIni.toLocaleString('id-ID')}</h2>
                </div>

                {/* Kegiatan Masjid Carousel */}
                <div className={`p-5 ${secondaryGray} ${rounded} ${shadow}`}>
                    <div className="relative mt-4">
                    <div className="overflow-hidden rounded-md">
                    <div className="relative w-full">
                        <img
                            src={staticMasjidInfo.kegiatanMasjid[currentSlide].image}
                            alt={staticMasjidInfo.kegiatanMasjid[currentSlide].title}
                            className="w-full h-64 object-cover rounded-md transition-all duration-500"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 rounded-b-md">
                                <p className="text-white text-lg font-semibold">
                                    {staticMasjidInfo.kegiatanMasjid[currentSlide].title}
                                </p>
                            </div>
                        </div>
                    </div>

                        <div className="absolute top-1/2 left-2 transform -translate-y-1/2">
                            <button onClick={handlePrev} className="bg-gray-300 text-gray-700 p-2 rounded-full hover:bg-gray-400 transition-colors">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="absolute top-1/2 right-2 transform -translate-y-1/2">
                            <button onClick={handleNext} className="bg-gray-300 text-gray-700 p-2 rounded-full hover:bg-gray-400 transition-colors">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex justify-center mt-3 space-x-2">
                            {staticMasjidInfo.kegiatanMasjid.map((_, index) => (
                                <button
                                    key={index}
                                    className={`w-3 h-3 rounded-full ${currentSlide === index ? primaryGreen : 'bg-gray-300'}`}
                                    onClick={() => setCurrentSlide(index)}
                                ></button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={`p-5 ${secondaryGray} ${rounded} ${shadow}`}>
                    <p className={`text-sm ${textSecondary}`}>Jadwal Adzan</p>
                    <div className="grid grid-cols-2 gap-2">
                        <p className={`text-sm ${textPrimary}`}>Subuh:</p><p className={`text-sm ${textSecondary}`}>{staticMasjidInfo.jadwalAdzan?.subuh}</p>
                        <p className={`text-sm ${textPrimary}`}>Dzuhur:</p><p className={`text-sm ${textSecondary}`}>{staticMasjidInfo.jadwalAdzan?.dzuhur}</p>
                        <p className={`text-sm ${textPrimary}`}>Ashar:</p><p className={`text-sm ${textSecondary}`}>{staticMasjidInfo.jadwalAdzan?.ashar}</p>
                        <p className={`text-sm ${textPrimary}`}>Maghrib:</p><p className={`text-sm ${textSecondary}`}>{staticMasjidInfo.jadwalAdzan?.maghrib}</p>
                        <p className={`text-sm ${textPrimary}`}>Isya:</p><p className={`text-sm ${textSecondary}`}>{staticMasjidInfo.jadwalAdzan?.isya}</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className={`p-6 ${secondaryGray} ${rounded} ${shadow} md:col-span-2`}>
                    <h2 className={`text-lg font-bold mb-4 ${textPrimary}`}>Grafik Zakat Bulanan</h2>
                    <Bar data={staticMonthlyZakatData} options={chartOptions} />
                </div>

                <div className={`p-6 ${secondaryGray} ${rounded} ${shadow}`}>
                    <h2 className={`text-lg font-bold mb-4 ${textPrimary}`}>Pembayaran Zakat Terakhir</h2>
                    <div className="space-y-4">
                        {staticRecentPayments.map((payment, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gray-300 rounded-full" />
                                    <div>
                                        <p className={`font-semibold ${textPrimary}`}>{payment.name}</p>
                                        <p className={`text-xs ${textSecondary}`}>{payment.email}</p>
                                    </div>
                                </div>
                                <div className={`text-sm font-semibold ${textPrimary}`}>Rp {payment.amount.toLocaleString('id-ID')}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}