"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Forbidden() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0f1729] flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center">
        <div className="mb-6">
          <div className="inline-block p-4 bg-yellow-500/10 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-yellow-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          
          <h1 className="text-5xl font-bold text-white mb-2">401</h1>
          <p className="text-2xl font-medium text-white/90 mb-6">Akses Ditolak</p>
          
          <p className="text-gray-400 mb-8">
            Maaf, Anda tidak memiliki izin untuk mengakses halaman ini. 
            Silakan login dengan akun yang memiliki akses atau kembali ke halaman utama.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-colors w-full sm:w-auto"
          >
            Kembali
          </button>
          
          <Link 
            href="/login"
            className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white font-medium transition-colors w-full sm:w-auto"
          >
            Login
          </Link>
          
          <Link 
            href="/"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors w-full sm:w-auto"
          >
            Ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
} 