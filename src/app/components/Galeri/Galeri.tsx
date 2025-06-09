import React, { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { toast } from "react-toastify"; // Assuming you have toastify configured

interface Kegiatan {
  id: number;
  nama_kegiatan: string;
  tanggal_kegiatan: string;
  waktu_kegiatan: string;
  gambar_kegiatan?: string;
}

export default function Galeri() {
  const [kegiatan, setKegiatan] = useState<Kegiatan[]>([]);
  const [isLoadingKegiatan, setIsLoadingKegiatan] = useState(false);
  const [downloading, setDownloading] = useState<number | null>(null);

  const handleDownload = async (
    gambarPath: string,
    namaKegiatan: string,
    id: number
  ) => {
    if (!gambarPath) {
      toast.error("Path gambar tidak valid");
      return;
    }

    setDownloading(id);

    try {
      // It's generally safer to get the filename from the backend's content-disposition header
      // or ensure the backend returns a clean filename in the path.
      // For now, keeping your existing filename extraction logic.
      const filename = gambarPath.split("/").pop();
      const downloadUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/kegiatan/download/${filename}`;
      const token = localStorage.getItem("token");

      const response = await fetch(downloadUrl, {
        method: "GET",
        headers: {
          Accept: "application/octet-stream",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          errorText || `Gagal mengunduh file (Status: ${response.status})`
        );
      }

      const contentDisposition = response.headers.get("content-disposition");
      let saveAs =
        namaKegiatan.replace(/[^a-z0-9]/gi, "_").toLowerCase() + ".jpg"; // Sanitize and lowercase filename
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.+?)"?(;|$)/i);
        if (match && match[1]) {
          saveAs = match[1];
        }
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = saveAs;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success("Download berhasil!");
    } catch (error: any) {
      console.error("Download error:", error);
      toast.error(error.message || "Gagal mengunduh gambar");
    } finally {
      setDownloading(null);
    }
  };

  useEffect(() => {
    const fetchKegiatan = async () => {
      setIsLoadingKegiatan(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/kegiatan`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Gagal memuat data kegiatan");
        }

        const result = await response.json();
        setKegiatan(result.data || []);
      } catch (error) {
        console.error("Error fetching kegiatan:", error);
        toast.error("Gagal memuat galeri kegiatan.");
      } finally {
        setIsLoadingKegiatan(false);
      }
    };

    fetchKegiatan();
  }, []);

  const formatDate = (dateString: string, timeString: string) => {
    const date = dateString?.split("T")[0] || dateString;
    let time = timeString;

    if (timeString?.includes("T")) {
      const afterT = timeString.split("T")[1];
      time = afterT ? afterT.split(".")[0] : "";
    } else if (timeString?.length > 8) {
      time = timeString.split(".")[0];
    }

    return time && time !== "00:00:00" ? `${date} ${time}` : date;
  };

  return (
    <>
      <Head>
        <title>Galeri Kegiatan | Masjiku</title>
      </Head>
      <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-6xl font-extrabold text-center text-gray-900 mb-12 tracking-tight leading-tight">
          Galeri <span className="text-green-600">Kegiatan Masjid</span>
        </h1>

        {isLoadingKegiatan ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
            <p className="ml-4 text-lg text-gray-600">Memuat galeri...</p>
          </div>
        ) : kegiatan.filter((item) => !!item.gambar_kegiatan).length === 0 ? (
          <div className="text-center text-gray-500 text-xl py-10">
            Tidak ada gambar kegiatan yang tersedia saat ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {kegiatan
              .filter(item => !!item.gambar_kegiatan)
              .map((item, index) => (
                <div
                  key={item.id}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    window.open(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${item.gambar_kegiatan}`, '_blank');
                  }}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl group"
                >
                  <div className="relative w-full h-64 sm:h-52 md:h-60 overflow-hidden">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${item.gambar_kegiatan}`}
                      alt={item.nama_kegiatan}
                      fill
                      priority={index === 0}
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-in-out"
                      unoptimized
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    
                    {/* Background overlay */}
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"></div>
                    
                    {/* Button container */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <button
                        onClick={() => handleDownload(item.gambar_kegiatan!, item.nama_kegiatan, item.id)}
                        className={`px-6 py-2 rounded-full text-sm font-semibold text-white bg-green-700 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 ease-out flex items-center space-x-2 pointer-events-auto ${
                          downloading === item.id ? "opacity-60 cursor-not-allowed" : ""
                        }`}
                        disabled={downloading === item.id}
                      >
                        {/* Button content sama seperti sebelumnya */}
                        {downloading === item.id ? (
                          <>
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 0020 12c0-4.418-3.582-8-8-8a7.987 7.987 0 00-6.22 2.766M4 12c0 4.418 3.582 8 8 8a7.987 7.987 0 006.22-2.766M20 12v-5h-.582"></path>
                            </svg>
                            <span>Mengunduh...</span>
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            <span>Unduh Gambar</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="p-5 text-center">
                    <h2 className="text-xl font-bold text-gray-900 mb-2 leading-snug">
                      {item.nama_kegiatan}
                    </h2>
                    <p className="text-sm text-gray-600 font-medium">
                      {formatDate(item.tanggal_kegiatan, item.waktu_kegiatan)}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </>
  );
}