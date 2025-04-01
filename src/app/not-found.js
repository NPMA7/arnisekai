"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0f1729] flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center">
        <div className="mb-6">
          <div className="inline-block p-4 bg-red-500/10 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-red-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          
          <h1 className="text-5xl font-bold text-white mb-2">404</h1>
          <p className="text-2xl font-medium text-white/90 mb-6">Halaman Tidak Ditemukan</p>
          
          <p className="text-gray-400 mb-8">
            Maaf, halaman yang Anda cari tidak ditemukan atau telah dipindahkan. 
            Silakan periksa URL yang Anda masukkan atau kembali ke halaman utama.
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