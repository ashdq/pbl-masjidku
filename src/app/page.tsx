"use client";

import React, { useState, useEffect } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

function NavItem({ label }: { label: string }) {
  return (
    <li>
      <a href="#" className="p-3 text-gray-800 hover:text-green-600 font-medium transition duration-200 ease-in-out">
        {label}
      </a>
    </li>
  );
}

function NavbarWithSimpleLinks() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen((prev) => !prev);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 960) {
        setOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-10">
      <div className="container max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
        <div className="text-xl font-extrabold text-green-700">Masjidku</div>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex gap-8 items-center">
          <NavItem label="About Us" />
          <NavItem label="Pricing" />
          <NavItem label="Contact Us" />
          <li>
            <a href="#" className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200 ease-in-out">
              Sign In
            </a>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-gray-700 hover:text-green-600 transition duration-200 ease-in-out"
          onClick={handleOpen}
          aria-label="Toggle Menu"
        >
          {open ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden bg-white shadow-md px-4 py-4">
          <ul className="flex flex-col gap-4">
            <NavItem label="About Us" />
            <NavItem label="Pricing" />
            <NavItem label="Contact Us" />
            <li>
              <a href="#" className="block px-5 py-2 bg-green-600 text-white text-center rounded-md hover:bg-green-700 transition duration-200 ease-in-out">
                Sign In
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

export default function LandingPage() {
  return (
    <div className="font-sans antialiased">
      <NavbarWithSimpleLinks />

      <section
  className="text-white min-h-screen flex flex-col items-center justify-center text-center px-6 pt-32 pb-16"
  style={{
    backgroundImage: 'url("/bg.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  }}
>
  <div className="container max-w-3xl mx-auto">
    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6">Sistem Informasi dan Keuangan Masjid</h1>
    <p className="text-lg sm:text-xl mb-8 leading-relaxed">
      Kelola transaksi dan laporan keuangan masjid Anda dengan lebih efisien, transparan, dan mudah diakses.
    </p>
    <button className="bg-white text-green-700 font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition ease-in-out duration-300 text-lg">
      Mulai Sekarang
    </button>
  </div>
</section>

      <section className="py-20 px-6 bg-gray-50 text-gray-800">
        <div className="container max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-16">Fitur Unggulan</h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition duration-300 ease-in-out">
              <h3 className="text-xl font-semibold mb-4">Manajemen Keuangan Terpusat</h3>
              <p className="leading-relaxed">Catat setiap pemasukan dan pengeluaran secara detail dan terstruktur.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition duration-300 ease-in-out">
              <h3 className="text-xl font-semibold mb-4">Laporan Keuangan Real-time</h3>
              <p className="leading-relaxed">Akses laporan keuangan masjid kapan saja dan di mana saja dengan data terkini.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition duration-300 ease-in-out">
              <h3 className="text-xl font-semibold mb-4">Donasi Digital dengan QR Code</h3>
              <p className="leading-relaxed">Permudah jamaah berdonasi melalui berbagai platform pembayaran digital.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-green-700 text-white py-24 px-6 text-center">
        <div className="container max-w-xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Siap Memodernisasi Keuangan Masjid Anda?</h2>
          <p className="mb-8 text-lg leading-relaxed">Bergabunglah dengan ratusan masjid yang telah merasakan kemudahan dan transparansi dengan Masjidku.</p>
          <button className="bg-white text-green-700 font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition ease-in-out duration-300 text-lg">
            Daftar Sekarang
          </button>
        </div>
      </section>

      <footer className="bg-gray-800 text-gray-300 py-8 text-center">
        <div className="container max-w-7xl mx-auto">
          <p>&copy; {new Date().getFullYear()} Masjidku. Hak Cipta Dilindungi.</p>
        </div>
      </footer>
    </div>
  );
}