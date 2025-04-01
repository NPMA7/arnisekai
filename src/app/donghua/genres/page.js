"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import SearchBar from "@/components/SearchBar";
export default function DonghuaGenresPage() {
  const [genresData, setGenresData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const apiKey = process.env.NEXT_PUBLIC_API_KEY;
        const response = await fetch(`https://anyapi-beta.vercel.app/v1/donghua/anichin/genres`, {
          headers: {
            "X-API-Key": apiKey,
          },
          cache: "no-store",
        });
        
        if (!response.ok) {
          throw new Error("Gagal mengambil data genre donghua");
        }
        
        const data = await response.json();
        setGenresData(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching genre data:", err);
        setError("Terjadi kesalahan saat mengambil data. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fungsi untuk memfilter genre berdasarkan pencarian
  const getFilteredGenres = () => {
    if (!genresData?.data) return [];
    if (!searchQuery.trim()) return genresData.data;
    
    const query = searchQuery.toLowerCase().trim();
    return genresData.data.filter(genre => 
      genre.name.toLowerCase().includes(query) || 
      genre.slug.toLowerCase().includes(query)
    );
  };

  // Fungsi untuk menangani pencarian
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
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

  const filteredGenres = getFilteredGenres();

  return (
    <div className="bg-[#0f1729] min-h-screen pb-16">
   
      {/* Header Section */}
      <div className="bg-[#121a2e] py-3 shadow-md shadow-black/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="flex items-center text-sm">
              <Link href="/" className="text-gray-400 hover:text-white transition-colors">Beranda</Link>
              <span className="mx-2 text-gray-600">/</span>
              <Link href="/donghua" className="text-gray-400 hover:text-white transition-colors">Donghua</Link>
              <span className="mx-2 text-gray-600">/</span>
              <span className="text-white font-medium">Genre</span>
            </div>
            
            <SearchBar className="w-full sm:w-64 md:w-72" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-white mb-0">Daftar Genre Donghua</h1>
          
          {/* Navigation Buttons */}
          <div className="flex space-x-2">
            <Link href="/donghua" className="px-3 py-2 bg-blue-800/30 text-sm rounded-md text-blue-200 hover:bg-blue-700/30 transition-colors flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              Semua Donghua
            </Link>
            <Link href="/donghua?status=ongoing" className="px-3 py-2 bg-blue-800/30 text-sm rounded-md text-blue-200 hover:bg-blue-700/30 transition-colors flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
              Ongoing
            </Link>
            <Link href="/donghua?status=completed" className="px-3 py-2 bg-blue-800/30 text-sm rounded-md text-blue-200 hover:bg-blue-700/30 transition-colors flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Completed
            </Link>
            <Link href="/donghua/seasons" className="px-3 py-2 bg-blue-800/30 text-sm rounded-md text-blue-200 hover:bg-blue-700/30 transition-colors flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              Seasons
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-lg">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text"
              placeholder="Cari genre donghua..."
              className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg block w-full pl-10 p-3 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Genres Grid */}
        {filteredGenres.length > 0 ? (
          <div className="bg-[#121a2e] border border-gray-800 rounded-lg overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 divide-x divide-y divide-gray-800">
              {filteredGenres.map((genre, index) => (
                <Link 
                  key={index}
                  href={`/donghua/genres/${genre.slug}`}
                  className="p-4 hover:bg-gray-800/50 transition-colors flex items-center justify-between group"
                >
                  <div>
                    <h3 className="text-white font-medium group-hover:text-blue-400 transition-colors">{genre.name}</h3>
                    <p className="text-gray-400 text-sm">
                      {genre.count} Donghua
                    </p>
                  </div>
                  <div className="text-gray-500 group-hover:text-blue-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-[#121a2e] rounded-lg p-8 text-center">
            <div className="text-gray-400 mb-2">Tidak ada genre yang ditemukan</div>
            <div className="text-sm text-gray-500">Coba gunakan kata kunci pencarian yang berbeda</div>
          </div>
        )}

        {/* Information Section */}
        <div className="mt-12 bg-[#121a2e] border border-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Tentang Genre Donghua</h2>
          <p className="text-gray-300 mb-4">
            Donghua memiliki beragam genre yang unik dan menarik, mencerminkan kekayaan budaya dan mitologi Tiongkok. 
            Dari cultivation martial arts yang populer, hingga xianxia (fantasi immortal), 
            donghua menawarkan pengalaman yang berbeda dari anime Jepang.
          </p>
          <p className="text-gray-300">
            Pilih salah satu genre di atas untuk melihat daftar donghua yang termasuk dalam kategori tersebut. 
            Anda juga dapat menggunakan kotak pencarian untuk menemukan genre spesifik yang Anda minati.
          </p>
        </div>
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

      <div className="container mx-auto px-4 pt-8">
        <div className="h-10 bg-gray-700 rounded w-64 mb-8 animate-pulse"></div>

        {/* Search Bar Skeleton */}
        <div className="h-12 bg-gray-700 rounded max-w-lg mb-8 animate-pulse"></div>

        {/* Genres List Skeleton */}
        <div className="bg-[#121a2e] border border-gray-800 rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 divide-x divide-y divide-gray-800">
            {[...Array(16)].map((_, index) => (
              <div key={index} className="p-4 flex items-center justify-between">
                <div>
                  <div className="h-5 bg-gray-700 rounded w-24 sm:w-32 md:w-40 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-700 rounded w-16 sm:w-20 animate-pulse"></div>
                </div>
                <div className="w-5 h-5 bg-gray-700 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 