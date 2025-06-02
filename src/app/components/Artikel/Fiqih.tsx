'use client';

import React from 'react';

const Fiqih: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto mt-5 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      <img
        src="/fiqih.jpg"
        alt="Contoh Fiqih Tata Cara Sholat"
        className="w-full h-80 object-cover"
      />
      <div className="p-6 text-left">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Contoh Fiqih: Tata Cara Sholat
        </h1>
        <p className="text-sm text-gray-500 mb-4 italic">Sumber: google</p>

        <p className="text-gray-700 mb-4">
          Sholat adalah salah satu rukun Islam yang paling penting dan diatur secara rinci dalam ilmu fiqih. Berikut beberapa contoh aturan fiqih terkait sholat.
        </p>

        <ul className="list-disc list-inside text-gray-700 space-y-3">
          <li>
            <strong>Waktu Sholat:</strong> Setiap sholat wajib memiliki waktu tertentu, misalnya sholat Subuh dilakukan mulai terbit fajar hingga sebelum matahari terbit.
          </li>
          <li>
            <strong>Rukun Sholat:</strong> Ada beberapa rukun sholat yang harus dilakukan agar sholat sah, seperti niat, berdiri bagi yang mampu, takbiratul ihram, membaca Al-Fatihah, rukuk, sujud, dan tasyahhud.
          </li>
          <li>
            <strong>Hal-hal yang Membatalkan Sholat:</strong> Misalnya, berbicara dengan sengaja, tertawa keras, atau keluar dari sholat tanpa alasan yang dibenarkan membatalkan sholat.
          </li>
          <li>
            <strong>Wudhu Sebelum Sholat:</strong> Wudhu adalah cara bersuci yang wajib dilakukan sebelum sholat, dengan mencuci muka, tangan, mengusap kepala, dan kaki sesuai tata cara.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Fiqih;
