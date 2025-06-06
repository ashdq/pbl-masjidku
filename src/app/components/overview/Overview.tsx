'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useAuth } from '@/app/context/AuthContext';

// Registrasi Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Type definitions
type Payment = {
  name: string;
  email: string;
  amount: number;
};

type Kegiatan = {
  id?: number;
  nama_kegiatan: string;
  tanggal_kegiatan: string;
  waktu_kegiatan: string;
  gambar_kegiatan?: string;
};

type JadwalAdzan = {
  subuh: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
};

type Kota = {
  nama: string;
  latitude: number;
  longitude: number;
};

type MasjidInfo = {
  totalZakatBulanIni: number;
};

const DAFTAR_KOTA: Kota[] = [
  { nama: 'Jakarta', latitude: -6.2088, longitude: 106.8456 },
  { nama: 'Bandung', latitude: -6.9175, longitude: 107.6191 },
  { nama: 'Surabaya', latitude: -7.2575, longitude: 112.7521 },
  { nama: 'Medan', latitude: 3.5952, longitude: 98.6722 },
  { nama: 'Semarang', latitude: -6.9932, longitude: 110.4229 },
  { nama: 'Yogyakarta', latitude: -7.7956, longitude: 110.3695 },
  { nama: 'Palembang', latitude: -2.9909, longitude: 104.7565 },
  { nama: 'Makassar', latitude: -5.1477, longitude: 119.4327 },
  { nama: 'Denpasar', latitude: -8.6705, longitude: 115.2126 },
  { nama: 'Malang', latitude: -7.9839, longitude: 112.6214 },
];

