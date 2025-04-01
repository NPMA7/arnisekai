"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import SearchBar from "@/components/SearchBar";
export default function OngoingDonghuaPage() {
  const [donghuaData, setDonghuaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pageNumber = 1; // Selalu halaman 1 untuk URL tanpa nomor halaman

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const apiKey = process.env.NEXT_PUBLIC_API_KEY;
        const response = await fetch(`https://anyapi-beta.vercel.app/v1/donghua/anichin/ongoing/${pageNumber}`, {
          headers: {
            "X-API-Key": apiKey,
          },
          cache: "no-store",
        });
        
        if (!response.ok) {
          throw new Error("Gagal mengambil data donghua ongoing");
        }
        
        const data = await response.json();
        setDonghuaData(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching ongoing donghua data:", err);
        setError("Terjadi kesalahan saat mengambil data. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Error</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0f1729] mx-auto px-4 py-8">
      {/* Navigasi Breadcrumb */}
      <div className="bg-[#121a2e] py-3 shadow-md shadow-black/20 mb-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="flex items-center text-sm flex-wrap">
              <Link href="/" className="text-gray-400 hover:text-white transition-colors">Beranda</Link>
              <span className="mx-2 text-gray-600">/</span>
              <Link href="/donghua" className="text-gray-400 hover:text-white transition-colors">Donghua</Link>
              <span className="mx-2 text-gray-600">/</span>
              <span className="text-white font-medium">Ongoing</span>
            </div>
            
            <SearchBar className="w-full sm:w-64 md:w-72" />
          </div>
        </div>
      </div>

      {/* Header Section */}
      <div className="relative mb-12 overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-indigo-900 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('/donghua-pattern.jpg')] bg-cover opacity-30 mix-blend-overlay"></div>
        
        <div className="relative z-10 p-8 md:p-12">
          <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-indigo-300 mb-4">
            Donghua Ongoing
          </h1>
          <p className="text-gray-200 text-lg max-w-3xl mb-6">
            Koleksi donghua (animasi Tiongkok) yang sedang tayang dengan subtitle Indonesia. 
            Update terbaru setiap minggu, pantau terus serial favorit Anda di sini.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/donghua" className="bg-blue-900/50 text-blue-100 px-4 py-1.5 rounded-full hover:bg-blue-800/70 transition-colors text-sm">
              Semua Donghua
            </Link>
            <Link href="/donghua/completed" className="bg-blue-900/50 text-blue-100 px-4 py-1.5 rounded-full hover:bg-blue-800/70 transition-colors text-sm">
              Completed
            </Link>
          </div>
        </div>
      </div>

      {/* Ongoing Donghua Grid */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Donghua Ongoing</h2>
          <div className="text-sm text-gray-400">
            {donghuaData?.data?.ongoing_donghua?.length || 0} Series
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {donghuaData?.data?.ongoing_donghua?.map((item, index) => (
            <Link key={index} href={item.url.replace("https://anyapi-beta.vercel.app/v1/donghua/anichin/detail/", "/donghua/")} className="group">
              <div className="relative overflow-hidden rounded-lg aspect-[2/3] bg-slate-800/40 shadow-lg hover:shadow-indigo-900/30 hover:shadow-xl transition-all duration-300">
                <Image 
                  src={item.poster} 
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
                  loading={index < 12 ? "eager" : "lazy"}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="absolute top-2 right-2 bg-indigo-600 text-xs font-medium py-1 px-2 rounded-full backdrop-blur-sm shadow-sm">
                  {item.status}
                </div>
                
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-xs font-medium py-1 px-2 rounded-full text-gray-300 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  Sedang Tayang
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/95 via-black/80 to-transparent transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="line-clamp-2 text-sm font-semibold text-white mb-1 group-hover:text-indigo-300 transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    <span className="text-xs text-gray-400">Update Mingguan</span>
                    <span className="bg-indigo-900/60 text-indigo-300 text-xs px-1.5 py-0.5 rounded">Series</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Pagination */}
      {donghuaData?.pagination?.next_page && (
        <div className="flex justify-center my-10">
          <div className="flex gap-2">
            <div className="px-4 py-2 bg-blue-900/30 rounded-md text-white">
              Halaman {pageNumber}
            </div>
            
            {donghuaData?.pagination?.next_page && (
              <Link
                href={`/donghua/ongoing/${donghuaData.pagination.next_page}`}
                className="px-4 py-2 bg-blue-900/60 hover:bg-blue-800 rounded-md transition-colors text-white"
              >
                Selanjutnya →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Loading state component
function LoadingState() {
  return (
    <div className="bg-[#0f1729] mx-auto px-4 py-8">
      {/* Header Section Skeleton */}
      <div className="relative mb-12 overflow-hidden rounded-2xl bg-slate-800 animate-pulse h-48"></div>
      
      {/* Ongoing Donghua Grid Skeleton */}
      <div className="mb-16">
        <div className="h-8 bg-slate-800 w-60 rounded mb-6 animate-pulse"></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {[...Array(18)].map((_, index) => (
            <div key={index} className="rounded-lg aspect-[2/3] bg-slate-800 animate-pulse"></div>
          ))}
        </div>
      </div>
      
      {/* Pagination Skeleton */}
      <div className="flex justify-center my-10">
        <div className="h-10 bg-slate-800 w-60 rounded animate-pulse"></div>
      </div>
    </div>
  );
} 