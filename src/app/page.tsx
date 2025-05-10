"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// NavItem component with proper typing and accessibility
function NavItem({ label, href }: { label: string; href: string }) {
  return (
    <li>
      <Link
        href={href}
        className="p-3 text-gray-800 hover:text-green-600 font-medium transition duration-200 ease-in-out block"
      >
        {label}
      </Link>
    </li>
  );
}

// MobileMenu component for better separation of concerns
function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div 
      className={`lg:hidden bg-white shadow-md px-4 py-4 fixed inset-0 z-50 mt-16 transition-all duration-300 ease-in-out ${
        open ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
      }`}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-700 hover:text-green-600 transition duration-200"
        aria-label="Close menu"
      >
        <XMarkIcon className="w-6 h-6" />
      </button>
      <ul className="flex flex-col gap-4 mt-8">
        <NavItem label="About Us" href="#about" />
        <NavItem label="Features" href="#features" />
        <NavItem label="Contact Us" href="#contact" />
        <li>
          <Link
            href="/login"
            className="block px-5 py-2 bg-green-600 text-white text-center rounded-md hover:bg-green-700 transition duration-200"
          >
            Sign In
          </Link>
        </li>
      </ul>
    </div>
  );
}

// Navbar component with improved accessibility and performance
function Navbar() {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [open]);

  const handleOpen = () => setOpen((prev) => !prev);
  const handleClose = () => setOpen(false);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? "bg-white shadow-md" : "bg-transparent"
    }`}>
      <div className="container max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
        <Link href="/" className="text-xl font-extrabold text-green-600 hover:text-green-700 transition">
          Masjidku
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex gap-8 items-center">
          <NavItem label="About Us" href="#about" />
          <NavItem label="Features" href="#features" />
          <NavItem label="Contact Us" href="#contact" />
          <li>
            {user ? (
              <button
                onClick={() => router.push('/dashboard')}
                className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
              >
                Dashboard
              </button>
            ) : (
              <Link
                href="/login"
                className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
              >
                Sign In
              </Link>
            )}
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-gray-700 hover:text-green-600 transition duration-200"
          onClick={handleOpen}
          aria-label="Toggle Menu"
          aria-expanded={open}
        >
          {open ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <Bars3Icon className="w-6 h-6" />
          )}
        </button>
      </div>

      <MobileMenu open={open} onClose={handleClose} />
    </nav>
  );
}

// FeatureCard component for better reusability
function FeatureCard({ title, description, iconSrc }: { 
  title: string; 
  description: string; 
  iconSrc: string 
}) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition duration-300 h-full">
      <div className="w-20 h-20 mx-auto mb-4 relative">
        <Image
          src={iconSrc}
          alt={title}
          fill
          className="object-contain"
          sizes="80px"
        />
      </div>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <p className="leading-relaxed text-gray-600">{description}</p>
    </div>
  );
}

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="font-sans antialiased text-gray-900">
      <Navbar />

      {/* Hero Section */}
      <section
        className="text-white min-h-screen flex flex-col items-center justify-center text-center px-6 pt-32 pb-16 relative"
        id="hero"
      >
        <div 
          className="absolute inset-0 bg-black/40 z-0"
          style={{
            backgroundImage: 'url("/bg2.jpg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div className="container max-w-3xl mx-auto relative z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
            Sistem Informasi dan Keuangan Masjid
          </h1>
          <p className="text-lg sm:text-xl mb-8 leading-relaxed max-w-2xl mx-auto">
            Kelola transaksi dan laporan keuangan masjid Anda dengan lebih
            efisien, transparan, dan mudah diakses.
          </p>
          <button 
            onClick={() => router.push('/register')}
            className="bg-white text-green-600 font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition duration-300 text-lg"
          >
            Mulai Sekarang
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gray-50" id="features">
        <div className="container max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-16">Fitur Unggulan</h2>
          <div className="grid md:grid-cols-3 gap-10">
            <FeatureCard
              title="Manajemen Keuangan Terpusat"
              description="Catat setiap pemasukan dan pengeluaran secara detail dan terstruktur."
              iconSrc="/man.png"
            />
            <FeatureCard
              title="Laporan Keuangan Real-time"
              description="Akses laporan keuangan masjid kapan saja dan di mana saja dengan data terkini."
              iconSrc="/stopwatch.png"
            />
            <FeatureCard
              title="Donasi Digital dengan QR Code"
              description="Permudah jamaah berdonasi melalui berbagai platform pembayaran digital."
              iconSrc="/qrcode.png"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-green-600 to-green-800 text-white py-24 px-6 text-center" id="cta">
        <div className="container max-w-xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">
            Siap Memodernisasi Keuangan Masjid Anda?
          </h2>
          <p className="mb-8 text-lg leading-relaxed">
            Bergabunglah dengan ratusan masjid yang telah merasakan kemudahan
            dan transparansi dengan Masjidku.
          </p>
          <button 
            onClick={() => router.push('/register')}
            className="bg-white text-green-700 font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition duration-300 text-lg"
          >
            Daftar Sekarang
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-8 text-center" id="contact">
        <div className="container max-w-7xl mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} Masjidku. Hak Cipta Dilindungi.</p>
          <div className="mt-4 flex justify-center gap-6">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
            <a href="mailto:contact@masjidku.com" className="hover:text-white transition">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}