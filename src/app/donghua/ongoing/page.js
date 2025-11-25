"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import { getDonghuaUrl } from "@/lib/apiConfig";

export default function OngoingDonghuaPage() {
  const router = useRouter();
  const params = useParams();
  const pageNumber = params.page || 1;
  
  const [donghuaData, setDonghuaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(getDonghuaUrl(`ongoing/${pageNumber}`), {
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
  }, [pageNumber]);

  // Fungsi untuk navigasi ke halaman lain
  const goToPage = (page) => {
    if (page === 1) {
      router.push("/donghua/ongoing");
    } else {
      router.push(`/donghua/ongoing/${page}`);
    }
  };

  // Fungsi untuk mendapatkan URL yang benar dari slug
  const getCorrectUrl = (item) => {
    if (item.slug) {
      return `/donghua/${item.slug}`;
    }
    // Jika URL lengkap tersedia, ekstrak slug dari URL
    if (item.url) {
      // Ekstrak slug dari URL API
      const urlParts = item.url.split('/');
      const slug = urlParts[urlParts.length - 1];
      return `/donghua/${slug}`;
    }
    return '#'; // Fallback jika tidak ada slug atau URL
  };

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

  const currentPage = donghuaData?.pagination?.page || Number(pageNumber);

  return (
    <div className="bg-[#0f1729] min-h-screen pb-16">
      {/* Navigasi Breadcrumb */}
      <div className="bg-[#121a2e] py-3 shadow-md shadow-black/20 mb-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="flex items-center text-sm flex-wrap">
              <Link href="/" className="text-gray-400 hover:text-white transition-colors">Beranda</Link>
              <span className="mx-2 text-gray-600">/</span>
              <Link href="/donghua" className="text-gray-400 hover:text-white transition-colors">Donghua</Link>
              <span className="mx-2 text-gray-600">/</span>
              {currentPage > 1 ? (
                <>
                  <Link href="/donghua/ongoing" className="text-gray-400 hover:text-white transition-colors">Ongoing</Link>
                  <span className="mx-2 text-gray-600">/</span>
                  <span className="text-white font-medium">Halaman {currentPage}</span>
                </>
              ) : (
              <span className="text-white font-medium">Ongoing</span>
              )}
            </div>
            
            <SearchBar className="w-full sm:w-64 md:w-72" />
          </div>
        </div>
      </div>

      {/* Header Section */}
      <div className="container mx-auto relative mb-12 overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-indigo-900 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('/donghua-pattern.jpg')] bg-cover opacity-30 mix-blend-overlay"></div>
        
        <div className="container mx-auto relative z-10 p-8 md:p-12">
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
            <Link href="/donghua/genres" className="bg-blue-900/50 text-blue-100 px-4 py-1.5 rounded-full hover:bg-blue-800/70 transition-colors text-sm">
            Daftar Genre
          </Link>
          <Link href="/donghua/seasons" className="bg-blue-900/50 text-blue-100 px-4 py-1.5 rounded-full hover:bg-blue-800/70 transition-colors text-sm">
            Daftar Seasons
          </Link>
          </div>
        </div>
      </div>

      {/* Ongoing Donghua Grid */}
      <section className="container mx-auto mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {currentPage > 1 ? `Donghua Ongoing - Halaman ${currentPage}` : "Donghua Ongoing"}
          </h2>
          <div className="text-sm text-gray-400">
            {donghuaData?.data?.ongoing_donghua?.length || 0} Series
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {donghuaData?.data?.ongoing_donghua?.map((item, index) => (
            <Link key={index} href={getCorrectUrl(item)} className="group">
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
      {donghuaData?.pagination && (
        <div className="mt-8 flex justify-center">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {/* Tombol Previous */}
            <button 
              onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className={`px-4 py-2 rounded ${currentPage <= 1 
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
              } transition-colors`}
            >
              Sebelumnya
            </button>
            
            {/* Daftar Halaman */}
            <div className="flex flex-wrap items-center gap-1">
              {/* Page 1 */}
              <button
                onClick={() => goToPage(1)}
                className={`w-10 h-10 rounded ${currentPage === 1 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                } transition-colors`}
              >
                1
              </button>
              
              {/* Ellipsis if needed */}
              {currentPage > 3 && (
                <span className="w-10 h-10 flex items-center justify-center text-gray-400">...</span>
              )}
              
              {/* Show pages around current page */}
              {currentPage > 2 && (
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  className="w-10 h-10 rounded bg-gray-700 hover:bg-gray-600 text-gray-200 transition-colors"
                >
                  {currentPage - 1}
                </button>
              )}
              
              {/* Current page (if not 1) */}
              {currentPage > 1 && (
                <button
                  onClick={() => goToPage(currentPage)}
                  className="w-10 h-10 rounded bg-blue-600 text-white transition-colors"
                >
                  {currentPage}
                </button>
              )}
              
              {/* Page after current */}
            {donghuaData?.pagination?.next_page && (
                <button
                  onClick={() => goToPage(Number(donghuaData.pagination.next_page))}
                  className="w-10 h-10 rounded bg-gray-700 hover:bg-gray-600 text-gray-200 transition-colors"
                >
                  {donghuaData.pagination.next_page}
                </button>
              )}
              
              {/* Tombol Next */}
              <button 
                onClick={() => donghuaData?.pagination?.next_page && goToPage(Number(donghuaData.pagination.next_page))}
                disabled={!donghuaData?.pagination?.next_page}
                className={`px-4 py-2 rounded ml-1 ${!donghuaData?.pagination?.next_page
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                } transition-colors`}
              >
                Selanjutnya
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Loading state component
function LoadingState() {
  return (
    <div className="bg-[#0f1729] min-h-screen pb-16">
      {/* Header Section Skeleton */}
      <div className="container mx-auto relative mb-12 overflow-hidden rounded-2xl bg-slate-800 animate-pulse h-48"></div>
      
      {/* Ongoing Donghua Grid Skeleton */}
      <div className="container mx-auto mb-16">
        <div className="h-8 bg-slate-800 w-60 rounded mb-6 animate-pulse"></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {[...Array(18)].map((_, index) => (
            <div key={index} className="rounded-lg aspect-[2/3] bg-slate-800 animate-pulse"></div>
          ))}
        </div>
      </div>
      
      {/* Pagination Skeleton */}
      <div className="container mx-auto flex justify-center my-10">
        <div className="h-10 bg-slate-800 w-60 rounded animate-pulse"></div>
      </div>
    </div>
  );
} 