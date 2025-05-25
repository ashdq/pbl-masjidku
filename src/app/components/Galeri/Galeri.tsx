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
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <h1 className="text-3xl font-bold text-green-700 text-center mb-8">
          Galeri Kegiatan Masjid
        </h1>
        <div className="flex flex-col gap-10 max-w-3xl mx-auto">
          {photos.map((photo, index) => (
            <div
              key={index}
              className="rounded-xl overflow-hidden shadow-lg bg-white hover:shadow-2xl transition duration-300"
            >
              <div className="relative w-full h-[400px] sm:h-[500px]">
                <Image
                  src={photo.src}
                  alt={photo.caption}
                  fill
                  style={{ objectFit: "cover" }}
                  className="w-full h-full"
                  priority={index === 0}
                />
              </div>
              <div className="p-6">
                <p className="text-center text-green-800 font-bold text-xl">
                  {photo.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}