// Komponen kecil untuk PaymentItem
const PaymentItem = ({ payment }: { payment: Payment }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-green-300 rounded-full flex items-center justify-center text-white font-bold">
        {payment.name.charAt(0)}
      </div>
      <div>
        <p className="font-semibold text-gray-800">{payment.name}</p>
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
  const [kegiatan, setKegiatan] = useState<Kegiatan[]>([]);
  const [isLoadingKegiatan, setIsLoadingKegiatan] = useState(false);
  const [totalDonasiBulanIni, setTotalDonasiBulanIni] = useState(0);
  const [isLoadingDonasi, setIsLoadingDonasi] = useState(false);
  const [recentDonations, setRecentDonations] = useState<Payment[]>([]);
  const [isLoadingRecentDonations, setIsLoadingRecentDonations] = useState(false);
  const [monthlyDonationData, setMonthlyDonationData] = useState<number[]>([]);
  const [isLoadingChart, setIsLoadingChart] = useState(false);
  const [jadwalAdzan, setJadwalAdzan] = useState<JadwalAdzan>({
    subuh: '--:--',
    dzuhur: '--:--',
    ashar: '--:--',
    maghrib: '--:--',
    isya: '--:--'
  });
  const [isLoadingJadwal, setIsLoadingJadwal] = useState(false);
  const [selectedKota, setSelectedKota] = useState<Kota>(DAFTAR_KOTA[0]);
  const { user } = useAuth();

  // Fungsi untuk menyamarkan nama
  const maskName = (name: string) => {
    const words = name.split(' ');
    return words.map(word => {
      if (word.length <= 2) return word;
      return word.charAt(0) + '*'.repeat(word.length - 2) + word.charAt(word.length - 1);
    }).join(' ');
  };

  // Fetch total donasi bulan ini
  useEffect(() => {
    const fetchTotalDonasi = async () => {
        setIsLoadingDonasi(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/donasi/statistics`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Gagal memuat data donasi');
            }

            const result = await response.json();
            if (result.status === 'success' && result.data) {
                setTotalDonasiBulanIni(result.data.total_donasi || 0);
            }
        } catch (error) {
            console.error('Error fetching total donasi:', error);
        } finally {
            setIsLoadingDonasi(false);
        }
    };

    fetchTotalDonasi();
  }, []);

  // Fetch jadwal adzan
  useEffect(() => {
    const fetchJadwalAdzan = async () => {
      setIsLoadingJadwal(true);
      try {
        const response = await fetch(
          `https://api.aladhan.com/v1/timings/${new Date().getTime() / 1000}?latitude=${selectedKota.latitude}&longitude=${selectedKota.longitude}&method=11`
        );
        
        if (!response.ok) {
          throw new Error('Gagal memuat jadwal adzan');
        }
        
        const data = await response.json();
        const timings = data.data.timings;
        
        setJadwalAdzan({
          subuh: timings.Fajr,
          dzuhur: timings.Dhuhr,
          ashar: timings.Asr,
          maghrib: timings.Maghrib,
          isya: timings.Isha
        });
      } catch (error) {
        console.error('Error fetching jadwal adzan:', error);
      } finally {
        setIsLoadingJadwal(false);
      }
    };

    fetchJadwalAdzan();
    // Refresh jadwal setiap 1 jam
    const interval = setInterval(fetchJadwalAdzan, 3600000);
    return () => clearInterval(interval);
  }, [selectedKota]);

  // Fetch kegiatan data
  useEffect(() => {
    const fetchKegiatan = async () => {
      setIsLoadingKegiatan(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/kegiatan`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Gagal memuat data kegiatan');
        }
        
        const result = await response.json();
        setKegiatan(result.data || []);
      } catch (error) {
        console.error('Error fetching kegiatan:', error);
      } finally {
        setIsLoadingKegiatan(false);
      }
    };

    fetchKegiatan();
  }, []);

  // Fetch recent donations
  useEffect(() => {
    const fetchRecentDonations = async () => {
      setIsLoadingRecentDonations(true);
      try {
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

        const result = await response.json();
        if (result.status === 'success' && result.data) {
          // Ambil 5 donasi terakhir dan urutkan berdasarkan tanggal terbaru
          const recent = result.data
            .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5)
            .map((donasi: any) => ({
              name: maskName(donasi.donatur.name),
              amount: typeof donasi.jumlah_donasi === 'string' 
                ? parseFloat(donasi.jumlah_donasi) 
                : donasi.jumlah_donasi
            }));

          setRecentDonations(recent);
        }
      } catch (error) {
        console.error('Error fetching recent donations:', error);
      } finally {
        setIsLoadingRecentDonations(false);
      }
    };

    fetchRecentDonations();
  }, []);

  // Fetch monthly donation data
  useEffect(() => {
    const fetchMonthlyDonations = async () => {
      setIsLoadingChart(true);
      try {
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

        const result = await response.json();
        if (result.status === 'success' && result.data) {
          const currentYear = new Date().getFullYear();
          const monthlyTotals = new Array(12).fill(0);

          result.data.forEach((donasi: any) => {
            const donasiDate = new Date(donasi.date);
            if (donasiDate.getFullYear() === currentYear) {
              const month = donasiDate.getMonth();
              const jumlah = typeof donasi.jumlah_donasi === 'string' 
                ? parseFloat(donasi.jumlah_donasi) 
                : donasi.jumlah_donasi;
              monthlyTotals[month] += isNaN(jumlah) ? 0 : jumlah;
            }
          });

          setMonthlyDonationData(monthlyTotals);
        }
      } catch (error) {
        console.error('Error fetching monthly donations:', error);
      } finally {
        setIsLoadingChart(false);
      }
    };

    fetchMonthlyDonations();
  }, []);

  // Data untuk grafik
  const chartData = useMemo(() => ({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'],
    datasets: [{
      label: 'Total Donasi Bulanan',
      data: monthlyDonationData,
      backgroundColor: 'rgba(75, 192, 192, 0.8)',
    }],
  }), [monthlyDonationData]);

  // Opsi Chart
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#f0fdf4',
      titleColor: '#15803d',
      bodyColor: '#166534',
      borderColor: '#86efac',
      borderWidth: 1,
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: '#4b5563', font: { size: 12 } },
    },
    y: {
      grid: { color: '#e5e7eb' },
      ticks: { color: '#4b5563', font: { size: 12 } },
    },
  },
};


  // Event handlers dengan useCallback
  const handleNext = useCallback(() => {
    if (kegiatan.length > 0) {
      setCurrentSlide(prev => (prev + 1) % kegiatan.length);
    }
  }, [kegiatan.length]);

  const handlePrev = useCallback(() => {
    if (kegiatan.length > 0) {
      setCurrentSlide(prev => (prev - 1 + kegiatan.length) % kegiatan.length);
    }
  }, [kegiatan.length]);

  return (
    <div className="space-y-6">
      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Grafik Donasi */}
        <div className="p-4 md:p-6 bg-white rounded-xl border border-gray-200 shadow-sm md:col-span-2">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 text-center">Grafik Donasi Bulanan</h2>
          {isLoadingChart ? (
            <div className="flex items-center justify-center h-64 md:h-80">
              <div className="animate-spin h-6 w-6 rounded-full border-2 border-green-500 border-t-transparent"></div>
              </div>) : (<div className="h-64 md:h-80"><Bar data={chartData} options={chartOptions} />
          </div>)}
        </div>


        {/* Pembayaran Terakhir */}
        <div className="p-4 md:p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 text-center">
            Riwayat Donasi Terakhir
          </h2>

          {isLoadingRecentDonations ? (
            <div className="flex items-center justify-center h-24">
              <div className="animate-spin h-6 w-6 rounded-full border-2 border-green-500 border-t-transparent"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {recentDonations.length > 0 ? (
                recentDonations.map((payment, idx) => (
                  <div
                    key={idx}
                    className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-100 shadow-sm hover:shadow transition duration-200"
                  >
                    <PaymentItem payment={payment} />
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 italic">Belum ada data donasi</p>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Menu Bawah */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Donasi */}
<div className="bg-white border border-gray-200 rounded-md shadow-sm p-4 flex flex-col items-center justify-center max-h-48">
    <h2 className="text-xl font-bold text-green-700 mb-4 text-center">Total Donasi</h2>
    {isLoadingDonasi ? (
      <div className="flex items-center justify-center h-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
      </div>
    ) : (
      <p className="text-4xl font-extrabold text-green-600 mb-4">
        Rp {totalDonasiBulanIni.toLocaleString('id-ID')}
      </p>
    )}
  </div>

        {/* Carousel Kegiatan */}
        <div
          id="default-carousel"
          className="relative w-full"
          data-carousel="slide"
        >
          {/* Carousel wrapper */}
          <div className="relative h-120 overflow-hidden rounded-lg md:h-60">
            {isLoadingKegiatan ? (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              </div>
            ) : kegiatan.length > 0 ? (
              kegiatan.map((item, index) => {
                const isActive = currentSlide === index;

                // Format tanggal
                const tanggalRaw = item.tanggal_kegiatan;
                const waktuRaw = item.waktu_kegiatan;

                const tanggal = tanggalRaw && tanggalRaw.includes("T")
                  ? tanggalRaw.split("T")[0]
                  : tanggalRaw;

                let waktu = waktuRaw;
                if (waktuRaw && waktuRaw.includes("T")) {
                  const afterT = waktuRaw.split("T")[1];
                  waktu = afterT ? afterT.split(".")[0] : "";
                } else if (waktuRaw && waktuRaw.length > 8) {
                  waktu = waktuRaw.split(".")[0];
                }

                const tanggalWaktu =
                  waktu && waktu !== "00:00:00" ? `${tanggal} ${waktu}` : tanggal;

                return (
                  <div
                    key={index}
                    className={`${isActive ? "block" : "hidden"} duration-700 ease-in-out`}
                    data-carousel-item
                  >
                    <img
                      src={
                        item.gambar_kegiatan
                          ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/${item.gambar_kegiatan}`
                          : "/placeholder-image.jpg"
                      }
                      alt={item.nama_kegiatan}
                      className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 object-cover h-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-center">
                      <p className="text-sm font-medium">{item.nama_kegiatan}</p>
                      <p className="text-xs text-gray-200">{tanggalWaktu}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500">Tidak ada kegiatan</p>
              </div>
            )}
          </div>

          {/* Slider controls */}
          <button
            type="button"
            className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
            data-carousel-prev
            onClick={handlePrev}
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white">
              <svg
                className="w-4 h-4 text-white rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 1 1 5l4 4"
                />
              </svg>
              <span className="sr-only">Previous</span>
            </span>
          </button>

          <button
            type="button"
            className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
            data-carousel-next
            onClick={handleNext}
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white">
              <svg
                className="w-4 h-4 text-white rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
              <span className="sr-only">Next</span>
            </span>
          </button>
        </div>


        {/* Jadwal Adzan */}
<div className="bg-white border border-gray-200 rounded-xl shadow-md p-6 md:p-8 transition-shadow hover:shadow-lg">
  <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Jadwal Adzan</h2>

  <div className="mb-6">
    <label htmlFor="kota" className="block text-sm font-medium text-gray-700 mb-2">
      Pilih Kota
    </label>
    <select
      id="kota"
      value={selectedKota.nama}
      onChange={(e) => {
        const kota = DAFTAR_KOTA.find((k) => k.nama === e.target.value);
        if (kota) setSelectedKota(kota);
      }}
      className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition"
    >
      {DAFTAR_KOTA.map((kota) => (
        <option key={kota.nama} value={kota.nama}>
          {kota.nama}
        </option>
      ))}
    </select>
  </div>

  <div className="overflow-x-auto">
    {isLoadingJadwal ? (
      <div className="flex justify-center items-center h-32">
        <div className="w-10 h-10 border-4 border-green-500 border-dashed rounded-full animate-spin"></div>
      </div>
    ) : (
      <JadwalAdzanTable jadwal={jadwalAdzan} />
    )}
    <p className="text-sm text-gray-500 text-center mt-4">
      Jadwal adzan untuk <span className="font-medium text-gray-700">{selectedKota.nama}</span>
    </p>
  </div>
</div>

      </div>
    </div>
  );
};

export default Overview; 