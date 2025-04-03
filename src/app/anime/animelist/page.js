"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import { getAnimeUrl } from "@/lib/apiConfig";

export default function AnimeListPage() {
  const params = useParams();
  const router = useRouter();
  const currentPage = parseInt(params.page || "1", 10);

  const [animeData, setAnimeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(getAnimeUrl(`anime-list/${currentPage}`), {
          cache: "no-store",
        });
        
        if (!response.ok) {
          throw new Error("Gagal mengambil daftar anime");
        }
        
        const data = await response.json();
        setAnimeData(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching anime list:", err);
        setError("Terjadi kesalahan saat mengambil data. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  // Function to handle page navigation
  const goToPage = (page) => {
    if (page === 1) {
      router.push('/anime/animelist');
    } else {
      router.push(`/anime/animelist/${page}`);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#0f1729]">
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

  const animes = animeData?.data?.animes || [];
  const pagination = animeData?.data?.pagination || {};

  return (
    <div className="bg-[#0f1729] min-h-screen pb-16">
      {/* Header Section */}
      <div className="bg-[#121a2e] py-3 shadow-md shadow-black/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="flex items-center text-sm flex-wrap">
              <Link href="/" className="text-gray-400 hover:text-white transition-colors">Beranda</Link>
              <span className="mx-2 text-gray-600">/</span>
              <Link href="/anime" className="text-gray-400 hover:text-white transition-colors">Anime</Link>
              <span className="mx-2 text-gray-600">/</span>
              <span className="text-white font-medium">Daftar Anime</span>
              {currentPage > 1 && (
                <>
                  <span className="mx-2 text-gray-600">/</span>
                  <span className="text-white font-medium">Halaman {currentPage}</span>
                </>
              )}
            </div>
            
            <SearchBar className="w-full sm:w-64 md:w-72" />
          </div>
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-[#0f1729] border-b border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
                <span className="mr-3 text-5xl text-red-400 opacity-80">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 0h-17.25m17.25 0h-1.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h-1.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h17.25c.621 0 1.125.504 1.125 1.125M21.75 4.5v15.75c0 .621-.504 1.125-1.125 1.125h-17.25c-.621 0-1.125-.504-1.125-1.125V5.625c0-.621.504-1.125 1.125-1.125h17.25c.621 0 1.125.504 1.125 1.125" />
                  </svg>
                </span>
                Daftar Anime
              </h1>
              <p className="text-red-100">
                {pagination ? `Halaman ${pagination.current_page} dari ${pagination.total_pages} · ${animes.length} anime ditampilkan · Total ${animes.length * pagination.total_pages}+ anime` : ""}
              </p>
            </div>
            
            {/* Navigation Buttons */}
            <div className="flex flex-wrap gap-2">
              <Link href="/anime" className="px-3 py-2 bg-red-800/30 text-sm rounded-md text-red-200 hover:bg-red-700/30 transition-colors flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                Semua Anime
              </Link>
              <Link href="/anime/ongoing" className="px-3 py-2 bg-red-800/30 text-sm rounded-md text-red-200 hover:bg-red-700/30 transition-colors flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
                Ongoing
              </Link>
              <Link href="/anime/completed" className="px-3 py-2 bg-red-800/30 text-sm rounded-md text-red-200 hover:bg-red-700/30 transition-colors flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Completed
              </Link>
              <Link href="/anime/genres" className="px-3 py-2 bg-red-800/30 text-sm rounded-md text-red-200 hover:bg-red-700/30 transition-colors flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                </svg>
                Genre
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Search Bar for Filtering Results */}
        <div className="bg-[#121a2e] border border-gray-800 rounded-lg p-4 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-white font-medium">
              Daftar Anime {pagination && `(${pagination.current_page}/${pagination.total_pages})`}
            </div>
            
            <div className="w-full sm:w-64 relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Filter anime..."
                className="w-full bg-[#0f1729] border border-gray-700 text-white rounded-lg p-2 pl-8 focus:outline-none focus:border-red-500"
              />
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Anime Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {animes
            .filter(anime => 
              anime.title.toLowerCase().includes(searchInput.toLowerCase())
            )
            .map((anime, index) => (
              <Link 
                key={index}
                href={`/anime/${anime.slug}`}
                className="group rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:shadow-red-900/20 transition-all duration-300"
              >
                <div className="relative aspect-[2/3]">
                  <Image 
                    src={anime.poster} 
                    alt={anime.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    quality={80}
                  />
                  
                  {/* Permanent bottom gradient for title */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                  
                  {/* Episode badge */}
                  {anime.episode && (
                    <div className="absolute top-2 right-2 z-10">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-red-600 text-white font-semibold shadow-md shadow-black/20 border border-red-500">
                        EP {anime.episode}
                      </span>
                    </div>
                  )}
                  
                  {/* Title and release time inside image */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                    <h3 className="text-white font-semibold line-clamp-2 text-sm mb-1">
                      {anime.title}
                    </h3>
                    <div className="flex items-center text-xs">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-red-400 mr-1">
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-300">
                        {anime.release_time}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
        </div>

        {/* Pagination */}
        {pagination && pagination.total_pages > 1 && (
          <div className="mt-10 flex justify-center">
            <div className="flex flex-wrap items-center gap-2">
              {/* Previous Page Button */}
              {pagination.has_previous_page && (
                <button 
                  onClick={() => goToPage(pagination.previous_page)} 
                  className="flex items-center justify-center w-10 h-10 rounded-md bg-[#121a2e] border border-gray-700 text-gray-300 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
              )}

              {/* Page Numbers */}
              {pagination.visible_pages?.map((p, index) => (
                <button 
                  key={index}
                  onClick={() => goToPage(p.page)}
                  className={`flex items-center justify-center w-10 h-10 rounded-md transition-colors ${
                    p.is_current 
                      ? 'bg-red-600 text-white border border-red-600' 
                      : 'bg-[#121a2e] border border-gray-700 text-gray-300 hover:bg-red-600 hover:text-white hover:border-red-600'
                  }`}
                >
                  {p.page}
                </button>
              ))}

              {/* Next Page Button */}
              {pagination.has_next_page && (
                <button 
                  onClick={() => goToPage(pagination.next_page)} 
                  className="flex items-center justify-center w-10 h-10 rounded-md bg-[#121a2e] border border-gray-700 text-gray-300 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="bg-[#0f1729] min-h-screen pb-16">
      {/* Header Section */}
      <div className="bg-[#121a2e] py-3 shadow-md shadow-black/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="flex items-center text-sm flex-wrap">
              <div className="h-4 bg-slate-800 w-16 rounded animate-pulse"></div>
              <span className="mx-2 text-gray-600">/</span>
              <div className="h-4 bg-slate-800 w-16 rounded animate-pulse"></div>
              <span className="mx-2 text-gray-600">/</span>
              <div className="h-4 bg-slate-800 w-32 rounded animate-pulse"></div>
            </div>
            
            <div className="h-8 bg-slate-800 w-64 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Header Banner - Loading State */}
      <div className="bg-[#0f1729] border-b border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="h-10 bg-slate-800 w-64 rounded mb-2 animate-pulse"></div>
              <div className="h-4 bg-slate-800 w-48 rounded animate-pulse"></div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-9 bg-slate-800 w-24 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Loading State */}
      <div className="container mx-auto px-4 py-8">
        {/* Search Bar - Loading State */}
        <div className="bg-[#121a2e] border border-gray-800 rounded-lg p-4 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="h-6 bg-slate-800 w-48 rounded animate-pulse"></div>
            <div className="h-10 bg-slate-800 w-64 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Anime Grid - Loading State */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {[...Array(15)].map((_, i) => (
            <div key={i} className="bg-[#121a2e] border border-gray-800 rounded-lg overflow-hidden">
              <div className="aspect-[2/3] relative bg-slate-800 animate-pulse"></div>
              <div className="p-3">
                <div className="h-5 bg-slate-800 w-full rounded mb-2 animate-pulse"></div>
                <div className="h-4 bg-slate-800 w-3/4 rounded mb-2 animate-pulse"></div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="h-3 bg-slate-800 w-16 rounded animate-pulse"></div>
                  <div className="h-3 bg-slate-800 w-16 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination - Loading State */}
        <div className="mt-10 flex justify-center">
          <div className="flex flex-wrap items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 w-10 bg-slate-800 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 