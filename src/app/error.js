"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log error ke sistem analitik atau monitoring
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0f1729] flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center">
        <div className="mb-6">
          <div className="inline-block p-4 bg-orange-500/10 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-orange-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          
          <h1 className="text-5xl font-bold text-white mb-2">500</h1>
          <p className="text-2xl font-medium text-white/90 mb-6">Kesalahan Server Internal</p>
          
          <p className="text-gray-400 mb-8">
            Maaf, telah terjadi kesalahan pada server kami. Tim kami sudah diberitahu tentang 
            masalah ini dan sedang bekerja untuk memperbaikinya. Silakan coba lagi dalam beberapa saat.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => reset()}
            className="px-6 py-3 bg-orange-600 hover:bg-orange-700 rounded-lg text-white font-medium transition-colors w-full sm:w-auto"
          >
            Coba Lagi
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