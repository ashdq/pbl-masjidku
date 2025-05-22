import React from "react";
import Head from "next/head";
import Image from "next/image";

const photos = [
    { src: "/public/kegiatan1.jpg", caption: "Pengajian Rutin" },
    { src: "/public/kegiatan2.jpg", caption: "Buka Puasa Bersama" },
    { src: "/public/kegiatan3.jpg", caption: "Kerja Bakti" },
    { src: "/public/kegiatan4.jpg", caption: "Kajian Subuh" },
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {photos.map((photo, index) => (
            <div
              key={index}
              className="rounded-lg overflow-hidden shadow-lg bg-white hover:shadow-xl transition duration-300"
            >
              <Image
                src={photo.src}
                alt={photo.caption}
                width={600}
                height={400}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <p className="text-center text-green-800 font-semibold">
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
