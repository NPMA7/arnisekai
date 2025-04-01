"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import AnimeCard from "@/components/AnimeCard";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all"); // all, anime, donghua
  
  // Pagination state
  const [totalPages, setTotalPages] = useState({
    anime: 1,
    donghua: 1
  });
  
  useEffect(() => {
    if (!query) {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }
    
    const fetchSearchResults = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const apiKey = process.env.NEXT_PUBLIC_API_KEY;
        
        // Membuat URL pencarian untuk donghua dan anime dengan pagination
        const donghuaSearchUrl = `https://anyapi-beta.vercel.app/v1/donghua/anichin/search/${encodeURIComponent(query)}${currentPage > 1 ? `/${currentPage}` : ''}`;
        const animeSearchUrl = `https://anyapi-beta.vercel.app/v1/anime/samehadaku/search/${encodeURIComponent(query)}${currentPage > 1 ? `/${currentPage}` : ''}`;
        
        // Melakukan kedua pencarian secara paralel
        const [donghuaRes, animeRes] = await Promise.all([
          fetch(donghuaSearchUrl, {
            headers: { "X-API-Key": apiKey },
            cache: "no-store"
          }),
          fetch(animeSearchUrl, {
            headers: { "X-API-Key": apiKey },
            cache: "no-store"
          })
        ]);
        
        let combinedResults = [];
        let newTotalPages = { ...totalPages };
        
        // Proses hasil pencarian donghua jika berhasil
        if (donghuaRes.ok) {
          const donghuaData = await donghuaRes.json();
          
          // Update total pages untuk donghua jika ada
          if (donghuaData.pagination && donghuaData.pagination.total_pages) {
            newTotalPages.donghua = donghuaData.pagination.total_pages;
          } else if (donghuaData.data && donghuaData.data.pagination && donghuaData.data.pagination.total_pages) {
            newTotalPages.donghua = donghuaData.data.pagination.total_pages;
          }
          
          if (donghuaData && donghuaData.data && donghuaData.data.donghua) {
            const donghuaItems = Array.isArray(donghuaData.data.donghua) 
              ? donghuaData.data.donghua 
              : [donghuaData.data.donghua];
            
            // Format hasil donghua
            const formattedDonghuaResults = donghuaItems.map(item => ({
              ...item,
              contentType: 'donghua',
              url: item.url || `/donghua/${item.slug ? item.slug.replace('/', '') : ''}`,
            }));
            
            combinedResults = [...combinedResults, ...formattedDonghuaResults];
          }
        }
        
        // Proses hasil pencarian anime jika berhasil
        if (animeRes.ok) {
          const animeData = await animeRes.json();
          
          // Update total pages untuk anime jika ada
          if (animeData.pagination && animeData.pagination.total_pages) {
            newTotalPages.anime = animeData.pagination.total_pages;
          } else if (animeData.data && animeData.data.pagination && animeData.data.pagination.total_pages) {
            newTotalPages.anime = animeData.data.pagination.total_pages;
          }
          
          if (animeData && animeData.data && animeData.data.animes) {
            const animeItems = Array.isArray(animeData.data.animes) 
              ? animeData.data.animes 
              : [animeData.data.animes];
            
            // Format hasil anime
            const formattedAnimeResults = animeItems.map(item => ({
              title: item.title,
              poster: item.poster,
              slug: item.slug,
              score: item.score,
              type: item.type || 'TV',
              contentType: 'anime',
              url: item.detail_url || `/anime/${item.slug}`,
              genres: item.genres,
              status: item.status,
              views: item.views,
              synopsis: item.synopsis
            }));
            
            combinedResults = [...combinedResults, ...formattedAnimeResults];
          }
        }
        
        // Set total pages dari hasil API
        setTotalPages(newTotalPages);
        
        // Simpan semua hasil tanpa batasan jumlah
        setSearchResults(combinedResults);
        
      } catch (error) {
        console.error('Error fetching search results:', error);
        setError("Terjadi kesalahan saat mencari. Silakan coba lagi nanti.");
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSearchResults();
  }, [query, currentPage]);
  
  // Filter hasil berdasarkan tab aktif
  const filteredResults = searchResults.filter(item => {
    if (activeTab === "all") return true;
    return item.contentType === activeTab;
  });
  
  // Menformat jumlah views
  const formatViews = (views) => {
    if (!views) return "0";
    if (views >= 1000000) {
      return (views / 1000000).toFixed(1) + "M";
    } else if (views >= 1000) {
      return (views / 1000).toFixed(1) + "K";
    }
    return views.toString();
  };

  // Handler untuk navigasi pagination
  const handlePageChange = (newPage) => {
    router.push(`/search?q=${encodeURIComponent(query)}&page=${newPage}`);
  };
  
  // Tentukan max pages berdasarkan tab yang aktif
  const getMaxPages = () => {
    if (activeTab === "anime") return totalPages.anime;
    if (activeTab === "donghua") return totalPages.donghua;
    return Math.max(totalPages.anime, totalPages.donghua);
  };
  
  // Render pagination
  const renderPagination = () => {
    const maxPages = getMaxPages();
    if (maxPages <= 1) return null;
    
    // Menentukan nomor halaman mana yang ditampilkan
    let pageNumbers = [];
    const maxDisplayedPages = 5;
    
    if (maxPages <= maxDisplayedPages) {
      // Jika total halaman <= 5, tampilkan semua
      pageNumbers = Array.from({ length: maxPages }, (_, i) => i + 1);
    } else {
      // Jika total halaman > 5, tampilkan halaman sekitar halaman aktif
      if (currentPage <= 3) {
        // Awal halaman
        pageNumbers = [1, 2, 3, 4, 5];
      } else if (currentPage >= maxPages - 2) {
        // Akhir halaman
        pageNumbers = [maxPages - 4, maxPages - 3, maxPages - 2, maxPages - 1, maxPages];
      } else {
        // Tengah halaman
        pageNumbers = [
          currentPage - 2,
          currentPage - 1,
          currentPage,
          currentPage + 1,
          currentPage + 2
        ];
      }
    }
    
    return (
      <div className="mt-12 flex justify-center">
        <div className="inline-flex items-center gap-1">
          {/* Previous button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`rounded-md px-3 py-2 text-sm ${
              currentPage === 1
                ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {/* First page button jika tidak ditampilkan dalam pageNumbers */}
          {!pageNumbers.includes(1) && (
            <>
              <button
                onClick={() => handlePageChange(1)}
                className="rounded-md px-3 py-2 text-sm bg-gray-800 text-white hover:bg-gray-700"
              >
                1
              </button>
              <span className="px-2 text-gray-500">...</span>
            </>
          )}
          
          {/* Page buttons */}
          {pageNumbers.map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`rounded-md px-3 py-2 text-sm ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-white hover:bg-gray-700"
              }`}
            >
              {page}
            </button>
          ))}
          
          {/* Last page button jika tidak ditampilkan dalam pageNumbers */}
          {!pageNumbers.includes(maxPages) && (
            <>
              <span className="px-2 text-gray-500">...</span>
              <button
                onClick={() => handlePageChange(maxPages)}
                className="rounded-md px-3 py-2 text-sm bg-gray-800 text-white hover:bg-gray-700"
              >
                {maxPages}
              </button>
            </>
          )}
          
          {/* Next button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === maxPages}
            className={`rounded-md px-3 py-2 text-sm ${
              currentPage === maxPages
                ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    );
  };
  
  return (
    <main className="min-h-screen bg-[#0f1729]">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Hasil Pencarian untuk <span className="text-blue-500">"{query}"</span>
          </h1>
          <p className="text-gray-400">
            {filteredResults.length} hasil ditemukan {currentPage > 1 ? `(Halaman ${currentPage})` : ""}
          </p>
        </div>
        
        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="p-1 bg-gray-800/50 backdrop-blur-sm rounded-lg flex space-x-1">
            <button
              className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "all" 
                  ? "bg-blue-600 text-white" 
                  : "bg-transparent text-gray-300 hover:bg-gray-700/50"
              }`}
              onClick={() => setActiveTab("all")}
            >
              Semua
            </button>
            <button
              className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "anime" 
                  ? "bg-red-600 text-white" 
                  : "bg-transparent text-gray-300 hover:bg-gray-700/50"
              }`}
              onClick={() => setActiveTab("anime")}
            >
              Anime
            </button>
            <button
              className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "donghua" 
                  ? "bg-blue-600 text-white" 
                  : "bg-transparent text-gray-300 hover:bg-gray-700/50"
              }`}
              onClick={() => setActiveTab("donghua")}
            >
              Donghua
            </button>
          </div>
        </div>
        
        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400">Sedang mencari...</p>
          </div>
        )}
        
        {/* Error state */}
        {error && !isLoading && (
          <div className="text-center py-16 bg-gray-800/30 backdrop-blur-sm rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-xl font-medium text-white mb-2">Error</h3>
            <p className="text-gray-400">{error}</p>
          </div>
        )}
        
        {/* Empty results */}
        {!isLoading && !error && filteredResults.length === 0 && (
          <div className="text-center py-16 bg-gray-800/30 backdrop-blur-sm rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-xl font-medium text-white mb-2">Tidak ditemukan hasil</h3>
            <p className="text-gray-400">
              Kami tidak dapat menemukan hasil apapun untuk "{query}".
              <br />Silakan coba dengan kata kunci lain.
            </p>
          </div>
        )}
        
        {/* Search results */}
        {!isLoading && !error && filteredResults.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
            {filteredResults.map((item, index) => (
              <AnimeCard 
                key={`${item.contentType}-${item.slug}-${index}`}
                item={item}
                showGenres={true}
              />
            ))}
          </div>
        )}
        
        {/* Pagination */}
        {!isLoading && !error && filteredResults.length > 0 && renderPagination()}
      </div>
    </main>
  );
} 