"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, redirect } from "next/navigation";

export default function CompletedDonghuaPageWithPagination() {
  const params = useParams();
  const pageNumber = parseInt(params.page) || 1;
  
  // Redirect halaman 1 ke URL utama
  if (pageNumber === 1) {
    redirect("/donghua/completed");
  }
  
  const [donghuaData, setDonghuaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const apiKey = process.env.NEXT_PUBLIC_API_KEY;
        const response = await fetch(`https://anyapi-beta.vercel.app/v1/donghua/anichin/completed/${pageNumber}`, {
          headers: {
            "X-API-Key": apiKey,
          },
          cache: "no-store",
        });
        
        if (!response.ok) {
          throw new Error("Gagal mengambil data donghua completed");
        }
        
        const data = await response.json();
        setDonghuaData(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching completed donghua data:", err);
        setError("Terjadi kesalahan saat mengambil data. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pageNumber]);

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
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0f1729] mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="relative mb-12 overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-green-900 to-emerald-900 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('/donghua-pattern.jpg')] bg-cover opacity-30 mix-blend-overlay"></div>
        
        <div className="relative z-10 p-8 md:p-12">
          <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-emerald-300 mb-4">
            Donghua Completed
          </h1>
          <p className="text-gray-200 text-lg max-w-3xl mb-6">
            Koleksi donghua (animasi Tiongkok) yang sudah tamat dengan subtitle Indonesia. 
            Nikmati donghua favorit Anda dari awal hingga akhir tanpa perlu menunggu.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/donghua" className="bg-green-900/50 text-green-100 px-4 py-1.5 rounded-full hover:bg-green-800/70 transition-colors text-sm">
              Semua Donghua
            </Link>
            <Link href="/donghua/ongoing" className="bg-green-900/50 text-green-100 px-4 py-1.5 rounded-full hover:bg-green-800/70 transition-colors text-sm">
              Ongoing
            </Link>
          </div>
        </div>
      </div>

      {/* Completed Donghua Grid */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Donghua Completed</h2>
          <div className="text-sm text-gray-400">
            {donghuaData?.data?.completed_donghua?.length || 0} Series
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {donghuaData?.data?.completed_donghua?.map((item, index) => (
            <Link key={index} href={item.url.replace("https://anyapi-beta.vercel.app/v1/donghua/anichin/detail/", "/donghua/")} className="group">
              <div className="relative overflow-hidden rounded-lg aspect-[2/3] bg-slate-800/40 shadow-lg hover:shadow-green-900/30 hover:shadow-xl transition-all duration-300">
                <Image 
                  src={item.poster} 
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
                  loading={index < 12 ? "eager" : "lazy"}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="absolute top-2 right-2 bg-green-600 text-xs font-medium py-1 px-2 rounded-full backdrop-blur-sm shadow-sm">
                  {item.status}
                </div>
                
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-xs font-medium py-1 px-2 rounded-full text-gray-300 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  Sudah Tamat
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/95 via-black/80 to-transparent transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="line-clamp-2 text-sm font-semibold text-white mb-1 group-hover:text-green-300 transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    <span className="text-xs text-gray-400">Series Complete</span>
                    <span className="bg-green-900/60 text-green-300 text-xs px-1.5 py-0.5 rounded">Tamat</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Pagination */}
      {(donghuaData?.pagination?.previos_page || donghuaData?.pagination?.next_page) && (
        <div className="flex justify-center my-10">
          <div className="flex gap-2">
            {donghuaData?.pagination?.previos_page ? (
              donghuaData.pagination.previos_page === "1" ? (
                <Link
                  href="/donghua/completed"
                  className="px-4 py-2 bg-green-900/60 hover:bg-green-800 rounded-md transition-colors text-white"
                >
                  ← Sebelumnya
                </Link>
              ) : (
                <Link
                  href={`/donghua/completed/${donghuaData.pagination.previos_page}`}
                  className="px-4 py-2 bg-green-900/60 hover:bg-green-800 rounded-md transition-colors text-white"
                >
                  ← Sebelumnya
                </Link>
              )
            ) : null}
            
            <div className="px-4 py-2 bg-green-900/30 rounded-md text-white">
              Halaman {pageNumber}
            </div>
            
            {donghuaData?.pagination?.next_page && (
              <Link
                href={`/donghua/completed/${donghuaData.pagination.next_page}`}
                className="px-4 py-2 bg-green-900/60 hover:bg-green-800 rounded-md transition-colors text-white"
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
      
      {/* Completed Donghua Grid Skeleton */}
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