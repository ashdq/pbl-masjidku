'use client';

import React from 'react';

const Ceramah: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto mt-5 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      <img
        src="/ceramah.jpg"
        alt="Ceramah Keutamaan Sholat"
        className="w-full h-80 object-cover"
      />
      <div className="p-6 text-left">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Ceramah Singkat “Keutamaan Sholat Tepat Waktu”
        </h1>
        <p className="text-sm text-gray-500 mb-4 italic">Sumber: google</p>

        <div className="text-gray-700 space-y-4">
          <p>
            <strong>Assalamu’alaikum warahmatullahi wabarakatuh,</strong>
          </p>
          <p>
            Hadirin yang dirahmati Allah, hari ini saya ingin menyampaikan sedikit tentang keutamaan sholat tepat waktu. Sholat adalah tiang agama, kewajiban utama bagi setiap Muslim, dan menjalankannya dengan tepat waktu menunjukkan kesungguhan kita dalam beribadah kepada Allah SWT.
          </p>
          <p>
            Rasulullah SAW bersabda: <br />
            <em>"Sholatlah kalian sebagaimana kalian melihat aku sholat."</em> (HR. Bukhari dan Muslim)
          </p>
          <p>
            Artinya, kita diajarkan untuk melaksanakan sholat dengan sempurna dan tepat pada waktunya. Sholat tepat waktu bukan hanya kewajiban, tapi juga mendatangkan banyak keberkahan dalam hidup kita, seperti ketenangan hati, penghindaran dari perbuatan dosa, dan mendekatkan diri kita kepada Allah SWT.
          </p>
          <p>
            Marilah kita mulai membiasakan diri untuk menjaga waktu sholat, memprioritaskan ibadah, dan berdoa agar selalu diberikan kekuatan dan istiqamah dalam menjalankan sholat dan ibadah lainnya.
          </p>
          <p>
            Semoga Allah menerima amal ibadah kita dan menjadikan kita hamba-Nya yang selalu taat.
          </p>
          <p className="font-semibold">
            Wassalamu’alaikum warahmatullahi wabarakatuh.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Ceramah;
