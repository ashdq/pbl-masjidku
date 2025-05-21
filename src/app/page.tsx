"use client";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from "framer-motion";

// Enhanced NavItem with animation
function NavItem({ label, href }: { label: string; href: string }) {
  return (
    <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Link
        href={href}
        className="p-3 text-gray-800 hover:text-green-600 font-medium transition duration-200 ease-in-out block"
      >
        {label}
      </Link>
    </motion.li>
  );
}

// Enhanced MobileMenu with smooth animations
function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          className="lg:hidden bg-white shadow-md px-4 py-4 fixed inset-0 z-50 mt-16"
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
            <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/login"
                className="block px-5 py-2 bg-green-600 text-white text-center rounded-md hover:bg-green-700 transition duration-200"
              >
                Sign In
              </Link>
            </motion.li>
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Navbar with enhanced scroll behavior
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
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
        <motion.div whileHover={{ scale: 1.05 }}>
          <Link href="/" className="text-xl font-extrabold text-green-600 hover:text-green-700 transition flex items-center gap-2">
            <Image src="/images/mosque-icon.png" alt="Masjidku Logo" width={30} height={30} />
            Masjidku
          </Link>
        </motion.div>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex gap-8 items-center">
          <NavItem label="About Us" href="#about" />
          <NavItem label="Features" href="#features" />
          <NavItem label="Contact Us" href="#contact" />
          <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
          </motion.li>
        </ul>

        {/* Mobile Menu Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
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
        </motion.button>
      </div>

      <MobileMenu open={open} onClose={handleClose} />
    </motion.nav>
  );
}

// Enhanced FeatureCard with animation
function FeatureCard({ title, description, iconSrc }: {
  title: string;
  description: string;
  iconSrc: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -10 }}
      className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition duration-300 h-full"
    >
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
    </motion.div>
  );
}

// FAQ Item component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="border-b border-gray-200 py-4"
    >
      <button
        className="flex justify-between items-center w-full text-left font-semibold text-lg py-2 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        <motion.svg
          className="w-5 h-5 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </motion.svg>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pt-2 pb-4 text-gray-600">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}


export default function LandingPage() {
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <div className="font-sans antialiased text-gray-900">
      <Navbar />

      {/* Enhanced Hero Section with parallax effect */}
      <section
        ref={heroRef}
        className="text-white min-h-screen flex flex-col items-center justify-center text-center px-6 pt-32 pb-16 relative overflow-hidden"
        id="hero"
      >
        <div
          className="absolute inset-0 bg-black/40 z-0"
          style={{
            backgroundImage: 'url("/bg2.jpg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container max-w-3xl mx-auto relative z-10"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
            Sistem Informasi dan Keuangan Masjid
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg sm:text-xl mb-8 leading-relaxed max-w-2xl mx-auto"
          >
            Kelola transaksi dan laporan keuangan masjid Anda dengan lebih
            efisien, transparan, dan mudah diakses.
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/register')}
            className="bg-white text-green-600 font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition duration-300 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Mulai Sekarang
          </motion.button>
        </motion.div>
      </section>

      {/* Enhanced Features Section with staggered animations */}
      <section className="py-20 px-6 bg-gray-50" id="features">
        <div className="container max-w-6xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-16"
          >
            Fitur Unggulan
          </motion.h2>
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

      {/* Enhanced CTA Section with pulse animation */}
      <section className="bg-gradient-to-br from-green-600 to-green-800 text-white py-24 px-6 text-center relative overflow-hidden" id="cta">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="container max-w-xl mx-auto relative z-10"
        >
          <motion.h2
            className="text-3xl font-bold mb-6"
            initial={{ y: 30 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Siap Memodernisasi Keuangan Masjid Anda?
          </motion.h2>
          <motion.p
            className="mb-8 text-lg leading-relaxed"
            initial={{ y: 30 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Bergabunglah dengan ratusan masjid yang telah merasakan kemudahan
            dan transparansi dengan Masjidku.
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/register')}
            className="bg-white text-green-700 font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition duration-300 text-lg"
            initial={{ y: 30 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Daftar Sekarang
          </motion.button>
        </motion.div>

        {/* Animated decorative elements */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full opacity-10 z-0"
          animate={{
            background: [
              'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.8) 0%, transparent 20%)',
              'radial-gradient(circle at 80% 70%, rgba(255,255,255,0.8) 0%, transparent 20%)',
              'radial-gradient(circle at 50% 20%, rgba(255,255,255,0.8) 0%, transparent 20%)'
            ]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </section>


      {/* FAQ Section */}
      <section className="py-20 px-6 bg-white" id="faq">
        <div className="container max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-12"
          >
            Pertanyaan yang Sering Diajukan
          </motion.h2>
          <div className="space-y-4">
            <FAQItem
              question="Apa itu Masjidku?"
              answer="Masjidku adalah sistem informasi dan keuangan masjid berbasis web yang membantu masjid mengelola transaksi, laporan keuangan, dan donasi digital dengan lebih efisien dan transparan."
            />
            <FAQItem
              question="Bagaimana cara mendaftar untuk masjid saya?"
              answer="Anda dapat mendaftar dengan mengklik tombol 'Daftar Sekarang' di halaman utama kami. Ikuti langkah-langkah pendaftaran yang mudah dan siapkan informasi dasar tentang masjid Anda."
            />
            <FAQItem
              question="Apakah Masjidku gratis untuk digunakan?"
              answer="Masjidku menawarkan beberapa paket layanan, termasuk opsi gratis dengan fitur dasar serta paket berbayar dengan fitur yang lebih lengkap untuk kebutuhan masjid yang lebih besar. Detail lebih lanjut dapat ditemukan di halaman harga kami."
            />
            <FAQItem
              question="Apakah data keuangan masjid saya aman?"
              answer="Ya, keamanan data adalah prioritas utama kami. Masjidku menggunakan enkripsi standar industri dan protokol keamanan terbaru untuk melindungi semua data keuangan masjid Anda."
            />
            <FAQItem
              question="Bisakah saya mengintegrasikan sistem donasi digital yang sudah ada?"
              answer="Masjidku menyediakan fitur donasi digital terintegrasi yang mendukung berbagai metode pembayaran. Untuk integrasi dengan sistem donasi digital yang sudah ada, silakan hubungi tim dukungan kami."
            />
          </div>
        </div>
      </section>

      {/* Enhanced Footer with subtle animation */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-gray-800 text-gray-300 py-12 text-center"
        id="contact"
      >
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="mb-4 md:mb-0"
            >
              <Link href="/" className="text-xl font-extrabold text-green-400 hover:text-green-300 transition flex items-center gap-2">
                <Image src="/images/mosque-icon.png" alt="Masjidku Logo" width={30} height={30} />
                Masjidku
              </Link>
            </motion.div>
            <div className="flex flex-col md:flex-row gap-6">
              <motion.a
                whileHover={{ y: -3 }}
                href="#"
                className="hover:text-white transition"
              >
                Privacy Policy
              </motion.a>
              <motion.a
                whileHover={{ y: -3 }}
                href="#"
                className="hover:text-white transition"
              >
                Terms of Service
              </motion.a>
              <motion.a
                whileHover={{ y: -3 }}
                href="mailto:contact@masjidku.com"
                className="hover:text-white transition"
              >
                Contact Us
              </motion.a>
            </div>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-sm"
          >
            &copy; {new Date().getFullYear()} Masjidku. Hak Cipta Dilindungi.
          </motion.p>
        </div>
      </motion.footer>
    </div>
  );
}