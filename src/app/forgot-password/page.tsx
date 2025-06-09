'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [emailSent, setEmailSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

    async function getCsrfToken() {
        await fetch('http://localhost:8000/sanctum/csrf-cookie', {
            method: 'GET',
            credentials: 'include',
        });
    }

  const handleSendOTP = async () => {
    if (!email) return alert("Email tidak boleh kosong");

    try {
        await getCsrfToken(); // Tambahkan ini sebelum kirim OTP

        const response = await fetch('http://localhost:8000/api/forgot-password/send-otp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({ email }),
        credentials: 'include', // penting untuk Sanctum
        });

        const data = await response.json();

        if (response.ok) {
        setEmailSent(true);
        alert(data.message || 'Kode OTP telah dikirim ke email Anda.');
        } else {
        alert(data.message || 'Gagal mengirim OTP');
        }
    } catch (error) {
        console.error(error);
        alert('Terjadi kesalahan saat mengirim OTP');
    }
    };


  const handleVerifyOTP = async () => {
    if (!otp) return alert('Masukkan kode OTP');

    try {
        await getCsrfToken(); // Tambahkan ini sebelum kirim OTP

        const response = await fetch('http://localhost:8000/api/forgot-password/verify-otp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({ email, otp }),
        credentials: 'include',
        });

        const data = await response.json();

        if (response.ok) {
        setOtpVerified(true);
        alert(data.message || 'OTP berhasil diverifikasi');
        } else {
        alert(data.message || 'OTP tidak valid');
        }
    } catch (error) {
        console.error(error);
        alert('Terjadi kesalahan saat verifikasi OTP');
    }
  };


  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
        return alert('Password tidak cocok');
    }

    try {
        await getCsrfToken(); // Tambahkan ini sebelum kirim OTP

        const response = await fetch('http://localhost:8000/api/forgot-password/reset', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({
            email,
            otp,
            password: newPassword,
            password_confirmation: confirmPassword,
        }),
        credentials: 'include',
        });

        const data = await response.json();

        if (response.ok) {
        alert(data.message || 'Password berhasil diubah!');
        router.push('/login'); // redirect ke halaman login
        } else {
        alert(data.message || 'Gagal reset password');
        }
    } catch (error) {
        console.error(error);
        alert('Terjadi kesalahan saat reset password');
    }
 };


  return (
    <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/forgotpassword.jpg')" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-6"
      >
        <h1 className="text-3xl font-bold text-center text-green-600">Lupa Password</h1>

        {/* EMAIL FORM */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Alamat Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
            placeholder="nama@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {!emailSent && (
            <button
              onClick={handleSendOTP}
              className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl transition"
            >
              Kirim Kode OTP
            </button>
          )}
        </div>

        {/* OTP FORM */}
        {emailSent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-2"
          >
            <label className="block text-sm font-medium text-gray-700">Kode Verifikasi (OTP)</label>
            <input
              type="text"
              maxLength={6}
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
              placeholder="Masukkan OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            {!otpVerified && (
              <button
                onClick={handleVerifyOTP}
                className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl transition"
              >
                Verifikasi OTP
              </button>
            )}
          </motion.div>
        )}

        {/* RESET PASSWORD FORM */}
        {otpVerified && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-50 p-4 rounded-xl shadow-inner space-y-3"
          >
            <h2 className="text-lg font-semibold text-gray-700">Reset Password</h2>
            <div className="space-y-2">
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
                placeholder="Password Baru"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
                placeholder="Konfirmasi Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                onClick={handleResetPassword}
                className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl transition"
              >
                Simpan Password Baru
              </button>
            </div>
          </motion.div>
        )}
        <div className="text-center mt-6">
            <button
                onClick={() => router.push('/login')}
                className="inline-flex items-center text-green-700 hover:text-green-900 transition"
            >
                <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Kembali ke halaman login
            </button>
        </div>
      </motion.div>
    </div>
  );
}
