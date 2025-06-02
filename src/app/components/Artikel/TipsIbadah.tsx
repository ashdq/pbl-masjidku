import React from 'react';

const TipsIbadah: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto mt-5 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      <img
        src="/sholat.jpg"
        alt="Tips Ibadah Harian"
        className="w-full h-80 object-cover"
      />
      <div className="p-6 text-left">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Tips Ibadah Harian: Cara Konsisten Beribadah Setiap Hari
        </h1>
        <p className="text-sm text-gray-500 mb-4 italic">Sumber: chatgpt-islamic.ai</p>

        <p className="text-gray-700 mb-4">
          Dalam kehidupan sehari-hari, menjaga konsistensi dalam ibadah adalah hal yang sangat penting bagi setiap Muslim. Namun, kesibukan dan gangguan duniawi sering kali membuat kita lalai dalam menjalankan kewajiban kepada Allah SWT.
        </p>
        <p className="text-gray-700 mb-4">
          Berikut beberapa tips praktis agar ibadah harian tetap terjaga dan menjadi bagian yang menyatu dalam hidup kita:
        </p>

        <ul className="list-disc list-inside text-gray-700 space-y-3">
          <li>
            <strong>Niat yang Ikhlas:</strong> Awali setiap ibadah dengan niat yang tulus hanya karena Allah SWT.
          </li>
          <li>
            <strong>Menjaga Waktu Sholat:</strong> Usahakan sholat tepat waktu, lebih utama lagi di awal waktu.
          </li>
          <li>
            <strong>Membaca Al-Qur'an:</strong> Jadwalkan waktu khusus setiap hari untuk membaca dan mentadabburi Al-Qur'an.
          </li>
          <li>
            <strong>Dzikir dan Doa:</strong> Biasakan berzikir setelah sholat dan memanjatkan doa di waktu-waktu mustajab.
          </li>
          <li>
            <strong>Konsistensi (Istiqamah):</strong> Ibadah yang rutin meskipun sedikit lebih dicintai oleh Allah daripada yang banyak tapi jarang dilakukan.
          </li>
        </ul>

        <p className="text-gray-700 mt-6">
          Dengan menerapkan tips-tips tersebut, semoga kita semua bisa menjadi pribadi yang lebih dekat dengan Allah dan mendapatkan ketenangan hati dalam menjalani kehidupan.
        </p>
      </div>
    </div>
  );
};

export default TipsIbadah;
