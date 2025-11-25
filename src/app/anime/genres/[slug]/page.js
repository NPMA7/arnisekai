"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import { getAnimeUrl } from "@/lib/apiConfig";

export default function AnimeGenrePage() {
  const params = useParams();
  const router = useRouter();
  const genreSlug = params.slug;
  const pageParam = params.page || 1;
  
  const [animeData, setAnimeData] = useState(null);
  const [allAnime, setAllAnime] = useState([]);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [isLoadingAll, setIsLoadingAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(getAnimeUrl(`genres/${genreSlug}${pageParam > 1 ? `/${pageParam}` : ''}`), {
          cache: "no-store",
        });
        
        if (!response.ok) {
          throw new Error("Gagal mengambil data anime untuk genre ini");
        }
        
        const data = await response.json();
        setAnimeData(data);
        setError(null);

        // Fetch the genre details if we're on the first page
        if (pageParam === 1) {
          const genreResponse = await fetch(getAnimeUrl('genres'), {
            cache: "no-store",
          });
          
          // ... existing code ...
        }
      } catch (err) {
        console.error("Error fetching anime genre data:", err);
        setError("Terjadi kesalahan saat mengambil data. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [genreSlug, pageParam]);

  // Fungsi untuk mengambil semua data anime dari semua halaman
  const fetchAllAnime = async () => {
    if (!animeData?.data?.pagination?.total_pages) return;
    
    setIsLoadingAll(true);
    try {
      const totalPages = animeData.data.pagination.total_pages;
      let allItems = [];
      
      // Tambahkan anime dari halaman saat ini
      allItems = [...animeData.data.animes];
      
      // Ambil data dari halaman lain secara paralel
      const pagePromises = [];
      for (let page = 1; page <= totalPages; page++) {
        if (page === Number(pageParam)) continue; // Lewati halaman saat ini
        
        const promise = fetch(getAnimeUrl(`genres/${genreSlug}/${page}`), {
          cache: "no-store",
        })
        .then(response => response.json())
        .then(data => data.data.animes);
        
        pagePromises.push(promise);
      }
      
      // Tunggu semua Promise selesai
      const results = await Promise.all(pagePromises);
      
      // Gabungkan semua hasil
      results.forEach(items => {
        if (items && Array.isArray(items)) {
          allItems = [...allItems, ...items];
        }
      });
      
      setAllAnime(allItems);
    } catch (err) {
      console.error("Error fetching all anime:", err);
    } finally {
      setIsLoadingAll(false);
    }
  };

  const handleSearchChange = (e) => {
    const newQuery = e.target.value;
    setSearchQuery(newQuery);
    
    // Jika query tidak kosong dan kita belum dalam mode pencarian, aktifkan mode pencarian
    if (newQuery.trim() && !isSearchMode) {
      setIsSearchMode(true);
      // Ambil semua data anime jika belum diambil
      if (allAnime.length === 0) {
        fetchAllAnime();
      }
    } 
    // Jika query kosong dan kita dalam mode pencarian, nonaktifkan mode pencarian
    else if (!newQuery.trim() && isSearchMode) {
      setIsSearchMode(false);
    }
  };

  // Fungsi untuk memfilter anime berdasarkan pencarian
  const getFilteredAnime = () => {
    // Jika dalam mode pencarian, gunakan allAnime
    const sourceData = isSearchMode ? allAnime : animeData?.data?.animes || [];
    
    if (!sourceData.length) return [];
    if (!searchQuery.trim()) return sourceData;
    
    const query = searchQuery.toLowerCase().trim();
    return sourceData.filter(anime => 
      anime.title.toLowerCase().includes(query) || 
      (anime.alter_title && anime.alter_title.toLowerCase().includes(query))
    );
  };

  // Fungsi untuk menghapus pencarian
  const clearSearch = () => {
    setSearchQuery("");
    setIsSearchMode(false);
  };

  // Fungsi untuk navigasi ke halaman lain
  const goToPage = (page) => {
    if (page === 1) {
      router.push(`/anime/genres/${genreSlug}`);
    } else {
      router.push(`/anime/genres/${genreSlug}/${page}`);
    }
  };

  const filteredAnime = getFilteredAnime();

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

  if (!animeData?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#0f1729]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-yellow-500 mb-2">Genre Tidak Ditemukan</h2>
          <p className="text-gray-300 mb-4">Maaf, genre yang Anda cari tidak tersedia.</p>
          <Link href="/anime/genres" className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors inline-block">
            Kembali ke Daftar Genre
          </Link>
        </div>
      </div>
    );
  }

  const genreName = animeData?.data?.genre?.name || "";
  const capitalizedGenreName = genreName.charAt(0).toUpperCase() + genreName.slice(1);
  const totalAnime = animeData?.data?.animes?.length || 0;
  const pagination = animeData?.data?.pagination || {};
  const totalPages = pagination?.total_pages || 1;
  const currentPage = Number(pageParam);
  const totalAnimeCount = isSearchMode ? allAnime.length : (totalAnime * totalPages);

  return (
    <div className="bg-[#0f1729] mx-auto p-4 min-h-screen pb-16">
      {/* Header Section */}
      <div className="container mx-auto bg-[#121a2e] py-3 shadow-md shadow-black/20">
        <div className="container mx-auto p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="flex items-center text-sm flex-wrap">
              <Link href="/" className="text-gray-400 hover:text-white transition-colors">Beranda</Link>
              <span className="mx-2 text-gray-600">/</span>
              <Link href="/anime" className="text-gray-400 hover:text-white transition-colors">Anime</Link>
              <span className="mx-2 text-gray-600">/</span>
              <Link href="/anime/genres" className="text-gray-400 hover:text-white transition-colors">Genre</Link>
              <span className="mx-2 text-gray-600">/</span>
              {isSearchMode ? (
                <>
                  <Link href={`/anime/genres/${genreSlug}`} className="text-gray-400 hover:text-white transition-colors">{capitalizedGenreName}</Link>
                  <span className="mx-2 text-gray-600">/</span>
                  <span className="text-white font-medium">Pencarian</span>
                </>
              ) : currentPage > 1 ? (
                <>
                  <Link href={`/anime/genres/${genreSlug}`} className="text-gray-400 hover:text-white transition-colors">{capitalizedGenreName}</Link>
                  <span className="mx-2 text-gray-600">/</span>
                  <span className="text-white font-medium">Halaman {currentPage}</span>
                </>
              ) : (
                <span className="text-white font-medium">{capitalizedGenreName}</span>
              )}
            </div>
            
            <SearchBar className="w-full sm:w-64 md:w-72" />
          </div>
        </div>
      </div>

        <div className="container mx-auto p-4 pt-8">
        {/* Title and Controls */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div>
              <h1 className="flex items-center text-3xl font-bold text-white">
                <span className="text-red-500 mr-2">#</span> 
                {capitalizedGenreName}
              </h1>
              {isSearchMode ? (
                <p className="text-gray-400 mt-1">
                  Hasil pencarian · {filteredAnime.length} anime ditemukan
                </p>
              ) : (
                <p className="text-gray-400 mt-1">
                  Halaman {currentPage} dari {totalPages} · Total {totalAnime * totalPages}+ anime
                </p>
              )}
            </div>
            
            <div className="flex space-x-2">
              <Link href="/anime" className="px-3 py-2 bg-red-800/50 text-sm rounded-md text-white hover:bg-red-700/50 transition-colors flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                Semua Anime
              </Link>
              <Link href="/anime/ongoing" className="px-3 py-2 bg-red-800/50 text-sm rounded-md text-white hover:bg-red-700/50 transition-colors flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
                Ongoing
              </Link>
              <Link href="/anime/completed" className="px-3 py-2 bg-red-800/50 text-sm rounded-md text-white hover:bg-red-700/50 transition-colors flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Completed
              </Link>
              <Link href="/anime/genres" className="px-3 py-2 bg-red-800/50 text-sm rounded-md text-white hover:bg-red-700/50 transition-colors flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                </svg>
                Genre
              </Link>
            </div>
          </div>

          {/* Search bar with clear button */}
          <div className="bg-[#121a2e] border border-gray-800 rounded-lg p-4 mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input 
                type="text"
                placeholder={`Cari anime dalam genre ${capitalizedGenreName.toLowerCase()}...`}
                className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg block w-full pl-10 p-2.5 focus:ring-red-500 focus:border-red-500 outline-none"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            
            {/* Loading state for search mode */}
            {isSearchMode && isLoadingAll && (
              <div className="mt-3 py-2 px-3 bg-red-900/30 border border-red-800 rounded text-sm text-red-200 flex items-center">
                <div className="animate-spin mr-2">
                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <span>Mengambil semua data anime untuk pencarian...</span>
              </div>
            )}
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-300">
            {isSearchMode 
              ? (isLoadingAll 
                  ? `Mencari...`
                  : `Ditemukan ${filteredAnime.length} dari ${totalAnimeCount} anime`)
              : `Menampilkan ${filteredAnime.length} anime`}
          </p>
          
          {isSearchMode && !isLoadingAll && filteredAnime.length > 0 && (
            <button 
              onClick={clearSearch}
              className="text-red-400 hover:text-red-300 text-sm flex items-center"
            >
              <span>Bersihkan Pencarian</span>
              <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Anime Grid */}
        {isLoadingAll ? (
          <div className="container mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
            {[...Array(10)].map((_, index) => (
              <div key={index} className="rounded-lg aspect-[2/3] bg-gray-700 animate-pulse"></div>
            ))}
          </div>
        ) : filteredAnime.length > 0 ? (
          <div className="container mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
            {filteredAnime.map((anime, index) => (
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

                  {anime.status && (
                    <div className={`absolute top-2 left-2 backdrop-blur-sm text-xs font-medium py-1 px-2 rounded-full ${
                      anime.status.toLowerCase() === "ongoing" 
                        ? "bg-blue-600/80 text-blue-100" 
                        : anime.status.toLowerCase() === "completed" 
                          ? "bg-green-600/80 text-green-100" 
                          : "bg-black/60 text-gray-300"
                    }`}>
                      {anime.status}
                    </div>
                  )}
                  
                  {anime.score && (
                    <div className="absolute bottom-24 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm text-xs py-1 px-2 rounded-full text-yellow-400">
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
        ) : (
          <div className="bg-[#121a2e] rounded-lg p-8 text-center">
            <div className="text-gray-400 mb-2">Tidak ada anime yang ditemukan</div>
            <div className="text-sm text-gray-500">Coba gunakan kata kunci pencarian lain</div>
          </div>
        )}

        {/* Pagination - hanya tampilkan jika tidak dalam mode pencarian */}
        {!isSearchMode && totalPages > 1 && (
          <div className="container mx-auto mt-8 flex justify-center">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {/* Tombol Previous */}
              <button 
                onClick={() => goToPage(currentPage - 1)}
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
                {currentPage < totalPages && (
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    className="w-10 h-10 rounded bg-gray-700 hover:bg-gray-600 text-gray-200 transition-colors"
                  >
                    {currentPage + 1}
                  </button>
                )}
                
                {/* Ellipsis if needed */}
                {currentPage < totalPages - 2 && (
                  <span className="w-10 h-10 flex items-center justify-center text-gray-400">...</span>
                )}
                
                {/* Last page if not current and not adjacent */}
                {totalPages > 1 && currentPage < totalPages - 1 && (
                  <button
                    onClick={() => goToPage(totalPages)}
                    className="w-10 h-10 rounded bg-gray-700 hover:bg-gray-600 text-gray-200 transition-colors"
                  >
                    {totalPages}
                  </button>
                )}
              </div>
              
              {/* Tombol Next */}
              <button 
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className={`px-4 py-2 rounded ${currentPage >= totalPages 
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                  : 'bg-red-600 hover:bg-red-700 text-white'
                } transition-colors`}
              >
                Selanjutnya
              </button>
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
    <div className="bg-[#0f1729] mx-auto p-4 min-h-screen pb-16">
      {/* Header Section Skeleton */}
      <div className="container mx-auto bg-[#121a2e] py-3 shadow-md shadow-black/20">
        <div className="container mx-auto px-4">
          <div className="h-4 bg-gray-700 rounded w-60 animate-pulse"></div>
        </div>
      </div>

      <div className="container mx-auto p-4 pt-8">
        {/* Title Skeleton */}
        <div className="mb-8">
          <div className="h-8 bg-gray-700 rounded w-64 mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-700 rounded w-48 mb-6 animate-pulse"></div>
          <div className="h-10 bg-gray-700 rounded w-full md:w-2/3 animate-pulse"></div>
        </div>

        {/* Anime Grid Skeleton */}
        <div className="container mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
          {[...Array(10)].map((_, index) => (
            <div key={index} className="rounded-lg aspect-[2/3] bg-gray-700 animate-pulse"></div>
          ))}
        </div>
        
        {/* Pagination Skeleton */}
        <div className="mt-10 flex justify-center">
          <div className="h-10 bg-gray-700 rounded w-40 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
} 