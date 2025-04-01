"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SearchBar from "@/components/SearchBar";

export default function DonghuaSearchPage() {
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
        const apiKey = process.env.NEXT_PUBLIC_API_KEY;
        const response = await fetch(`https://anyapi-beta.vercel.app/v1/donghua/anichin/search/${encodeURIComponent(searchQuery)}${currentPage > 1 ? `/${currentPage}` : ''}`, {
          headers: {
            "X-API-Key": apiKey,
          },
          cache: "no-store",
        });
        
        if (!response.ok) {
          throw new Error("Gagal melakukan pencarian donghua");
        }
        
        const data = await response.json();
        
        if (data && data.data) {
          setSearchResults(data.data.donghua || []);
          setPagination(data.data.pagination || null);
        } else {
          setSearchResults([]);
          setPagination(null);
        }
        
        setError(null);
      } catch (err) {
        console.error("Error searching donghua:", err);
        setError("Terjadi kesalahan saat melakukan pencarian. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery) {
      fetchData();
    }
  }, [searchQuery, currentPage]);

  // Fungsi untuk mengurutkan donghua
  const getSortedDonghua = (donghuaList) => {
    if (!donghuaList || !donghuaList.length) return [];
    
    const sorted = [...donghuaList];
    
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
    router.push(`/donghua/search/${encodeURIComponent(searchQuery)}/${page}`);
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

  const sortedResults = getSortedDonghua(searchResults);
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
              <Link href="/donghua" className="text-gray-400 hover:text-white transition-colors">Donghua</Link>
              <span className="mx-2 text-gray-600">/</span>
              <span className="text-white font-medium">Hasil Pencarian</span>
              {pagination && pagination.current_page > 1 && (
                <>
                  <span className="mx-2 text-gray-600">/</span>
                  <span className="text-white font-medium">Halaman {pagination.current_page}</span>
                </>
              )}
            </div>
            
            <SearchBar className="w-full sm:w-64 md:w-72" />
          </div>
        </div>
      </div>

      {/* Header Pencarian */}
      <div className="bg-[#0f1729] border-b border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
                <span className="mr-3 text-5xl text-blue-400 opacity-80">#</span>
                Hasil Pencarian: "{decodedQuery}"
              </h1>
              <p className="text-blue-100">
                {pagination 
                  ? `Halaman ${pagination.current_page} dari ${pagination.total_pages} · ${searchResults.length} donghua ditemukan` 
                  : `${searchResults.length} donghua ditemukan`}
              </p>
            </div>
            
            {/* Navigation Buttons */}
            <div className="flex flex-wrap gap-2">
              <Link href="/donghua" className="px-3 py-2 bg-blue-800/30 text-sm rounded-md text-blue-200 hover:bg-blue-700/30 transition-colors flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                Semua Donghua
              </Link>
              <Link href="/donghua/ongoing" className="px-3 py-2 bg-blue-800/30 text-sm rounded-md text-blue-200 hover:bg-blue-700/30 transition-colors flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
                Ongoing
              </Link>
              <Link href="/donghua/completed" className="px-3 py-2 bg-blue-800/30 text-sm rounded-md text-blue-200 hover:bg-blue-700/30 transition-colors flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Completed
              </Link>
              <Link href="/donghua/genres" className="px-3 py-2 bg-blue-800/30 text-sm rounded-md text-blue-200 hover:bg-blue-700/30 transition-colors flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                </svg>
                Genre
              </Link>
              <Link href="/donghua/seasons" className="px-3 py-2 bg-blue-800/30 text-sm rounded-md text-blue-200 hover:bg-blue-700/30 transition-colors flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                </svg>
                Seasons
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
                className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="newest">Terbaru</option>
                <option value="alphabetical">A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Donghua Grid */}
        {sortedResults.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {sortedResults.map((donghua, index) => (
              <Link 
                key={index}
                href={`/donghua/${donghua.slug}`}
                className="bg-[#121a2e] border border-gray-800 rounded-lg overflow-hidden hover:border-blue-500 transition-colors group"
              >
                <div className="aspect-[2/3] relative">
                  <Image 
                    src={donghua.poster} 
                    alt={donghua.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    quality={80}
                  />
                  {donghua.status && (
                    <div className="absolute top-2 left-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        donghua.status.toLowerCase().includes('completed') 
                          ? 'bg-green-600' 
                          : donghua.status.toLowerCase().includes('hiatus')
                            ? 'bg-yellow-600'
                            : 'bg-blue-600'
                      }`}>
                        {donghua.status}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-white font-medium line-clamp-2 group-hover:text-blue-400 transition-colors">
                    {donghua.title}
                  </h3>
                  <p className="text-gray-400 text-xs mt-1">
                    {donghua.type || "Donghua"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-[#121a2e] rounded-lg p-8 text-center">
            <div className="text-gray-400 mb-2">Tidak ada donghua yang ditemukan</div>
            <div className="text-sm text-gray-500">Coba gunakan kata kunci pencarian yang berbeda</div>
          </div>
        )}

        {/* Pagination dari API */}
        {pagination && pagination.total_pages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {/* Tombol Previous */}
              <button 
                onClick={() => goToPage(pagination.previous_page)}
                disabled={!pagination.has_previous_page}
                className={`px-4 py-2 rounded ${!pagination.has_previous_page 
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                } transition-colors`}
              >
                Sebelumnya
              </button>
              
              {/* Daftar Halaman */}
              <div className="flex flex-wrap items-center gap-1">
                {pagination.visible_pages.map((page, i) => (
                  <button
                    key={i}
                    onClick={() => goToPage(page.page)}
                    className={`w-10 h-10 rounded ${page.is_current 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                    } transition-colors`}
                  >
                    {page.page}
                  </button>
                ))}
              </div>
              
              {/* Tombol Next */}
              <button 
                onClick={() => goToPage(pagination.next_page)}
                disabled={!pagination.has_next_page}
                className={`px-4 py-2 rounded ${!pagination.has_next_page 
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
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

function LoadingState() {
  return (
    <div className="bg-[#0f1729] min-h-screen pb-16">
      {/* Header Skeleton */}
      <div className="bg-[#121a2e] py-3 shadow-md shadow-black/20">
        <div className="container mx-auto px-4">
          <div className="h-4 bg-gray-700 rounded w-60 animate-pulse"></div>
        </div>
      </div>

      {/* Search Header Skeleton */}
      <div className="bg-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="h-10 bg-gray-700 rounded w-64 mb-2 animate-pulse"></div>
          <div className="h-5 bg-gray-700 rounded w-36 animate-pulse"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-8">
        {/* Sort Bar Skeleton */}
        <div className="bg-[#121a2e] border border-gray-800 rounded-lg p-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="h-5 bg-gray-700 rounded w-48 animate-pulse"></div>
            <div className="h-10 bg-gray-700 rounded w-32 animate-pulse"></div>
          </div>
        </div>

        {/* Donghua Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {[...Array(10)].map((_, index) => (
            <div key={index} className="bg-[#121a2e] border border-gray-800 rounded-lg overflow-hidden">
              <div className="aspect-[2/3] bg-gray-700 animate-pulse"></div>
              <div className="p-3">
                <div className="h-5 bg-gray-700 rounded w-full mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-2">
            <div className="w-24 h-10 bg-gray-700 rounded animate-pulse"></div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-10 h-10 bg-gray-700 rounded animate-pulse"></div>
              ))}
            </div>
            <div className="w-24 h-10 bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
} 