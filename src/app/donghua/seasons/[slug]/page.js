"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import SeasonHeader from "@/components/SeasonHeader";
import SearchBar from "@/components/SearchBar";
import "../seasons.css";

export default function DonghuaSeasonDetailPage() {
  const params = useParams();
  const seasonSlug = params.slug;
  
  const [seasonData, setSeasonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest"); // "newest" atau "alphabetical"

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const apiKey = process.env.NEXT_PUBLIC_API_KEY;
        const response = await fetch(`https://anyapi-beta.vercel.app/v1/donghua/anichin/seasons/${seasonSlug}`, {
          headers: {
            "X-API-Key": apiKey,
          },
          cache: "no-store",
        });
        
        if (!response.ok) {
          throw new Error("Gagal mengambil data donghua untuk season ini");
        }
        
        const data = await response.json();
        setSeasonData(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching season data:", err);
        setError("Terjadi kesalahan saat mengambil data. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    if (seasonSlug) {
      fetchData();
    }
  }, [seasonSlug]);

  // Fungsi untuk mendapatkan nama yang sesuai untuk season
  const getSeasonDisplayName = (slug) => {
    if (!slug) return "";
    
    // Untuk musim
    if (slug.includes("winter") || slug.includes("spring") || slug.includes("summer") || slug.includes("fall")) {
      const parts = slug.split("-");
      if (parts.length === 2) {
        const season = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
        return `${season} ${parts[1]}`;
      }
    }
    
    // Untuk tahun
    return slug;
  };

  // Fungsi untuk mendapatkan icon dan warna berdasarkan season
  const getSeasonDetails = (season) => {
    switch (season.toLowerCase()) {
      case 'winter':
        return {
          icon: (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11,5V10.5H13V5H11M5.99,7L4.93,8.07L8.28,11.43L9.34,10.36L5.99,7M18.01,7L14.66,10.35L15.72,11.42L19.07,8.06L18.01,7M12,12A1,1 0 0,0 11,13A1,1 0 0,0 12,14A1,1 0 0,0 13,13A1,1 0 0,0 12,12M3,13V15H8V13H3M16,13V15H21V13H16M8.28,16.68L4.93,20.03L5.99,21.1L9.34,17.74L8.28,16.68M15.72,16.68L14.66,17.74L18.01,21.1L19.07,20.03L15.72,16.68M11,19.5V24H13V19.5H11Z" />
            </svg>
          ),
          gradient: 'from-blue-800 to-blue-500',
          text: 'text-blue-100',
          description: 'Musim Dingin dengan salju dan suasana yang tenang.',
          bg: 'https://images.unsplash.com/photo-1491002052546-bf38f186af56',
          bgFallback: 'bg-blue-900',
          decoration: getSeasonDecorations('winter')
        };
      case 'spring':
        return {
          icon: (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,2C14.3,2 16.3,4 16.3,6.2C16.21,8.77 14.34,9.83 14.04,10C15.04,9.5 16.5,9.5 16.5,9.5C19,9.5 21,11.3 21,13.8C21,16.3 19,18 16.5,18C16.5,18 15,18 13,17C13,17 12.7,19 15,22H9C11.3,19 11,17 11,17C9,18 7.5,18 7.5,18C5,18 3,16.3 3,13.8C3,11.3 5,9.5 7.5,9.5C7.5,9.5 8.96,9.5 9.96,10C9.66,9.83 7.79,8.77 7.7,6.2C7.7,4 9.7,2 12,2Z" />
            </svg>
          ),
          gradient: 'from-pink-700 to-pink-500',
          text: 'text-pink-100',
          description: 'Musim Semi dengan bunga-bunga bermekaran.',
          bg: 'https://images.unsplash.com/photo-1522748906645-95d8adfd52c7',
          bgFallback: 'bg-pink-900',
          decoration: getSeasonDecorations('spring')
        };
      case 'summer':
        return {
          icon: (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.55,18.54L4.96,19.95L6.76,18.16L5.34,16.74M11,22.45C11.32,22.45 13,22.45 13,22.45V19.5H11M12,5.5A6,6 0 0,0 6,11.5A6,6 0 0,0 12,17.5A6,6 0 0,0 18,11.5C18,8.18 15.31,5.5 12,5.5M20,12.5H23V10.5H20M17.24,18.16L19.04,19.95L20.45,18.54L18.66,16.74M20.45,4.46L19.04,3.05L17.24,4.84L18.66,6.26M13,0.55H11V3.5H13M4,10.5H1V12.5H4M6.76,4.84L4.96,3.05L3.55,4.46L5.34,6.26" />
            </svg>
          ),
          gradient: 'from-yellow-600 to-yellow-500',
          text: 'text-yellow-100',
          description: 'Musim Panas yang cerah dan hangat.',
          bg: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
          bgFallback: 'bg-yellow-800',
          decoration: getSeasonDecorations('summer')
        };
      case 'fall':
        return {
          icon: (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
            </svg>
          ),
          gradient: 'from-amber-800 to-amber-600',
          text: 'text-amber-100',
          description: 'Musim Gugur dengan daun-daun berwarna.',
          bg: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86',
          bgFallback: 'bg-amber-900',
          decoration: getSeasonDecorations('fall')
        };
      default:
        return {
          icon: <div className="w-6 h-6" />,
          gradient: 'from-gray-800 to-gray-600',
          text: 'text-gray-100',
          description: 'Musim tidak diketahui',
          bg: '',
          bgFallback: 'bg-gray-800',
          decoration: null
        };
    }
  };

  // Fungsi untuk memfilter donghua berdasarkan pencarian
  const getFilteredDonghua = () => {
    if (!seasonData?.data?.donghua) return [];
    if (!searchQuery.trim()) return seasonData.data.donghua;
    
    const query = searchQuery.toLowerCase().trim();
    return seasonData.data.donghua.filter(item => 
      item.title.toLowerCase().includes(query) || 
      (item.alter_title && item.alter_title.toLowerCase().includes(query))
    );
  };

  // Fungsi untuk mengurutkan donghua
  const getSortedDonghua = (donghuaList) => {
    if (!donghuaList.length) return [];
    
    const sorted = [...donghuaList];
    
    if (sortOrder === "alphabetical") {
      // Urut berdasarkan abjad (A-Z)
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    }
    
    // Default: urut berdasarkan terbaru
    return sorted;
  };

  // Fungsi untuk menangani pencarian
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Fungsi untuk menangani pengurutan
  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  if (loading) {
    return <LoadingState seasonSlug={seasonSlug} />;
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

  if (!seasonData || !seasonData.data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#0f1729]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-yellow-500 mb-2">Season Tidak Ditemukan</h2>
          <p className="text-gray-300 mb-4">Maaf, season yang Anda cari tidak tersedia.</p>
          <Link href="/donghua/seasons" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors inline-block">
            Kembali ke Daftar Season
          </Link>
        </div>
      </div>
    );
  }

  // Buat variable dari seasonSlug untuk digunakan dalam getSeasonDetails
  const getSeasonFromSlug = (slug) => {
    if (slug.includes("winter")) return "winter";
    if (slug.includes("spring")) return "spring";
    if (slug.includes("summer")) return "summer";
    if (slug.includes("fall")) return "fall";
    return "";
  };

  const currentSeason = getSeasonFromSlug(seasonSlug);
  const seasonDetails = getSeasonDetails(currentSeason);

  const seasonInfo = seasonData.data;
  const seasonDisplayName = getSeasonDisplayName(seasonSlug);
  const filteredDonghua = getFilteredDonghua();
  const sortedDonghua = getSortedDonghua(filteredDonghua);
  const totalDonghua = filteredDonghua.length;

  return (
    <div className="bg-[#0f1729] min-h-screen pb-16">
      {/* Breadcrumb Navigation */}
      <div className="bg-[#121a2e] py-3 shadow-md shadow-black/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="flex items-center text-sm flex-wrap">
              <Link href="/" className="text-gray-400 hover:text-white transition-colors">Beranda</Link>
              <span className="mx-2 text-gray-600">/</span>
              <Link href="/donghua" className="text-gray-400 hover:text-white transition-colors">Donghua</Link>
              <span className="mx-2 text-gray-600">/</span>
              <Link href="/donghua/seasons" className="text-gray-400 hover:text-white transition-colors">Season</Link>
              <span className="mx-2 text-gray-600">/</span>
              <span className="text-white font-medium">{seasonDisplayName}</span>
            </div>
            
            <SearchBar className="w-full sm:w-64 md:w-72" />
          </div>
        </div>
      </div>

      {/* Season Header */}
      <SeasonHeader 
        title={seasonDisplayName}
        totalDonghua={totalDonghua}
        backgroundImage={seasonDetails.bg}
        backgroundClass={seasonDetails.bgFallback}
        decoration={seasonDetails.decoration}
      />

      {/* Konten season (search, filter, list donghua) */}
      <div className="container mx-auto px-4 py-8">
        {/* Search dan Filter Section */}
        <div className="mb-8 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          {/* Search Box */}
          <div className="relative w-full md:max-w-md">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input 
              type="search" 
              className="w-full p-3 pl-10 text-sm text-white border border-gray-700 rounded-lg bg-gray-800/50 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Cari donghua dalam season ini..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            
          {/* Sort Options */}
          <div className="flex items-center space-x-3">
            <label htmlFor="sort-order" className="text-sm text-gray-300 whitespace-nowrap">Urutkan:</label>
              <select
              id="sort-order" 
                value={sortOrder}
                onChange={handleSortChange}
              className="text-sm text-white bg-gray-800 border border-gray-700 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="newest">Terbaru</option>
                <option value="alphabetical">A-Z</option>
              </select>
          </div>
        </div>

        {/* Donghua List */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {sortedDonghua.map((item, index) => (
            <Link key={index} href={item.url.replace("https://anyapi-beta.vercel.app/v1/donghua/anichin/detail/", "/donghua/")} className="group">
              <div className="relative overflow-hidden rounded-lg aspect-[2/3] bg-slate-800/40 shadow-lg hover:shadow-blue-900/30 hover:shadow-xl transition-all duration-300">
                  <Image 
                  src={item.poster} 
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
                  loading={index < 12 ? "eager" : "lazy"}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="absolute top-2 right-2 bg-blue-600 text-xs font-medium py-1 px-2 rounded-full backdrop-blur-sm shadow-sm">
                  {item.type}
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/95 via-black/80 to-transparent transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="line-clamp-2 text-sm font-semibold text-white mb-1 group-hover:text-blue-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    {item.status || "Ongoing"}
                  </p>
                </div>
                </div>
              </Link>
            ))}
          </div>
        
        {/* Kosong */}
        {sortedDonghua.length === 0 && (
          <div className="text-center p-8">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">Tidak Ada Hasil</h3>
            <p className="text-gray-400">Maaf, tidak ada donghua yang cocok dengan kriteria pencarian Anda</p>
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingState({ seasonSlug }) {
  // Tentukan warna gradient untuk skeleton berdasarkan jenis season dan background image
  let gradientClass = "bg-gray-800";
  let backgroundImage = "";
  
  if (seasonSlug) {
    if (seasonSlug.includes("winter")) {
      gradientClass = "bg-blue-900";
      backgroundImage = "https://images.unsplash.com/photo-1491002052546-bf38f186af56";
    } else if (seasonSlug.includes("spring")) {
      gradientClass = "bg-green-900";
      backgroundImage = "https://images.unsplash.com/photo-1522748906645-95d8adfd52c7";
    } else if (seasonSlug.includes("summer")) {
      gradientClass = "bg-yellow-900";
      backgroundImage = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e";
    } else if (seasonSlug.includes("fall")) {
      gradientClass = "bg-orange-900";
      backgroundImage = "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86";
    }
  }

  // Tentukan nama season untuk ditampilkan
  let seasonName = seasonSlug;
  if (seasonSlug) {
    if (seasonSlug.includes("winter")) {
      const year = seasonSlug.split("-")[1];
      seasonName = `Winter ${year}`;
    } else if (seasonSlug.includes("spring")) {
      const year = seasonSlug.split("-")[1];
      seasonName = `Spring ${year}`;
    } else if (seasonSlug.includes("summer")) {
      const year = seasonSlug.split("-")[1];
      seasonName = `Summer ${year}`;
    } else if (seasonSlug.includes("fall")) {
      const year = seasonSlug.split("-")[1];
      seasonName = `Fall ${year}`;
    }
  }

  return (
    <div className="bg-[#0f1729] min-h-screen pb-16">
      {/* Header Skeleton */}
      <div className="bg-[#121a2e] py-3 shadow-md shadow-black/20">
        <div className="container mx-auto px-4">
          <div className="h-4 bg-gray-700 rounded w-60 animate-pulse"></div>
        </div>
      </div>

      {/* Season Header dengan background */}
      <div className="relative bg-[#0f1729] border-b border-gray-800">
        {/* Background dengan efek blur untuk musiman */}
        {backgroundImage && (
          <div 
            className="absolute inset-0 w-full overflow-hidden h-full"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(2.5px) brightness(0.7)',
              zIndex: 0
            }}
          ></div>
        )}
        
        {/* Fallback background jika tidak ada gambar */}
        {!backgroundImage && (
          <div className={`absolute inset-0 w-full h-full ${gradientClass}`}></div>
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0f1729]/70 to-[#0f1729]/30"></div>
        
        {/* Konten utama */}
        <div className="container mx-auto px-4 py-12 relative z-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
                <span className="mr-3 text-5xl text-blue-400 opacity-80">#</span>
                <div className="h-10 bg-gray-700/50 rounded w-40 animate-pulse"></div>
              </h1>
              <div className="h-5 bg-gray-700/50 rounded w-32 animate-pulse"></div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <div className="px-4 py-2 bg-gray-700/50 rounded-md w-32 h-10 animate-pulse"></div>
              <div className="px-4 py-2 bg-gray-700/50 rounded-md w-28 h-10 animate-pulse"></div>
              <div className="px-4 py-2 bg-gray-700/50 rounded-md w-30 h-10 animate-pulse"></div>
              <div className="px-4 py-2 bg-gray-700/50 rounded-md w-24 h-10 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-8">
        {/* Search & Filter Bar Skeleton */}
        <div className="mb-8 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="h-12 bg-gray-700/50 rounded w-full md:w-96 animate-pulse"></div>
          <div className="h-12 bg-gray-700/50 rounded w-48 animate-pulse"></div>
        </div>

        {/* Donghua Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {[...Array(12)].map((_, index) => (
            <div key={index} className="rounded-lg aspect-[2/3] bg-slate-800/40 animate-pulse shadow-lg"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Fungsi untuk menampilkan dekorasi musim
function getSeasonDecorations(season) {
  switch(season.toLowerCase()) {
    case 'winter':
      return (
        <>
          <div className="absolute top-3 left-5 text-blue-100 opacity-60 animate-fall1">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11,5V10.5H13V5H11M5.99,7L4.93,8.07L8.28,11.43L9.34,10.36L5.99,7M18.01,7L14.66,10.35L15.72,11.42L19.07,8.06L18.01,7M12,12A1,1 0 0,0 11,13A1,1 0 0,0 12,14A1,1 0 0,0 13,13A1,1 0 0,0 12,12M3,13V15H8V13H3M16,13V15H21V13H16M8.28,16.68L4.93,20.03L5.99,21.1L9.34,17.74L8.28,16.68M15.72,16.68L14.66,17.74L18.01,21.1L19.07,20.03L15.72,16.68M11,19.5V24H13V19.5H11Z" />
            </svg>
          </div>
          <div className="absolute top-8 right-12 text-blue-100 opacity-70 animate-fall2">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11,5V10.5H13V5H11M5.99,7L4.93,8.07L8.28,11.43L9.34,10.36L5.99,7M18.01,7L14.66,10.35L15.72,11.42L19.07,8.06L18.01,7M12,12A1,1 0 0,0 11,13A1,1 0 0,0 12,14A1,1 0 0,0 13,13A1,1 0 0,0 12,12M3,13V15H8V13H3M16,13V15H21V13H16M8.28,16.68L4.93,20.03L5.99,21.1L9.34,17.74L8.28,16.68M15.72,16.68L14.66,17.74L18.01,21.1L19.07,20.03L15.72,16.68M11,19.5V24H13V19.5H11Z" />
            </svg>
          </div>
          <div className="absolute bottom-8 right-6 text-blue-100 opacity-60 animate-fall3">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11,5V10.5H13V5H11M5.99,7L4.93,8.07L8.28,11.43L9.34,10.36L5.99,7M18.01,7L14.66,10.35L15.72,11.42L19.07,8.06L18.01,7M12,12A1,1 0 0,0 11,13A1,1 0 0,0 12,14A1,1 0 0,0 13,13A1,1 0 0,0 12,12M3,13V15H8V13H3M16,13V15H21V13H16M8.28,16.68L4.93,20.03L5.99,21.1L9.34,17.74L8.28,16.68M15.72,16.68L14.66,17.74L18.01,21.1L19.07,20.03L15.72,16.68M11,19.5V24H13V19.5H11Z" />
            </svg>
          </div>
          <div className="absolute bottom-16 left-10 text-blue-100 opacity-70 animate-fall4">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11,5V10.5H13V5H11M5.99,7L4.93,8.07L8.28,11.43L9.34,10.36L5.99,7M18.01,7L14.66,10.35L15.72,11.42L19.07,8.06L18.01,7M12,12A1,1 0 0,0 11,13A1,1 0 0,0 12,14A1,1 0 0,0 13,13A1,1 0 0,0 12,12M3,13V15H8V13H3M16,13V15H21V13H16M8.28,16.68L4.93,20.03L5.99,21.1L9.34,17.74L8.28,16.68M15.72,16.68L14.66,17.74L18.01,21.1L19.07,20.03L15.72,16.68M11,19.5V24H13V19.5H11Z" />
            </svg>
          </div>
          <div className="absolute bottom-5 left-20 text-blue-100 opacity-60 animate-fall5">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11,5V10.5H13V5H11M5.99,7L4.93,8.07L8.28,11.43L9.34,10.36L5.99,7M18.01,7L14.66,10.35L15.72,11.42L19.07,8.06L18.01,7M12,12A1,1 0 0,0 11,13A1,1 0 0,0 12,14A1,1 0 0,0 13,13A1,1 0 0,0 12,12M3,13V15H8V13H3M16,13V15H21V13H16M8.28,16.68L4.93,20.03L5.99,21.1L9.34,17.74L8.28,16.68M15.72,16.68L14.66,17.74L18.01,21.1L19.07,20.03L15.72,16.68M11,19.5V24H13V19.5H11Z" />
            </svg>
          </div>
          <div className="absolute top-14 left-24 text-blue-100 opacity-70 animate-fall3">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11,5V10.5H13V5H11M5.99,7L4.93,8.07L8.28,11.43L9.34,10.36L5.99,7M18.01,7L14.66,10.35L15.72,11.42L19.07,8.06L18.01,7M12,12A1,1 0 0,0 11,13A1,1 0 0,0 12,14A1,1 0 0,0 13,13A1,1 0 0,0 12,12M3,13V15H8V13H3M16,13V15H21V13H16M8.28,16.68L4.93,20.03L5.99,21.1L9.34,17.74L8.28,16.68M15.72,16.68L14.66,17.74L18.01,21.1L19.07,20.03L15.72,16.68M11,19.5V24H13V19.5H11Z" />
            </svg>
          </div>
          <div className="absolute top-20 right-20 text-blue-100 opacity-70 animate-fall1">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11,5V10.5H13V5H11M5.99,7L4.93,8.07L8.28,11.43L9.34,10.36L5.99,7M18.01,7L14.66,10.35L15.72,11.42L19.07,8.06L18.01,7M12,12A1,1 0 0,0 11,13A1,1 0 0,0 12,14A1,1 0 0,0 13,13A1,1 0 0,0 12,12M3,13V15H8V13H3M16,13V15H21V13H16M8.28,16.68L4.93,20.03L5.99,21.1L9.34,17.74L8.28,16.68M15.72,16.68L14.66,17.74L18.01,21.1L19.07,20.03L15.72,16.68M11,19.5V24H13V19.5H11Z" />
            </svg>
          </div>
        </>
      );
    case 'spring':
      return (
        <>
          <div className="absolute top-5 left-6 text-pink-300 opacity-70 animate-float1">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,2C14.3,2 16.3,4 16.3,6.2C16.21,8.77 14.34,9.83 14.04,10C15.04,9.5 16.5,9.5 16.5,9.5C19,9.5 21,11.3 21,13.8C21,16.3 19,18 16.5,18C16.5,18 15,18 13,17C13,17 12.7,19 15,22H9C11.3,19 11,17 11,17C9,18 7.5,18 7.5,18C5,18 3,16.3 3,13.8C3,11.3 5,9.5 7.5,9.5C7.5,9.5 8.96,9.5 9.96,10C9.66,9.83 7.79,8.77 7.7,6.2C7.7,4 9.7,2 12,2Z" />
            </svg>
          </div>
          <div className="absolute top-10 right-7 text-pink-200 opacity-60 animate-float2">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,2C14.3,2 16.3,4 16.3,6.2C16.21,8.77 14.34,9.83 14.04,10C15.04,9.5 16.5,9.5 16.5,9.5C19,9.5 21,11.3 21,13.8C21,16.3 19,18 16.5,18C16.5,18 15,18 13,17C13,17 12.7,19 15,22H9C11.3,19 11,17 11,17C9,18 7.5,18 7.5,18C5,18 3,16.3 3,13.8C3,11.3 5,9.5 7.5,9.5C7.5,9.5 8.96,9.5 9.96,10C9.66,9.83 7.79,8.77 7.7,6.2C7.7,4 9.7,2 12,2Z" />
            </svg>
          </div>
          <div className="absolute bottom-10 right-10 text-pink-300 opacity-70 animate-float3">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,2C14.3,2 16.3,4 16.3,6.2C16.21,8.77 14.34,9.83 14.04,10C15.04,9.5 16.5,9.5 16.5,9.5C19,9.5 21,11.3 21,13.8C21,16.3 19,18 16.5,18C16.5,18 15,18 13,17C13,17 12.7,19 15,22H9C11.3,19 11,17 11,17C9,18 7.5,18 7.5,18C5,18 3,16.3 3,13.8C3,11.3 5,9.5 7.5,9.5C7.5,9.5 8.96,9.5 9.96,10C9.66,9.83 7.79,8.77 7.7,6.2C7.7,4 9.7,2 12,2Z" />
            </svg>
          </div>
          <div className="absolute bottom-6 left-8 text-pink-200 opacity-60 animate-float4">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,2C14.3,2 16.3,4 16.3,6.2C16.21,8.77 14.34,9.83 14.04,10C15.04,9.5 16.5,9.5 16.5,9.5C19,9.5 21,11.3 21,13.8C21,16.3 19,18 16.5,18C16.5,18 15,18 13,17C13,17 12.7,19 15,22H9C11.3,19 11,17 11,17C9,18 7.5,18 7.5,18C5,18 3,16.3 3,13.8C3,11.3 5,9.5 7.5,9.5C7.5,9.5 8.96,9.5 9.96,10C9.66,9.83 7.79,8.77 7.7,6.2C7.7,4 9.7,2 12,2Z" />
            </svg>
          </div>
          <div className="absolute top-20 left-16 text-pink-300 opacity-70 animate-float2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,2C14.3,2 16.3,4 16.3,6.2C16.21,8.77 14.34,9.83 14.04,10C15.04,9.5 16.5,9.5 16.5,9.5C19,9.5 21,11.3 21,13.8C21,16.3 19,18 16.5,18C16.5,18 15,18 13,17C13,17 12.7,19 15,22H9C11.3,19 11,17 11,17C9,18 7.5,18 7.5,18C5,18 3,16.3 3,13.8C3,11.3 5,9.5 7.5,9.5C7.5,9.5 8.96,9.5 9.96,10C9.66,9.83 7.79,8.77 7.7,6.2C7.7,4 9.7,2 12,2Z" />
            </svg>
          </div>
          <div className="absolute bottom-20 right-24 text-pink-200 opacity-70 animate-float3">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,2C14.3,2 16.3,4 16.3,6.2C16.21,8.77 14.34,9.83 14.04,10C15.04,9.5 16.5,9.5 16.5,9.5C19,9.5 21,11.3 21,13.8C21,16.3 19,18 16.5,18C16.5,18 15,18 13,17C13,17 12.7,19 15,22H9C11.3,19 11,17 11,17C9,18 7.5,18 7.5,18C5,18 3,16.3 3,13.8C3,11.3 5,9.5 7.5,9.5C7.5,9.5 8.96,9.5 9.96,10C9.66,9.83 7.79,8.77 7.7,6.2C7.7,4 9.7,2 12,2Z" />
            </svg>
          </div>
        </>
      );
    case 'summer':
      return (
        <>
          <div className="absolute top-6 right-6 text-yellow-300 opacity-70 animate-pulse1">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.55,18.54L4.96,19.95L6.76,18.16L5.34,16.74M11,22.45C11.32,22.45 13,22.45 13,22.45V19.5H11M12,5.5A6,6 0 0,0 6,11.5A6,6 0 0,0 12,17.5A6,6 0 0,0 18,11.5C18,8.18 15.31,5.5 12,5.5M20,12.5H23V10.5H20M17.24,18.16L19.04,19.95L20.45,18.54L18.66,16.74M20.45,4.46L19.04,3.05L17.24,4.84L18.66,6.26M13,0.55H11V3.5H13M4,10.5H1V12.5H4M6.76,4.84L4.96,3.05L3.55,4.46L5.34,6.26" />
            </svg>
          </div>
          <div className="absolute bottom-8 left-6 text-yellow-200 opacity-50 animate-pulse2">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.55,18.54L4.96,19.95L6.76,18.16L5.34,16.74M11,22.45C11.32,22.45 13,22.45 13,22.45V19.5H11M12,5.5A6,6 0 0,0 6,11.5A6,6 0 0,0 12,17.5A6,6 0 0,0 18,11.5C18,8.18 15.31,5.5 12,5.5M20,12.5H23V10.5H20M17.24,18.16L19.04,19.95L20.45,18.54L18.66,16.74M20.45,4.46L19.04,3.05L17.24,4.84L18.66,6.26M13,0.55H11V3.5H13M4,10.5H1V12.5H4M6.76,4.84L4.96,3.05L3.55,4.46L5.34,6.26" />
            </svg>
          </div>
          <div className="absolute top-20 left-20 text-yellow-300 opacity-60 animate-pulse1">
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.55,18.54L4.96,19.95L6.76,18.16L5.34,16.74M11,22.45C11.32,22.45 13,22.45 13,22.45V19.5H11M12,5.5A6,6 0 0,0 6,11.5A6,6 0 0,0 12,17.5A6,6 0 0,0 18,11.5C18,8.18 15.31,5.5 12,5.5M20,12.5H23V10.5H20M17.24,18.16L19.04,19.95L20.45,18.54L18.66,16.74M20.45,4.46L19.04,3.05L17.24,4.84L18.66,6.26M13,0.55H11V3.5H13M4,10.5H1V12.5H4M6.76,4.84L4.96,3.05L3.55,4.46L5.34,6.26" />
            </svg>
          </div>
        </>
      );
    case 'fall':
      return (
        <>
          <div className="absolute top-4 left-7 text-amber-600 opacity-70 animate-leaf1">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
            </svg>
          </div>
          <div className="absolute top-16 right-5 text-red-600 opacity-60 animate-leaf2">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
            </svg>
          </div>
          <div className="absolute bottom-12 right-8 text-yellow-700 opacity-70 animate-leaf3">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
            </svg>
          </div>
          <div className="absolute bottom-5 left-12 text-orange-700 opacity-60 animate-leaf4">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
            </svg>
          </div>
          <div className="absolute top-10 left-20 text-red-500 opacity-70 animate-leaf2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
            </svg>
          </div>
          <div className="absolute bottom-16 right-16 text-amber-500 opacity-70 animate-leaf1">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
            </svg>
          </div>
        </>
      );
    default:
      return null;
  }
} 