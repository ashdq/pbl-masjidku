import React from 'react';
import { CheckCircle } from 'lucide-react';

const TipsIbadah: React.FC = () => {
  const tips = [ 
    {
      title: 'Niat yang Ikhlas',
      desc: 'Awali setiap ibadah dengan niat tulus karena Allah SWT.',
    },
    {
      title: 'Menjaga Waktu Sholat',
      desc: 'Sholat di awal waktu adalah bukti kecintaan kepada Allah.',
    },
    {
      title: "Membaca Al-Qur'an",
      desc: 'Luangkan waktu untuk membaca dan merenungi maknanya.',
    },
    {
      title: 'Dzikir dan Doa',
      desc: 'Jadikan dzikir sebagai penguat hati dan doa sebagai senjata.',
    },
    {
      title: 'Konsistensi',
      desc: 'Ibadah yang sedikit namun konsisten lebih dicintai Allah.',
    },
  ];

  return (
    <div className="p-8 bg-white rounded-2xl shadow-xl max-w-3xl mx-auto mt-10 border border-gray-200">
      <h1 className="text-4xl font-bold text-teal-700 mb-6 text-center">🕌 Tips Ibadah Harian</h1>
      <ul className="space-y-5">
        {tips.map((tip, index) => (
          <li key={index} className="flex items-start gap-3">
            <CheckCircle className="text-green-600 mt-1" size={20} />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{tip.title}</h3>
              <p className="text-gray-600">{tip.desc}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TipsIbadah;
