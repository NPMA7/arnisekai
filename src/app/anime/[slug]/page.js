"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import { getAnimeUrl } from "@/lib/apiConfig";

export default function AnimeDetailPage() {
  const params = useParams();
  const slug = params.slug;
  
  const [animeData, setAnimeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // State untuk episode pagination dan pengurutan
  const [visibleEpisodes, setVisibleEpisodes] = useState(20);
  const [sortOrder, setSortOrder] = useState("newest"); // "newest" atau "oldest"
  const [searchQuery, setSearchQuery] = useState(""); // State untuk pencarian episode

  // Function untuk memuat lebih banyak episode
  const loadMoreEpisodes = () => {
    setVisibleEpisodes(prev => prev + 20);
  };
  
  // Function untuk mengubah urutan episode
  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };
  
  // Function untuk mendapatkan episode yang diurutkan
  const getSortedEpisodes = (episodes) => {
    if (!episodes) return [];
    
    // Clone array untuk menghindari mutasi langsung
    const sorted = [...episodes];
    
    if (sortOrder === "oldest") {
      // Urutkan dari yang terlama (episode 1 dst)
      return sorted.reverse();
    }
    
    // Default: urutkan dari yang terbaru
    return sorted;
  };
  
  // Function untuk memfilter episode berdasarkan pencarian
  const getFilteredEpisodes = (episodes) => {
    if (!episodes) return [];
    if (!searchQuery.trim()) return episodes;
    
    const query = searchQuery.toLowerCase().trim();
    return episodes.filter(episode => 
      episode.title.toLowerCase().includes(query) || 
      episode.episode.toString().includes(query)
    );
  };
  
  // Function untuk mendapatkan episode yang difilter dan diurutkan
  const getFilteredAndSortedEpisodes = (episodes) => {
    return getSortedEpisodes(getFilteredEpisodes(episodes));
  };
  
  // Function untuk handle pencarian
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setVisibleEpisodes(20); // Reset jumlah episode visible saat melakukan pencarian
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(getAnimeUrl(`detail/${slug}`), {
          cache: "no-store",
        });
        
        if (!response.ok) {
          throw new Error("Gagal mengambil data detail anime");
        }
        
        const data = await response.json();
        
        // Periksa apakah data valid dan memiliki konten yang diperlukan
        if (!data.data || !data.data.title || !data.data.poster) {
          setError("Anime tidak ditemukan");
          setAnimeData(null);
        } else {
          setAnimeData(data);
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching anime detail:", err);
        setError("Terjadi kesalahan saat mengambil data. Silakan coba lagi nanti.");
        setAnimeData(null);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchData();
    }
  }, [slug]);

  if (loading) {
    return <LoadingState />;
  }

  if (error || !animeData?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#0f1729]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-yellow-500 mb-2">Anime Tidak Ditemukan</h2>
          <p className="text-gray-300 mb-4">Maaf, anime yang Anda cari tidak tersedia.</p>
          <Link href="/anime" className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors inline-block">
            Kembali ke Daftar Anime
          </Link>
        </div>
      </div>
    );
  }

  const anime = animeData?.data;
  
  // Mendapatkan jumlah episode dari panjang daftar episode
  const episodeCount = anime.episodes?.length || 0;
  
  // Tentukan warna status berdasarkan status anime
  const statusColor = anime.information?.Status === "Completed" 
    ? "bg-green-600 text-green-100" 
    : "bg-red-600 text-red-100";

  // Sorting dan filtering episodes
  const filteredAndSortedEpisodes = getFilteredAndSortedEpisodes(anime.episodes || []);
  const displayedEpisodes = filteredAndSortedEpisodes.slice(0, visibleEpisodes);

  // Menentukan apakah perlu menampilkan tombol "Load More"
  const hasMoreEpisodes = filteredAndSortedEpisodes.length > visibleEpisodes;

  return (
    <div className="bg-[#0f1729] mx-auto p-4 min-h-screen pb-16">
      {/* Navigasi Breadcrumb */}
      <div className="container mx-auto bg-[#121a2e] py-3 shadow-md shadow-black/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="flex items-center text-sm flex-wrap">
              <Link href="/" className="text-gray-400 hover:text-white transition-colors">Beranda</Link>
              <span className="mx-2 text-gray-600">/</span>
              <Link href="/anime" className="text-gray-400 hover:text-white transition-colors">Anime</Link>
              <span className="mx-2 text-gray-600">/</span>
              <span className="text-white font-medium truncate">{anime.title}</span>
            </div>
            
            <SearchBar className="w-full sm:w-64 md:w-72" />
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 pt-8">
        {/* Hero Section - Styled like donghua */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="w-64 flex-shrink-0">
            <div className="rounded-lg overflow-hidden shadow-xl shadow-black/30 border-2 border-gray-800">
              <div className="aspect-[2/3] relative">
                <Image 
                  src={anime.poster} 
                  alt={anime.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {/* Title Section */}
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{anime.title.replace("Nonton Anime ", "")}</h1>
              {anime.information?.Japanese && (
                <h2 className="text-xl text-gray-300">{anime.information.Japanese}</h2>
              )}
            </div>
            
            {/* Tags Section */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className={`${statusColor} px-3 py-1 rounded-md text-sm font-medium`}>
                {anime.information?.Status || "Unknown"}
              </span>
              <span className="bg-gray-700 text-gray-100 px-3 py-1 rounded-md text-sm">
                {anime.information?.Type || "TV"}
              </span>
              {anime.information?.Season && anime.information.Season.length > 0 && (
                <span className="bg-gray-700 text-gray-100 px-3 py-1 rounded-md text-sm">
                  {anime.information.Season[0]}
                </span>
              )}
              <span className="bg-gray-700 text-gray-100 px-3 py-1 rounded-md text-sm">
                {episodeCount} Episode
              </span>
            </div>
            
            {/* Additional Info */}
            <div className="flex flex-wrap gap-y-2 gap-x-6 mb-6 text-sm">
              {anime.information?.Duration && (
                <div className="flex items-center text-gray-300">
                  <span className="mr-2">Durasi:</span>
                  <span className="text-white">{anime.information.Duration}</span>
                </div>
              )}
              
              {anime.information?.Released && (
                <div className="flex items-center text-gray-300">
                  <span className="mr-2">Rilis:</span>
                  <span className="text-white">{anime.information.Released}</span>
                </div>
              )}
              
              {anime.score && (
                <div className="flex items-center text-gray-300">
                  <span className="mr-2">Skor:</span>
                  <span className="text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {anime.score}
                  </span>
                </div>
              )}
            </div>
            
            {/* Genre Tags */}
            <div className="mb-6">
              <h3 className="text-white text-sm mb-2">Genre:</h3>
              <div className="flex flex-wrap gap-2">
                {anime.genres?.map((genre, index) => (
                  <Link 
                    key={index}
                    href={`/anime/genres/${genre.slug}`}
                    className="bg-red-900/60 hover:bg-red-800 text-white px-3 py-1 rounded-md text-sm transition-colors"
                  >
                    {genre.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Information Section with Synopsis */}
        <div className="mb-12 mt-8">
          <h2 className="text-2xl font-bold text-white mb-4">Informasi Anime</h2>
          <div className="bg-[#121a2e] rounded-lg p-6 shadow-xl shadow-black/10">
            <div className="grid grid-cols-1 gap-4">
              {/* Sinopsis di bagian atas */}
              <div className="bg-[#0f1729] p-4 rounded-lg mb-4">
                <h3 className="text-white text-lg font-semibold mb-2">Sinopsis</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {anime.synopsis || "Tidak ada sinopsis tersedia."}
                </p>
              </div>
              
              {/* Informasi detail anime */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {anime.information?.Japanese && (
                  <InfoItem label="Japanese" value={anime.information.Japanese} />
                )}
                {anime.information?.English && (
                  <InfoItem label="English" value={anime.information.English} />
                )}
                {anime.information?.Type && (
                  <InfoItem label="Type" value={anime.information.Type} />
                )}
                {anime.information?.Status && (
                  <InfoItem label="Status" value={anime.information.Status} />
                )}
                {anime.information?.Source && (
                  <InfoItem label="Source" value={anime.information.Source} />
                )}
                {anime.information?.Duration && (
                  <InfoItem label="Duration" value={anime.information.Duration} />
                )}
                {anime.information?.Studio && anime.information.Studio.length > 0 && (
                  <InfoItem label="Studio" value={anime.information.Studio.join(', ')} />
                )}
                {anime.information?.Producers && anime.information.Producers.length > 0 && (
                  <InfoItem label="Producers" value={anime.information.Producers.join(', ')} />
                )}
                {anime.information?.Released && (
                  <InfoItem label="Released" value={anime.information.Released} />
                )}
                {anime.information?.Season && anime.information.Season.length > 0 && (
                  <InfoItem label="Season" value={anime.information.Season.join(', ')} />
                )}
                {anime.information?.["Total Episode"] && (
                  <InfoItem label="Total Episode" value={anime.information["Total Episode"]} />
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Batch Download Section - tanpa dropdown */}
        {anime.download_episode_batch && anime.download_episode_batch.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">Download Batch</h2>
            <div className="bg-[#121a2e] rounded-lg p-4 shadow-xl shadow-black/10">
              {anime.download_episode_batch.map((batch, batchIndex) => (
                <div key={batchIndex} className="mb-4 last:mb-0 bg-[#0f1729] rounded-lg p-4">
                  <h3 className="text-white font-medium mb-3">{batch.title}</h3>
                  <div>
                    <Link 
                      href={`/anime/download/${batch.slug}`}
                      className="inline-block bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded text-sm transition-colors"
                    >
                      Download Batch
                    </Link>
                    <p className="text-xs text-gray-400 mt-2">
                      Klik tombol di atas untuk melihat semua link download batch untuk anime ini.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Batch Download Button jika tidak ada di download_episode_batch */}
        {(!anime.download_episode_batch || anime.download_episode_batch.length === 0) && 
          anime.information?.Status === "Completed" && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">Download Batch</h2>
            <div className="bg-[#121a2e] rounded-lg p-4 shadow-xl shadow-black/10">
              <div className="bg-[#0f1729] rounded-lg p-4">
                <h3 className="text-white font-medium mb-3">
                  {anime.title.replace("Nonton Anime ", "")} Batch Subtitle Indonesia
                </h3>
                <div>
                  <p className="text-gray-400 text-sm">
                    Download batch belum tersedia untuk anime ini. Silakan gunakan download per episode.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Episodes Section */}
        {anime.episodes && anime.episodes.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">Daftar Episode</h2>
            <div className="bg-[#121a2e] rounded-xl p-5 shadow-xl shadow-black/10">
              <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-xl text-white font-semibold">
                  {anime.title.replace("Nonton Anime ", "")} Episode List
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Search episode */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Cari episode..."
                      className="bg-[#0f1729] border border-gray-700 rounded-md px-3 py-1.5 w-full sm:w-44 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-600 pl-8"
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  
                  {/* Sort order */}
                  <select
                    className="bg-[#0f1729] border border-gray-700 rounded-md px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                    value={sortOrder}
                    onChange={handleSortChange}
                  >
                    <option value="newest">Terbaru Dulu</option>
                    <option value="oldest">Terlama Dulu</option>
                  </select>
                </div>
              </div>
              
              {/* Episode List */}
              <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {displayedEpisodes.map((episode, index) => (
                  <Link 
                    key={index}
                    href={`/anime/watch/${episode.slug}`}
                    className="flex items-center gap-3 p-3 rounded-lg bg-[#0f1729] hover:bg-red-900/30 transition-colors border border-gray-800 hover:border-red-800"
                  >
                    <div className="flex-shrink-0 rounded bg-red-900 w-10 h-10 flex items-center justify-center text-white font-medium">
                      {episode.episode}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white text-sm font-medium truncate">{episode.title}</h4>
                      <p className="text-xs text-gray-400">{episode.date}</p>
                    </div>
                    <div className="flex-shrink-0 text-red-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
              
              {/* Load More Button */}
              {hasMoreEpisodes && (
                <div className="mt-6 text-center">
                  <button
                    onClick={loadMoreEpisodes}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white font-medium transition-colors"
                  >
                    Muat Lebih Banyak
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Recommendations Section */}
        {anime.recommendations && anime.recommendations.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">Rekomendasi Anime</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {anime.recommendations.map((rec, index) => (
                <Link 
                  key={index} 
                  href={`/anime/${rec.slug}`}
                  className="group"
                >
                  <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-800 shadow-lg hover:shadow-red-900/30 transition-all duration-300">
                    <Image 
                      src={rec.poster}
                      alt={rec.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                    
                    {rec.score && (
                      <div className="absolute top-2 left-2 bg-yellow-600/90 text-white text-xs px-1.5 py-0.5 rounded-sm flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-0.5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {rec.score}
                      </div>
                    )}
                    
                    {rec.episode && (
                      <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-sm">
                        {rec.episode}
                      </div>
                    )}
                    
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h4 className="text-white text-sm font-medium line-clamp-2 group-hover:text-red-300 transition-colors">
                        {rec.title}
                      </h4>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="flex gap-2 items-start">
      <span className="text-gray-400 text-sm min-w-24">{label}:</span>
      <span className="text-white text-sm flex-1">{value}</span>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="bg-[#0f1729] mx-auto p-4 min-h-screen pb-16">
      {/* Breadcrumb skeleton */}
      <div className="container mx-auto bg-[#121a2e] py-3 shadow-md shadow-black/20">
        <div className="container mx-auto p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="flex items-center text-sm flex-wrap">
              <div className="h-4 bg-slate-700 w-16 rounded animate-pulse"></div>
              <span className="mx-2 text-gray-600">/</span>
              <div className="h-4 bg-slate-700 w-20 rounded animate-pulse"></div>
              <span className="mx-2 text-gray-600">/</span>
              <div className="h-4 bg-slate-700 w-32 rounded animate-pulse"></div>
            </div>
            <div className="h-8 bg-slate-700 w-full sm:w-64 md:w-72 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto p-4 pt-8">
        {/* Hero Section Skeleton */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster Skeleton */}
          <div className="w-64 flex-shrink-0">
            <div className="aspect-[2/3] bg-slate-800 rounded-lg animate-pulse"></div>
          </div>
          
          {/* Info Skeleton */}
          <div className="flex-1">
            <div className="h-8 bg-slate-800 w-3/4 rounded mb-3 animate-pulse"></div>
            <div className="h-6 bg-slate-800 w-1/2 rounded mb-6 animate-pulse"></div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              <div className="h-6 bg-slate-800 w-20 rounded-md animate-pulse"></div>
              <div className="h-6 bg-slate-800 w-16 rounded-md animate-pulse"></div>
              <div className="h-6 bg-slate-800 w-24 rounded-md animate-pulse"></div>
              <div className="h-6 bg-slate-800 w-28 rounded-md animate-pulse"></div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              <div className="h-7 bg-slate-800 w-16 rounded animate-pulse"></div>
              <div className="h-7 bg-slate-800 w-20 rounded animate-pulse"></div>
              <div className="h-7 bg-slate-800 w-24 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
        
        {/* Info Section with Synopsis Skeleton */}
        <div className="mt-8 mb-12">
          <div className="h-6 bg-slate-800 w-48 rounded mb-4 animate-pulse"></div>
          <div className="bg-[#121a2e] rounded-lg p-6">
            {/* Synopsis skeleton */}
            <div className="bg-[#0f1729] p-4 rounded-lg mb-4">
              <div className="h-5 bg-slate-800 w-36 rounded mb-2 animate-pulse"></div>
              <div className="h-4 bg-slate-800 w-full rounded mb-2 animate-pulse"></div>
              <div className="h-4 bg-slate-800 w-full rounded mb-2 animate-pulse"></div>
              <div className="h-4 bg-slate-800 w-3/4 rounded animate-pulse"></div>
            </div>
            
            {/* Info items skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex gap-2">
                  <div className="h-4 bg-slate-800 w-24 rounded animate-pulse"></div>
                  <div className="h-4 bg-slate-800 w-full rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Batch Download Skeleton */}
        <div className="mb-12">
          <div className="h-6 bg-slate-800 w-48 rounded mb-4 animate-pulse"></div>
          <div className="bg-[#121a2e] rounded-lg p-4">
            <div className="bg-[#0f1729] p-4 rounded-lg">
              <div className="h-5 bg-slate-800 w-56 rounded mb-3 animate-pulse"></div>
              <div className="h-9 bg-slate-800 w-36 rounded mb-2 animate-pulse"></div>
              <div className="h-3 bg-slate-800 w-48 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
        
        {/* Episodes Section Skeleton */}
        <div className="mb-12">
          <div className="h-6 bg-slate-800 w-48 rounded mb-4 animate-pulse"></div>
          <div className="bg-[#121a2e] rounded-xl p-5">
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="h-6 bg-slate-800 w-36 rounded animate-pulse"></div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="h-8 bg-slate-800 w-44 rounded animate-pulse"></div>
                <div className="h-8 bg-slate-800 w-32 rounded animate-pulse"></div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-[#0f1729] animate-pulse">
                  <div className="flex-shrink-0 rounded bg-slate-800 w-10 h-10"></div>
                  <div className="flex-1 min-w-0">
                    <div className="h-4 bg-slate-800 w-3/4 rounded mb-2"></div>
                    <div className="h-3 bg-slate-800 w-1/2 rounded"></div>
                  </div>
                  <div className="flex-shrink-0 bg-slate-800 w-5 h-5 rounded-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Recommendations Section Skeleton */}
        <div className="mb-12">
          <div className="h-6 bg-slate-800 w-48 rounded mb-4 animate-pulse"></div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-lg aspect-[2/3] bg-slate-800 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 