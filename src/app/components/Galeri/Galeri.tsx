import React, { useEffect, useState} from "react";
import Head from "next/head";
import Image from "next/image";
import { toast } from "react-toastify"; // Optional untuk notifikasi

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

  const handleDownload = async (gambarPath: string, namaKegiatan: string, id: number) => {
    if (!gambarPath) {
      toast.error('Path gambar tidak valid');
      return;
    }

    setDownloading(id);

    try {
      const filename = gambarPath.split('/').pop();
      const downloadUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/kegiatan/download/${filename}`;
      const token = localStorage.getItem('token'); // Ambil token

      const response = await fetch(downloadUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/octet-stream',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}), // Tambahkan Authorization jika ada token
        },
        // credentials: 'include', // Hapus jika pakai Bearer token
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Gagal mengunduh file (Status: ${response.status})`);
      }

      // Coba ambil nama file dari header, fallback ke nama kegiatan
      const contentDisposition = response.headers.get('content-disposition');
      let saveAs = namaKegiatan.replace(/[^a-z0-9]/gi, '_') + '.jpg';
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.+?)"?(;|$)/i);
        if (match && match[1]) {
          saveAs = match[1];
        }
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = saveAs;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success('Download berhasil!');
    } catch (error: any) {
      console.error('Download error:', error);
      toast.error(error.message || 'Gagal mengunduh gambar');
    } finally {
      setDownloading(null);
    }
  };


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

  return (
    <>
      <Head>
        <title>Galeri Kegiatan | Masjiku</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-10 px-4">
        <h1 className="text-4xl font-extrabold text-green-800 text-center mb-12">
          Galeri Kegiatan Masjid
        </h1>
        {isLoadingKegiatan ? (
          <div className="text-center text-gray-500">Memuat galeri...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {kegiatan
              .filter(item => !!item.gambar_kegiatan)
              .map((item, index) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 group"
                  onContextMenu={(e) => {
                    e.preventDefault();
                    window.open(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${item.gambar_kegiatan}`, '_blank');
                  }}
                >
                  <div className="relative w-full h-64 overflow-hidden">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${item.gambar_kegiatan}`}
                      alt={item.nama_kegiatan}
                      fill
                      style={{ objectFit: "cover" }}
                      className="transform group-hover:scale-105 transition-transform duration-500"
                      priority={index === 0}
                      unoptimized // Tambahkan ini
                      onClick={(e) => e.preventDefault()} // Mencegah perilaku default
                    />
                  </div>
                  <div className="p-5 bg-green-50">
                    <p className="text-center text-green-900 font-semibold text-lg">
                      {item.nama_kegiatan}
                    </p>
                    <p className="text-xs text-gray-500 text-center mt-1">
                      {
                        (() => {
                          const tanggalRaw = item.tanggal_kegiatan;
                          const waktuRaw = item.waktu_kegiatan;

                          const tanggal = tanggalRaw && tanggalRaw.includes('T')
                            ? tanggalRaw.split('T')[0]
                            : tanggalRaw;

                          let waktu = waktuRaw;
                          if (waktuRaw && waktuRaw.includes('T')) {
                            const afterT = waktuRaw.split('T')[1];
                            waktu = afterT ? afterT.split('.')[0] : '';
                          } else if (waktuRaw && waktuRaw.length > 8) {
                            waktu = waktuRaw.split('.')[0];
                          }

                          return waktu && waktu !== '00:00:00'
                            ? `${tanggal} ${waktu}`
                            : tanggal;
                        })()
                      }
                    </p>
                    <div className="flex justify-center mt-4">
                      {item.gambar_kegiatan && (
                        <button
                          onClick={() => handleDownload(item.gambar_kegiatan!, item.nama_kegiatan, item.id)}
                          className={`inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors ${
                            downloading === item.id ? 'opacity-60 cursor-not-allowed' : ''
                          }`}
                          disabled={downloading === item.id}
                        >
                          {downloading === item.id ? 'Mengunduh...' : 'Download'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </>
  );
}
