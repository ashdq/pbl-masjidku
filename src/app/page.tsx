"use client";

import React, { useState, useEffect } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

function NavItem({ label }: { label: string }) {
  return (
    <li>
      <a href="#" className="p-2 text-gray-800 hover:text-green-600 font-medium">
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
    <nav className="fixed top-0 left-0 right-0 bg-white shadow z-10">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <div className="text-lg font-bold text-green-700">Masjidku</div>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex gap-6 items-center">
          <NavItem label="About Us" />
          <NavItem label="Pricing" />
          <NavItem label="Contact Us" />
          <li>
            <a href="#" className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700">
              Sign In
            </a>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-gray-700"
          onClick={handleOpen}
          aria-label="Toggle Menu"
        >
          {open ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden bg-white shadow-md px-4 py-4">
          <ul className="flex flex-col gap-3">
            <NavItem label="About Us" />
            <NavItem label="Pricing" />
            <NavItem label="Contact Us" />
            <li>
              <a href="#" className="block px-4 py-2 bg-gray-800 text-white text-center rounded">
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
    <div className="font-sans">
      <NavbarWithSimpleLinks />

      <section className="bg-gradient-to-br from-green-800 to-green-500 text-white min-h-screen flex flex-col items-center justify-center text-center px-4 pt-32">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Sistem Informasi dan Keuangan / Masjidku</h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl">
          Transaksi dan pelaporan keuangan masjid kini lebih mudah, cepat, dan transparan.
        </p>
        <button className="bg-white text-green-700 font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition">
          Mulai Sekarang
        </button>
      </section>

      <section className="py-20 px-4 bg-gray-50 text-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Fitur Unggulan</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-2">Manajemen Keuangan</h3>
              <p>Pencatatan pemasukan & pengeluaran secara otomatis dan real-time.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-2">Laporan Transparan</h3>
              <p>Laporan keuangan lengkap dan bisa diakses kapan saja.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-2">QR Code Pembayaran</h3>
              <p>Memudahkan jamaah untuk berdonasi melalui e-wallet atau mobile banking.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-green-700 text-white py-16 px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Bergabung dengan Masjid Modern</h2>
        <p className="mb-6 text-lg">Mulai digitalisasi keuangan masjid Anda hari ini.</p>
        <button className="bg-white text-green-700 font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition">
          Daftar Sekarang
        </button>
      </section>

      <footer className="bg-gray-800 text-gray-300 py-6 text-center">
        <p>&copy; {new Date().getFullYear()} Masjidku. All rights reserved.</p>
      </footer>
    </div>
  );
}
