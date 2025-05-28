'use client';

import React from 'react';

const Ceramah: React.FC = () => {
  return (
    <div className="p-8 bg-white rounded-2xl shadow-lg max-w-3xl mx-auto mt-10">
      <h1 className="text-3xl font-bold text-teal-700 mb-4">Fiqih Sehari-hari</h1>
      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
        Bagian ini akan menjelaskan hukum-hukum fiqih yang relevan dengan kehidupan sehari-hari.
        Contohnya, fiqih wudhu, sholat, puasa, atau muamalah (interaksi sosial).
        Tujuannya untuk memberikan panduan praktis bagi umat Islam.
        Pengetahuan fiqih membantu kita beribadah dengan benar.
      </p>
    </div>
  );
};

export default Ceramah;