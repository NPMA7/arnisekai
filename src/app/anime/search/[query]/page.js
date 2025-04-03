"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SearchBar from "@/components/SearchBar";
import { getAnimeUrl } from "@/lib/apiConfig";

export default function AnimeSearchPage() {
  const params = useParams();
  const router = useRouter();
  const searchQuery = params.query || "";
  const currentPage = parseInt(params.page || "1", 10);
  
  const [searchResults, setSearchResults] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState("newest"); // "newest" atau "alphabetical"

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(getAnimeUrl(`search/${encodeURIComponent(searchQuery)}${currentPage > 1 ? `/${currentPage}` : ''}`), {
          cache: "no-store",
        });
        
        if (!response.ok) {
          throw new Error("Gagal melakukan pencarian anime");
        }
        
        const data = await response.json();
        
        if (data && data.data) {
          setSearchResults(data.data.animes || []);
          setPagination(data.data.pagination || null);
        } else {
          setSearchResults([]);
          setPagination(null);
        }
        
        setError(null);
      } catch (err) {
        console.error("Error searching anime:", err);
        setError("Terjadi kesalahan saat melakukan pencarian. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery) {
      fetchData();
    }
  }, [searchQuery, currentPage]);

  // Fungsi untuk mengurutkan anime
  const getSortedAnime = (animeList) => {
    if (!animeList || !animeList.length) return [];
    
    const sorted = [...animeList];
    
    if (sortOrder === "alphabetical") {
      // Urut berdasarkan abjad (A-Z)
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    }
    
    // Default: urut berdasarkan terbaru (sesuai urutan dari API)
    return sorted;
  };
  
  // Fungsi untuk menangani pengurutan
  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  // Fungsi untuk navigasi ke halaman lain
  const goToPage = (page) => {
    router.push(`/anime/search/${encodeURIComponent(searchQuery)}/${page}`);
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
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  const sortedResults = getSortedAnime(searchResults);
  const decodedQuery = decodeURIComponent(searchQuery);

  return (
    <div className="bg-[#0f1729] min-h-screen pb-16">
      {/* Navigasi Breadcrumb */}
      <div className="bg-[#121a2e] py-3 shadow-md shadow-black/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="flex items-center text-sm flex-wrap">
              <Link href="/" className="text-gray-400 hover:text-white transition-colors">Beranda</Link>
              <span className="mx-2 text-gray-600">/</span>
              <Link href="/anime" className="text-gray-400 hover:text-white transition-colors">Anime</Link>
              <span className="mx-2 text-gray-600">/</span>
              <span className="text-white font-medium">Hasil Pencarian</span>
              {pagination && pagination.current_page > 1 && (
                <>
                  <span className="mx-2 text-gray-600">/</span>
                  <span className="text-white font-medium">Halaman {pagination.current_page}</span>
                </>
              )}
            </div>
            
            <SearchBar 
              className="w-full sm:w-64 md:w-72" 
              placeholder="Cari anime..."
            />
          </div>
        </div>
      </div>

      {/* Header Pencarian */}
      <div className="bg-[#0f1729] border-b border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
                <span className="mr-3 text-5xl text-red-400 opacity-80">#</span>
                Hasil Pencarian: "{decodedQuery}"
              </h1>
              <p className="text-red-100">
              {pagination 
                  ? `Halaman ${pagination.current_page} dari ${pagination.total_pages} · ${pagination.total_items || (searchResults.length * pagination.total_pages)}+ anime ditemukan` 
                  : `${searchResults.length} anime ditemukan`}
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

      <div className="container mx-auto px-4 pt-8">
        {/* Sort Bar */}
        <div className="bg-[#121a2e] border border-gray-800 rounded-lg p-4 mb-8">
          <div className="flex items-center justify-between gap-4">
            <div className="text-white font-medium">
              Hasil Pencarian untuk "{decodedQuery}"
            </div>
            
            {/* Sort Dropdown */}
            <div className="flex items-center space-x-3">
              <label htmlFor="sort-order" className="text-sm text-gray-300 whitespace-nowrap">Urutkan:</label>
              <select
                id="sort-order"
                value={sortOrder}
                onChange={handleSortChange}
                className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg p-2.5 focus:ring-red-500 focus:border-red-500 outline-none"
              >
                <option value="newest">Terbaru</option>
                <option value="alphabetical">A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Anime Grid */}
        {sortedResults.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {sortedResults.map((anime, index) => (
              <Link 
                key={index}
                href={`/anime/${anime.slug}`}
                className="bg-[#121a2e] border border-gray-800 rounded-lg overflow-hidden hover:border-red-500 transition-colors group"
              >
                <div className="aspect-[2/3] relative">
                  <Image 
                    src={anime.poster} 
                    alt={anime.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    quality={80}
                  />
                  {anime.score && (
                    <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm text-xs py-1 px-2 rounded-full text-yellow-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {anime.score}
                    </div>
                  )}
                  {anime.type && (
                    <div className="absolute top-2 right-2 bg-red-600 text-xs font-medium py-1 px-2 rounded-full backdrop-blur-sm shadow-sm">
                      {anime.type}
                    </div>
                  )}
                  {anime.status && (
                    <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className={`text-xs px-2 py-1 rounded ${
                        anime.status.toLowerCase().includes('completed') 
                          ? 'bg-green-600' 
                          : 'bg-blue-600'
                      }`}>
                        {anime.status}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-white font-medium line-clamp-2 group-hover:text-red-400 transition-colors">
                    {anime.title}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span className="text-gray-400 text-xs ml-1">{anime.views ? anime.views.toLocaleString() : "N/A"}</span>
                    </div>
                    {anime.genres && anime.genres.length > 0 && (
                      <span className="text-xs text-gray-500 line-clamp-1">
                        {anime.genres[0].name}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <div className="mb-4 text-red-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-white text-xl font-bold mb-2">Tidak ditemukan hasil</h3>
            <p className="text-gray-400 max-w-lg mx-auto">
              Tidak ada anime yang cocok dengan kriteria pencarian Anda. Coba gunakan kata kunci yang berbeda.
            </p>
          </div>
        )}
        
        {/* Pagination */}
        {pagination && pagination.visible_pages && pagination.visible_pages.length > 0 && (
          <div className="flex justify-center mt-12">
            <div className="flex flex-wrap gap-2">
              {/* Previous Button */}
              {pagination.has_previous_page && (
                <button
                  onClick={() => goToPage(pagination.previous_page)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-white transition-colors"
                >
                  ← Sebelumnya
                </button>
              )}
              
              {/* Page Numbers */}
              {pagination.visible_pages.map((page, index) => (
                <button
                  key={index}
                  onClick={() => goToPage(page.page)}
                  className={`w-10 h-10 flex items-center justify-center rounded-md transition-colors ${
                    page.is_current
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-800 hover:bg-gray-700 text-white'
                  }`}
                >
                  {page.page}
                </button>
              ))}
              
              {/* Next Button */}
              {pagination.has_next_page && (
                <button
                  onClick={() => goToPage(pagination.next_page)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-white transition-colors"
                >
                  Selanjutnya →
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Loading state component
function LoadingState() {
  return (
    <div className="bg-[#0f1729] min-h-screen pb-16">
      {/* Header Section Skeleton */}
      <div className="bg-[#121a2e] py-3 shadow-md shadow-black/20">
        <div className="container mx-auto px-4">
          <div className="h-8 bg-gray-800 rounded w-64 animate-pulse"></div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="h-10 bg-gray-800 rounded w-3/4 mb-4 animate-pulse"></div>
        <div className="h-6 bg-gray-800 rounded w-1/3 animate-pulse"></div>
      </div>
      
      {/* Sort Bar Skeleton */}
      <div className="container mx-auto px-4">
        <div className="bg-[#121a2e] border border-gray-800 rounded-lg p-4 mb-8">
          <div className="flex justify-between">
            <div className="h-6 bg-gray-800 rounded w-48 animate-pulse"></div>
            <div className="h-6 bg-gray-800 rounded w-32 animate-pulse"></div>
          </div>
        </div>
        
        {/* Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {[...Array(15)].map((_, index) => (
            <div key={index} className="bg-[#121a2e] border border-gray-800 rounded-lg overflow-hidden">
              <div className="aspect-[2/3] bg-gray-800 animate-pulse"></div>
              <div className="p-3">
                <div className="h-5 bg-gray-800 rounded w-full mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-800 rounded w-2/3 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 