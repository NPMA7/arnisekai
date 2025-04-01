"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import "./seasons.css";
import SearchBar from "@/components/SearchBar";
export default function DonghuaSeasonsPage() {
  const [seasonsData, setSeasonsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all"); // "all", "year", "season"

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const apiKey = process.env.NEXT_PUBLIC_API_KEY;
        const response = await fetch(`https://anyapi-beta.vercel.app/v1/donghua/anichin/seasons`, {
          headers: {
            "X-API-Key": apiKey,
          },
          cache: "no-store",
        });
        
        if (!response.ok) {
          throw new Error("Gagal mengambil data seasons donghua");
        }
        
        const data = await response.json();
        setSeasonsData(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching seasons data:", err);
        setError("Terjadi kesalahan saat mengambil data. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fungsi untuk memfilter season berdasarkan pencarian
  const getFilteredSeasons = () => {
    if (!seasonsData?.data?.seasons) return [];
    let filteredData = seasonsData.data.seasons;
    
    // Filter berdasarkan tipe (tahun atau musim)
    if (activeFilter === "year") {
      filteredData = filteredData.filter(season => 
        !season.value.includes("winter") && 
        !season.value.includes("spring") && 
        !season.value.includes("summer") && 
        !season.value.includes("fall"));
    } else if (activeFilter === "season") {
      filteredData = filteredData.filter(season => 
        season.value.includes("winter") || 
        season.value.includes("spring") || 
        season.value.includes("summer") || 
        season.value.includes("fall"));
    }
    
    // Filter berdasarkan pencarian
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filteredData = filteredData.filter(season => 
        season.name.toLowerCase().includes(query) || 
        season.value.toLowerCase().includes(query)
      );
    }
    
    return filteredData;
  };

  // Fungsi untuk mendapatkan ikon dan warna berdasarkan musim
  const getSeasonDetails = (seasonValue) => {
    if (seasonValue.includes("winter")) {
      return {
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-300">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11,5V10.5H13V5H11M5.99,7L4.93,8.07L8.28,11.43L9.34,10.36L5.99,7M18.01,7L14.66,10.35L15.72,11.42L19.07,8.06L18.01,7M12,12A1,1 0 0,0 11,13A1,1 0 0,0 12,14A1,1 0 0,0 13,13A1,1 0 0,0 12,12M3,13V15H8V13H3M16,13V15H21V13H16M8.28,16.68L4.93,20.03L5.99,21.1L9.34,17.74L8.28,16.68M15.72,16.68L14.66,17.74L18.01,21.1L19.07,20.03L15.72,16.68M11,19.5V24H13V19.5H11Z" />
          </svg>
        ),
        gradient: "from-blue-600 to-purple-700",
        text: "Winter",
        bg: "bg-[url('https://images.unsplash.com/photo-1491002052546-bf38f186af56')] bg-cover bg-center",
        bgFallback: "bg-blue-900/80",
        decoration: getSeasonDecorations(seasonValue)
      };
    } else if (seasonValue.includes("spring")) {
      return {
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-300">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12,2C14.3,2 16.3,4 16.3,6.2C16.21,8.77 14.34,9.83 14.04,10C15.04,9.5 16.5,9.5 16.5,9.5C19,9.5 21,11.3 21,13.8C21,16.3 19,18 16.5,18C16.5,18 15,18 13,17C13,17 12.7,19 15,22H9C11.3,19 11,17 11,17C9,18 7.5,18 7.5,18C5,18 3,16.3 3,13.8C3,11.3 5,9.5 7.5,9.5C7.5,9.5 8.96,9.5 9.96,10C9.66,9.83 7.79,8.77 7.7,6.2C7.7,4 9.7,2 12,2Z" />
          </svg>
        ),
        gradient: "from-green-600 to-teal-700",
        text: "Spring",
        bg: "bg-[url('https://images.unsplash.com/photo-1522748906645-95d8adfd52c7')] bg-cover bg-center",
        bgFallback: "bg-green-900/80",
        decoration: getSeasonDecorations(seasonValue)
      };
    } else if (seasonValue.includes("summer")) {
      return {
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-yellow-300">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
          </svg>
        ),
        gradient: "from-yellow-600 to-orange-700",
        text: "Summer",
        bg: "bg-[url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e')] bg-cover bg-center",
        bgFallback: "bg-yellow-700/80",
        decoration: getSeasonDecorations(seasonValue)
      };
    } else if (seasonValue.includes("fall")) {
      return {
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-orange-300">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
          </svg>
        ),
        gradient: "from-orange-600 to-red-700",
        text: "Fall",
        bg: "bg-[url('https://images.unsplash.com/photo-1513836279014-a89f7a76ae86')] bg-cover bg-center",
        bgFallback: "bg-orange-900/80",
        decoration: getSeasonDecorations(seasonValue)
      };
    } else {
      // Default for yearly seasons
      return {
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-300">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
        ),
        gradient: "from-gray-600 to-gray-700",
        text: "Tahun",
        bg: "",
        bgFallback: "bg-gray-800",
        decoration: null
      };
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

  const filteredSeasons = getFilteredSeasons();

  return (
    <div className="bg-[#0f1729] min-h-screen pb-16">
      {/* Header Section */}
      <div className="bg-[#121a2e] py-3 shadow-md shadow-black/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="flex items-center text-sm flex-wrap">
              <Link href="/" className="text-gray-400 hover:text-white transition-colors">Beranda</Link>
              <span className="mx-2 text-gray-600">/</span>
              <Link href="/donghua" className="text-gray-400 hover:text-white transition-colors">Donghua</Link>
              <span className="mx-2 text-gray-600">/</span>
              <span className="text-white font-medium">Seasons</span>
            </div>
            
            <SearchBar className="w-full sm:w-64 md:w-72" />
          </div>
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-[#0f1729] border-b border-gray-800">
        <div className="relative">
          <div className="container mx-auto px-4 py-12 relative z-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
                  <span className="mr-3 text-5xl text-blue-400 opacity-80">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                  </span>
                  Seasons
                </h1>
                <p className="text-gray-300">
                  Jelajahi donghua berdasarkan musim atau tahun penayangannya
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
                <Link href="/donghua" className="px-3 py-1.5 bg-blue-600/50 hover:bg-blue-600/80 text-white text-sm rounded transition-colors flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                  </svg>
                  Semua Donghua
                </Link>
                <Link href="/donghua/ongoing" className="px-3 py-1.5 bg-blue-600/50 hover:bg-blue-600/80 text-white text-sm rounded transition-colors flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                  Ongoing
                </Link>
                <Link href="/donghua/completed" className="px-3 py-1.5 bg-blue-600/50 hover:bg-blue-600/80 text-white text-sm rounded transition-colors flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Completed
                </Link>
                <Link href="/donghua/genres" className="px-3 py-1.5 bg-blue-600/50 hover:bg-blue-600/80 text-white text-sm rounded transition-colors flex items-center">
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
      </div>

      <div className="container mx-auto px-4 pt-8">
        {/* Filter & Search Bar */}
        <div className="bg-[#121a2e] border border-gray-800 rounded-lg p-4 mb-8">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            {/* Filter buttons */}
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setActiveFilter("all")} 
                className={`px-3 py-1.5 rounded text-sm transition-colors ${
                  activeFilter === "all" 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                Semua
              </button>
              <button 
                onClick={() => setActiveFilter("year")} 
                className={`px-3 py-1.5 rounded text-sm transition-colors ${
                  activeFilter === "year" 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                Tahun
              </button>
              <button 
                onClick={() => setActiveFilter("season")} 
                className={`px-3 py-1.5 rounded text-sm transition-colors ${
                  activeFilter === "season" 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                Musim
              </button>
            </div>

           
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-300">
            Menampilkan {filteredSeasons.length} seasons
          </p>
        </div>

        {/* Seasons Grid */}
        {filteredSeasons.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredSeasons.map((season, index) => {
              const seasonDetails = getSeasonDetails(season.value);
              return (
                <Link 
                  key={index}
                  href={`/donghua/seasons/${season.value}`}
                  className="bg-[#121a2e] border border-gray-800 rounded-lg overflow-hidden hover:border-blue-500 transition-colors group relative"
                >
                  <div className={`relative ${seasonDetails.bg || seasonDetails.bgFallback} p-4 flex items-center gap-3`}>
                    <div className={`absolute inset-0 bg-gradient-to-tr opacity-60 ${seasonDetails.gradient}`}></div>
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center relative z-10">
                      {seasonDetails.icon}
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-white font-medium group-hover:text-blue-200 transition-colors text-shadow">
                        {season.name}
                      </h3>
                      <p className="text-gray-300 text-xs text-shadow">
                        {seasonDetails.text}
                      </p>
                    </div>
                  </div>
                  {seasonDetails.decoration}
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="bg-[#121a2e] rounded-lg p-8 text-center">
            <div className="text-gray-400 mb-2">Tidak ada season yang ditemukan</div>
            <div className="text-sm text-gray-500">Coba gunakan kata kunci pencarian yang berbeda</div>
          </div>
        )}

        {/* Information Section */}
        <div className="mt-12 bg-[#121a2e] border border-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Tentang Season Donghua</h2>
          <p className="text-gray-300 mb-4">
            Donghua dirilis berdasarkan musim dan tahun tertentu, mirip dengan anime Jepang. Setiap tahun dibagi menjadi empat musim:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-blue-900/30 border border-blue-900 rounded p-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11,5V10.5H13V5H11M5.99,7L4.93,8.07L8.28,11.43L9.34,10.36L5.99,7M18.01,7L14.66,10.35L15.72,11.42L19.07,8.06L18.01,7M12,12A1,1 0 0,0 11,13A1,1 0 0,0 12,14A1,1 0 0,0 13,13A1,1 0 0,0 12,12M3,13V15H8V13H3M16,13V15H21V13H16M8.28,16.68L4.93,20.03L5.99,21.1L9.34,17.74L8.28,16.68M15.72,16.68L14.66,17.74L18.01,21.1L19.07,20.03L15.72,16.68M11,19.5V24H13V19.5H11Z" />
              </svg>
              <span className="text-blue-100">Winter (Januari - Maret)</span>
            </div>
            <div className="bg-green-900/30 border border-green-900 rounded p-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12,2C14.3,2 16.3,4 16.3,6.2C16.21,8.77 14.34,9.83 14.04,10C15.04,9.5 16.5,9.5 16.5,9.5C19,9.5 21,11.3 21,13.8C21,16.3 19,18 16.5,18C16.5,18 15,18 13,17C13,17 12.7,19 15,22H9C11.3,19 11,17 11,17C9,18 7.5,18 7.5,18C5,18 3,16.3 3,13.8C3,11.3 5,9.5 7.5,9.5C7.5,9.5 8.96,9.5 9.96,10C9.66,9.83 7.79,8.77 7.7,6.2C7.7,4 9.7,2 12,2Z" />
              </svg>
              <span className="text-green-100">Spring (April - Juni)</span>
            </div>
            <div className="bg-yellow-900/30 border border-yellow-900 rounded p-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-yellow-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
              <span className="text-yellow-100">Summer (Juli - September)</span>
            </div>
            <div className="bg-orange-900/30 border border-orange-900 rounded p-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-orange-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
              </svg>
              <span className="text-orange-100">Fall (Oktober - Desember)</span>
            </div>
          </div>
          <p className="text-gray-300">
            Pilih salah satu season di atas untuk melihat daftar donghua yang dirilis pada periode tersebut. 
            Anda juga dapat menggunakan filter tahun untuk melihat semua donghua yang dirilis pada tahun tertentu.
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

      {/* Banner Skeleton */}
      <div className="bg-[#0f1729] border-b border-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="h-10 bg-gray-700 rounded w-64 mb-4 animate-pulse"></div>
          <div className="h-5 bg-gray-700 rounded w-96 animate-pulse"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-8">
        {/* Filter & Search Bar Skeleton */}
        <div className="bg-[#121a2e] border border-gray-800 rounded-lg p-4 mb-8">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex gap-2">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="h-9 bg-gray-700 rounded w-20 animate-pulse"></div>
              ))}
            </div>
            <div className="h-10 bg-gray-700 rounded w-full sm:w-64 animate-pulse"></div>
          </div>
        </div>

        {/* Results Info Skeleton */}
        <div className="mb-6">
          <div className="h-5 bg-gray-700 rounded w-40 animate-pulse"></div>
        </div>

        {/* Seasons Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-[#121a2e] border border-gray-800 rounded-lg overflow-hidden">
              <div className="h-16 bg-gray-700 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function getSeasonDecorations(season) {
  switch(season.toLowerCase()) {
    case 'winter':
      return (
        <>
          <div className="absolute top-3 left-5 text-blue-100 opacity-60 animate-fall1">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11,5V10.5H13V5H11M5.99,7L4.93,8.07L8.28,11.43L9.34,10.36L5.99,7M18.01,7L14.66,10.35L15.72,11.42L19.07,8.06L18.01,7M12,12A1,1 0 0,0 11,13A1,1 0 0,0 12,14A1,1 0 0,0 13,13A1,1 0 0,0 12,12M3,13V15H8V13H3M16,13V15H21V13H16M8.28,16.68L4.93,20.03L5.99,21.1L9.34,17.74L8.28,16.68M15.72,16.68L14.66,17.74L18.01,21.1L19.07,20.03L15.72,16.68M11,19.5V24H13V19.5H11Z" />
            </svg>
          </div>
          <div className="absolute top-8 right-12 text-blue-100 opacity-70 animate-fall2">
            <svg className="w-2 h-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11,5V10.5H13V5H11M5.99,7L4.93,8.07L8.28,11.43L9.34,10.36L5.99,7M18.01,7L14.66,10.35L15.72,11.42L19.07,8.06L18.01,7M12,12A1,1 0 0,0 11,13A1,1 0 0,0 12,14A1,1 0 0,0 13,13A1,1 0 0,0 12,12M3,13V15H8V13H3M16,13V15H21V13H16M8.28,16.68L4.93,20.03L5.99,21.1L9.34,17.74L8.28,16.68M15.72,16.68L14.66,17.74L18.01,21.1L19.07,20.03L15.72,16.68M11,19.5V24H13V19.5H11Z" />
            </svg>
          </div>
          <div className="absolute bottom-8 right-6 text-blue-100 opacity-60 animate-fall3">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11,5V10.5H13V5H11M5.99,7L4.93,8.07L8.28,11.43L9.34,10.36L5.99,7M18.01,7L14.66,10.35L15.72,11.42L19.07,8.06L18.01,7M12,12A1,1 0 0,0 11,13A1,1 0 0,0 12,14A1,1 0 0,0 13,13A1,1 0 0,0 12,12M3,13V15H8V13H3M16,13V15H21V13H16M8.28,16.68L4.93,20.03L5.99,21.1L9.34,17.74L8.28,16.68M15.72,16.68L14.66,17.74L18.01,21.1L19.07,20.03L15.72,16.68M11,19.5V24H13V19.5H11Z" />
            </svg>
          </div>
          <div className="absolute bottom-16 left-10 text-blue-100 opacity-70 animate-fall4">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11,5V10.5H13V5H11M5.99,7L4.93,8.07L8.28,11.43L9.34,10.36L5.99,7M18.01,7L14.66,10.35L15.72,11.42L19.07,8.06L18.01,7M12,12A1,1 0 0,0 11,13A1,1 0 0,0 12,14A1,1 0 0,0 13,13A1,1 0 0,0 12,12M3,13V15H8V13H3M16,13V15H21V13H16M8.28,16.68L4.93,20.03L5.99,21.1L9.34,17.74L8.28,16.68M15.72,16.68L14.66,17.74L18.01,21.1L19.07,20.03L15.72,16.68M11,19.5V24H13V19.5H11Z" />
            </svg>
          </div>
          <div className="absolute bottom-5 left-20 text-blue-100 opacity-60 animate-fall5">
            <svg className="w-2 h-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11,5V10.5H13V5H11M5.99,7L4.93,8.07L8.28,11.43L9.34,10.36L5.99,7M18.01,7L14.66,10.35L15.72,11.42L19.07,8.06L18.01,7M12,12A1,1 0 0,0 11,13A1,1 0 0,0 12,14A1,1 0 0,0 13,13A1,1 0 0,0 12,12M3,13V15H8V13H3M16,13V15H21V13H16M8.28,16.68L4.93,20.03L5.99,21.1L9.34,17.74L8.28,16.68M15.72,16.68L14.66,17.74L18.01,21.1L19.07,20.03L15.72,16.68M11,19.5V24H13V19.5H11Z" />
            </svg>
          </div>
        </>
      );
    case 'spring':
      return (
        <>
          <div className="absolute top-5 left-6 text-pink-300 opacity-70 animate-float1">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,2C14.3,2 16.3,4 16.3,6.2C16.21,8.77 14.34,9.83 14.04,10C15.04,9.5 16.5,9.5 16.5,9.5C19,9.5 21,11.3 21,13.8C21,16.3 19,18 16.5,18C16.5,18 15,18 13,17C13,17 12.7,19 15,22H9C11.3,19 11,17 11,17C9,18 7.5,18 7.5,18C5,18 3,16.3 3,13.8C3,11.3 5,9.5 7.5,9.5C7.5,9.5 8.96,9.5 9.96,10C9.66,9.83 7.79,8.77 7.7,6.2C7.7,4 9.7,2 12,2Z" />
            </svg>
          </div>
          <div className="absolute top-10 right-7 text-pink-200 opacity-60 animate-float2">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,2C14.3,2 16.3,4 16.3,6.2C16.21,8.77 14.34,9.83 14.04,10C15.04,9.5 16.5,9.5 16.5,9.5C19,9.5 21,11.3 21,13.8C21,16.3 19,18 16.5,18C16.5,18 15,18 13,17C13,17 12.7,19 15,22H9C11.3,19 11,17 11,17C9,18 7.5,18 7.5,18C5,18 3,16.3 3,13.8C3,11.3 5,9.5 7.5,9.5C7.5,9.5 8.96,9.5 9.96,10C9.66,9.83 7.79,8.77 7.7,6.2C7.7,4 9.7,2 12,2Z" />
            </svg>
          </div>
          <div className="absolute bottom-10 right-10 text-pink-300 opacity-70 animate-float3">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,2C14.3,2 16.3,4 16.3,6.2C16.21,8.77 14.34,9.83 14.04,10C15.04,9.5 16.5,9.5 16.5,9.5C19,9.5 21,11.3 21,13.8C21,16.3 19,18 16.5,18C16.5,18 15,18 13,17C13,17 12.7,19 15,22H9C11.3,19 11,17 11,17C9,18 7.5,18 7.5,18C5,18 3,16.3 3,13.8C3,11.3 5,9.5 7.5,9.5C7.5,9.5 8.96,9.5 9.96,10C9.66,9.83 7.79,8.77 7.7,6.2C7.7,4 9.7,2 12,2Z" />
            </svg>
          </div>
          <div className="absolute bottom-6 left-8 text-pink-200 opacity-60 animate-float4">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,2C14.3,2 16.3,4 16.3,6.2C16.21,8.77 14.34,9.83 14.04,10C15.04,9.5 16.5,9.5 16.5,9.5C19,9.5 21,11.3 21,13.8C21,16.3 19,18 16.5,18C16.5,18 15,18 13,17C13,17 12.7,19 15,22H9C11.3,19 11,17 11,17C9,18 7.5,18 7.5,18C5,18 3,16.3 3,13.8C3,11.3 5,9.5 7.5,9.5C7.5,9.5 8.96,9.5 9.96,10C9.66,9.83 7.79,8.77 7.7,6.2C7.7,4 9.7,2 12,2Z" />
            </svg>
          </div>
        </>
      );
    case 'summer':
      return (
        <>
          <div className="absolute top-6 right-6 text-yellow-300 opacity-70 animate-pulse1">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.55,18.54L4.96,19.95L6.76,18.16L5.34,16.74M11,22.45C11.32,22.45 13,22.45 13,22.45V19.5H11M12,5.5A6,6 0 0,0 6,11.5A6,6 0 0,0 12,17.5A6,6 0 0,0 18,11.5C18,8.18 15.31,5.5 12,5.5M20,12.5H23V10.5H20M17.24,18.16L19.04,19.95L20.45,18.54L18.66,16.74M20.45,4.46L19.04,3.05L17.24,4.84L18.66,6.26M13,0.55H11V3.5H13M4,10.5H1V12.5H4M6.76,4.84L4.96,3.05L3.55,4.46L5.34,6.26" />
            </svg>
          </div>
          <div className="absolute bottom-8 left-6 text-yellow-200 opacity-50 animate-pulse2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.55,18.54L4.96,19.95L6.76,18.16L5.34,16.74M11,22.45C11.32,22.45 13,22.45 13,22.45V19.5H11M12,5.5A6,6 0 0,0 6,11.5A6,6 0 0,0 12,17.5A6,6 0 0,0 18,11.5C18,8.18 15.31,5.5 12,5.5M20,12.5H23V10.5H20M17.24,18.16L19.04,19.95L20.45,18.54L18.66,16.74M20.45,4.46L19.04,3.05L17.24,4.84L18.66,6.26M13,0.55H11V3.5H13M4,10.5H1V12.5H4M6.76,4.84L4.96,3.05L3.55,4.46L5.34,6.26" />
            </svg>
          </div>
        </>
      );
    case 'fall':
      return (
        <>
          <div className="absolute top-4 left-7 text-amber-600 opacity-70 animate-leaf1">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
            </svg>
          </div>
          <div className="absolute top-16 right-5 text-red-600 opacity-60 animate-leaf2">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
            </svg>
          </div>
          <div className="absolute bottom-12 right-8 text-yellow-700 opacity-70 animate-leaf3">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
            </svg>
          </div>
          <div className="absolute bottom-5 left-12 text-orange-700 opacity-60 animate-leaf4">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
            </svg>
          </div>
        </>
      );
    default:
      return null;
  }
} 