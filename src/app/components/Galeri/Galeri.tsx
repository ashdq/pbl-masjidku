import React from "react";
import Head from "next/head";
import Image from "next/image";

const photos = [
  { src: "/kegiatan1.jpg", caption: "Pengajian Rutin" },
  { src: "/kegiatan2.jpg", caption: "Buka Puasa Bersama" },
  { src: "/kegiatan3.jpg", caption: "Kerja Bakti" },
  { src: "/kegiatan4.jpg", caption: "Kajian Subuh" },
];

export default function Galeri() {
  return (
    <>
      <Head>
        <title>Galeri Kegiatan | Masjiku</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-10 px-4">
        <h1 className="text-4xl font-extrabold text-green-800 text-center mb-12">
          Galeri Kegiatan Masjid
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {photos.map((photo, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 group"
            >
              <div className="relative w-full h-64 overflow-hidden">
                <Image
                  src={photo.src}
                  alt={photo.caption}
                  fill
                  style={{ objectFit: "cover" }}
                  className="transform group-hover:scale-105 transition-transform duration-500"
                  priority={index === 0}
                />
              </div>
              <div className="p-5 bg-green-50">
                <p className="text-center text-green-900 font-semibold text-lg">
                  {photo.caption}
                </p>
                <div className="flex justify-center mt-4">
                  <a
                    href={photo.src}
                    download
                    className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors"
                  >
                    Download
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
