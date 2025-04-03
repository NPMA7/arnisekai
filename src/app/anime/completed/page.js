"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import { getAnimeUrl } from "@/lib/apiConfig";

export default function CompletedAnimePage() {
  const router = useRouter();
  const params = useParams();
  const pageNumber = params.page || 1;
  
  const [animeData, setAnimeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(getAnimeUrl(`completed/${pageNumber}`), {
          cache: "no-store",
        });
        
        if (!response.ok) {
          throw new Error("Gagal mengambil data anime completed");
        }
        
        const data = await response.json();
        setAnimeData(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching completed anime data:", err);
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
      router.push("/anime/completed");
    } else {
      router.push(`/anime/completed/${page}`);
    }
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
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  const currentPage = animeData?.data?.pagination?.current_page || Number(pageNumber);

  return (
    <div className="bg-[#0f1729] mx-auto px-4 py-8">
      {/* Navigasi Breadcrumb */}
      <div className="bg-[#121a2e] py-3 shadow-md shadow-black/20 mb-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="flex items-center text-sm flex-wrap">
              <Link href="/" className="text-gray-400 hover:text-white transition-colors">Beranda</Link>
              <span className="mx-2 text-gray-600">/</span>
              <Link href="/anime" className="text-gray-400 hover:text-white transition-colors">Anime</Link>
              <span className="mx-2 text-gray-600">/</span>
              {currentPage > 1 ? (
                <>
                  <Link href="/anime/completed" className="text-gray-400 hover:text-white transition-colors">Completed</Link>
                  <span className="mx-2 text-gray-600">/</span>
                  <span className="text-white font-medium">Halaman {currentPage}</span>
                </>
              ) : (
                <span className="text-white font-medium">Completed</span>
              )}
            </div>
            
            <SearchBar className="w-full sm:w-64 md:w-72" />
          </div>
        </div>
      </div>


      {/* Header Section */}
      <div className="relative mb-12 overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900 to-rose-900 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('/donghua-pattern.jpg')] bg-cover opacity-30 mix-blend-overlay"></div>
        
        <div className="relative z-10 p-8 md:p-12">
          <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-300 to-rose-300 mb-4">
            Anime Completed
          </h1>
          <p className="text-gray-200 text-lg max-w-3xl mb-6">
            Koleksi anime Jepang yang sudah tamat dengan subtitle Indonesia. 
            Nikmati anime favorit Anda dari awal hingga akhir tanpa perlu menunggu.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/anime" className="bg-red-900/50 text-red-100 px-4 py-1.5 rounded-full hover:bg-red-800/70 transition-colors text-sm">
              Semua Anime
            </Link>
            <Link href="/anime/ongoing" className="bg-red-900/50 text-red-100 px-4 py-1.5 rounded-full hover:bg-red-800/70 transition-colors text-sm">
              Ongoing
            </Link>
            <Link href="/anime/genres" className="bg-red-900/50 text-red-100 px-4 py-1.5 rounded-full hover:bg-red-800/70 transition-colors text-sm">
            Daftar Genre
          </Link>
          <Link href="/anime/animelist" className="bg-red-900/50 text-red-100 px-4 py-1.5 rounded-full hover:bg-red-800/70 transition-colors text-sm">
            Daftar Anime
          </Link>
          </div>
        </div>
      </div>

      {/* Completed Anime Grid */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {currentPage > 1 ? `Anime Completed - Halaman ${currentPage}` : "Anime Completed"}
          </h2>
          <div className="text-sm text-gray-400">
            {animeData?.data?.animes?.length || 0} Series
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {animeData?.data?.animes?.map((anime, index) => (
            <Link key={index} href={`/anime/${anime.slug}`} className="group">
              <div className="relative overflow-hidden rounded-lg aspect-[2/3] bg-slate-800/40 shadow-lg hover:shadow-red-900/30 hover:shadow-xl transition-all duration-300">
                <Image 
                  src={anime.poster} 
                  alt={anime.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
                  loading={index < 12 ? "eager" : "lazy"}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="absolute top-2 right-2 bg-red-600 text-xs font-medium py-1 px-2 rounded-full backdrop-blur-sm shadow-sm">
                  {anime.type}
                </div>
                
                {anime.score && (
                  <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm text-xs py-1 px-2 rounded-full text-yellow-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {anime.score}
                  </div>
                )}
                
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/95 via-black/80 to-transparent transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="line-clamp-2 text-sm font-semibold text-white mb-1 group-hover:text-red-300 transition-colors">
                    {anime.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    <span className="text-xs text-gray-400">
                      {anime.views.toLocaleString()} views
                    </span>
                    {anime.genres && anime.genres.slice(0, 2).map((genre, idx) => (
                      <span key={idx} className="bg-red-900/60 text-red-300 text-xs px-1.5 py-0.5 rounded">
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Pagination */}
      {animeData?.data?.pagination && (
        <div className="mt-8 flex justify-center">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {/* Tombol Previous */}
            <button 
              onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className={`px-4 py-2 rounded ${currentPage <= 1 
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                : 'bg-red-600 hover:bg-red-700 text-white'
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
                  ? 'bg-red-600 text-white' 
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
                  className="w-10 h-10 rounded bg-red-600 text-white transition-colors"
                >
                  {currentPage}
                </button>
              )}
              
              {/* Page after current */}
              {animeData?.data?.pagination?.has_next_page && (
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  className="w-10 h-10 rounded bg-gray-700 hover:bg-gray-600 text-gray-200 transition-colors"
                >
                  {currentPage + 1}
                </button>
              )}
              
              {/* Ellipsis if needed - not shown as we don't know total pages */}
              
              {/* Tombol Next */}
              <button 
                onClick={() => animeData?.data?.pagination?.has_next_page && goToPage(currentPage + 1)}
                disabled={!animeData?.data?.pagination?.has_next_page}
                className={`px-4 py-2 rounded ml-1 ${!animeData?.data?.pagination?.has_next_page
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                  : 'bg-red-600 hover:bg-red-700 text-white'
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
    <div className="bg-[#0f1729] mx-auto px-4 py-8">
      {/* Header Section Skeleton */}
      <div className="relative mb-12 overflow-hidden rounded-2xl bg-slate-800 animate-pulse h-48"></div>
      
      {/* Completed Anime Grid Skeleton */}
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