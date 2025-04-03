"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import { getAnimeUrl } from "@/lib/apiConfig";

export default function WatchAnimePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug;

  const [episodeData, setEpisodeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedServer, setSelectedServer] = useState(null);
  const [selectedQuality, setSelectedQuality] = useState("all");
  const [selectedDownloadType, setSelectedDownloadType] = useState("mkv");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest"); // "newest" atau "oldest"
  const [showServerDropdown, setShowServerDropdown] = useState(false);
  const [showDownloadFormatDropdown, setShowDownloadFormatDropdown] = useState(false);
  const [expandedQualityIndex, setExpandedQualityIndex] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(getAnimeUrl(`episode/${slug}`), {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Gagal mengambil data episode");
        }

        const data = await response.json();
        setEpisodeData(data);

        // Set server default ke main_url
        if (data?.data?.streaming?.main_url) {
          setSelectedServer(data.data.streaming.main_url);
        } else if (data?.data?.streaming?.servers?.length > 0) {
          setSelectedServer(data.data.streaming.servers[0]);
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching episode data:", err);
        setError(
          "Terjadi kesalahan saat mengambil data. Silakan coba lagi nanti."
        );
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchData();
    }
  }, [slug]);

  // Toggle fungsi untuk dropdown
  const toggleServerDropdown = () => {
    setShowServerDropdown(!showServerDropdown);
  };

  const toggleDownloadFormatDropdown = () => {
    setShowDownloadFormatDropdown(!showDownloadFormatDropdown);
  };

  const toggleQualityExpand = (index) => {
    if (expandedQualityIndex === index) {
      setExpandedQualityIndex(null);
    } else {
      setExpandedQualityIndex(index);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.server-dropdown') && !e.target.closest('.format-dropdown')) {
        setShowServerDropdown(false);
        setShowDownloadFormatDropdown(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);
    
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

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

  const episodeInfo = episodeData?.data;
  if (!episodeInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#0f1729]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-yellow-500 mb-2">
            Episode Tidak Ditemukan
          </h2>
          <p className="text-gray-300 mb-4">
            Maaf, episode yang Anda cari tidak tersedia.
          </p>
          <Link
            href="/anime"
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors inline-block"
          >
            Kembali ke Daftar Anime
          </Link>
        </div>
      </div>
    );
  }

  // Fungsi untuk memfilter episode berdasarkan pencarian
  const getFilteredEpisodes = (episodes) => {
    if (!episodes) return [];
    if (!searchQuery.trim()) return episodes;

    const query = searchQuery.toLowerCase().trim();
    return episodes.filter(
      (episode) => 
        episode.title.toLowerCase().includes(query) ||
        episode.episode?.toString().includes(query)
    );
  };

  // Fungsi untuk mendapatkan episode yang diurutkan
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

  // Fungsi untuk mendapatkan episode yang difilter dan diurutkan
  const getFilteredAndSortedEpisodes = (episodes) => {
    return getSortedEpisodes(getFilteredEpisodes(episodes));
  };

  // Fungsi untuk menangani pencarian
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Fungsi untuk menangani pengurutan
  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  // Fungsi untuk menangani navigasi episode
  const navigateToEpisode = (slug) => {
    if (slug) {
      router.push(`/anime/watch/${slug}`);
    }
  };

  // Mengambil semua server streaming yang tersedia
  const streamingServers = episodeInfo.streaming?.servers || [];
  
  // Ekstrak nomor episode dari slug URL
  const extractEpisodeNumber = () => {
    // Coba ekstrak dari slug
    const episodeMatch = slug.match(/episode-(\d+)/i);
    if (episodeMatch && episodeMatch[1]) {
      return episodeMatch[1];
    }
    
    // Jika tidak ditemukan, cari episode saat ini dalam daftar episode
    const currentEpisode = episodeInfo.episode_list?.find(ep => ep.slug === slug);
    if (currentEpisode) {
      const titleMatch = currentEpisode.title.match(/Episode\s+(\d+)/i);
      if (titleMatch && titleMatch[1]) {
        return titleMatch[1];
      }
    }
    
    // Jika masih tidak ditemukan, coba cari dari navigation
    if (episodeInfo.navigation?.previous_episode?.slug) {
      const prevMatch = episodeInfo.navigation.previous_episode.slug.match(/episode-(\d+)/i);
      if (prevMatch && prevMatch[1]) {
        // Nomor episode sekarang adalah 1 lebih besar dari previous
        return String(parseInt(prevMatch[1]) + 1);
      }
    }
    
    if (episodeInfo.navigation?.next_episode?.slug) {
      const nextMatch = episodeInfo.navigation.next_episode.slug.match(/episode-(\d+)/i);
      if (nextMatch && nextMatch[1]) {
        // Nomor episode sekarang adalah 1 lebih kecil dari next
        return String(parseInt(nextMatch[1]) - 1);
      }
    }
    
    // Cek jika konten adalah movie berdasarkan judul atau informasi lain
    const isMovie = episodeInfo.title?.toLowerCase().includes('movie') || 
                    slug.toLowerCase().includes('movie') || 
                    episodeInfo.information?.Type?.toLowerCase()?.includes('movie');
    
    // Jika ini adalah movie, gunakan default episode 1
    if (isMovie) {
      return "1";
    }
    
    return "?";
  };
  
  // Tentukan nomor episode dengan cara yang lebih akurat
  const episodeNumber = extractEpisodeNumber();
  
  // Mendapatkan detail anime dari judul episode atau title
  const animeTitle = episodeInfo.title || "";

  // Format judul episode dengan nomor yang jelas
  const formattedEpisodeTitle = `${animeTitle} - Episode ${episodeNumber}`;

  // Format judul untuk breadcrumb
  const seriesTitle = animeTitle.replace(/Season\s+\d+/i, "").trim();
  const seasonInfo = animeTitle.match(/Season\s+\d+/i)?.[0] || "";

  // Mengambil download links yang tersedia
  const downloadTypes = Object.keys(episodeInfo.download || {});

  return (
    <div className="bg-[#0f1729] min-h-screen pb-16">
      {/* Navigasi Breadcrumb */}
      <div className="bg-[#121a2e] py-3 shadow-md shadow-black/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="flex items-center text-sm flex-wrap">
              <Link
                href="/"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Beranda
              </Link>
              <span className="mx-2 text-gray-600">/</span>
              <Link
                href="/anime"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Anime
              </Link>
              <span className="mx-2 text-gray-600">/</span>
              <Link
                href={`/anime/${episodeInfo.slug}`}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {seriesTitle} {seasonInfo && <span className="text-gray-400">{seasonInfo}</span>}
              </Link>
              <span className="mx-2 text-gray-600">/</span>
              <span className="text-white font-medium flex items-center">
                <span className="mr-1">Episode {episodeNumber}</span>
              </span>
            </div>

            <SearchBar className="w-full sm:w-64 md:w-72" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Main Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-6 flex flex-wrap items-center">
          {animeTitle} 
          <span className="mx-3 flex items-center">
            <span className="bg-red-600 text-white px-3 py-1 rounded-md text-xl md:text-2xl inline-flex items-center">
              <span className="mr-1 text-sm font-normal">EP</span>
              {episodeNumber}
            </span>
          </span>
        </h1>

        {/* Player Section */}
        <div className="mb-8">
          <div className="bg-[#121a2e] rounded-lg shadow-xl shadow-black/20">
            {/* Navigation Bar */}
            <div className="flex flex-wrap items-center gap-3 justify-between bg-[#0f1729] p-3 border-b border-gray-800">
              <div className="flex items-center space-x-4">
                <Link
                  href={`/anime/${episodeInfo.slug}`}
                  className="flex items-center text-gray-200 hover:text-red-400 transition-colors text-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Info Anime
                </Link>
                <div className="h-4 w-px bg-gray-700"></div>
                <span className="text-white text-sm flex items-center">
                  <span className="text-gray-400 mr-2">{animeTitle}</span>
                  <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded flex items-center">
                    <span className="font-bold">EP</span>
                    <span className="ml-1">{episodeNumber}</span>
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={() => navigateToEpisode(episodeInfo.navigation?.previous_episode?.slug)}
                  disabled={!episodeInfo.navigation?.previous_episode?.slug}
                  className={`px-3 py-1 rounded text-sm ${
                    episodeInfo.navigation?.previous_episode?.slug
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-gray-800 text-gray-500 cursor-not-allowed"
                  } transition-colors`}
                >
                  Prev Episode
                </button>

                {/* Next Button */}
                <button
                  onClick={() => navigateToEpisode(episodeInfo.navigation?.next_episode?.slug)}
                  disabled={!episodeInfo.navigation?.next_episode?.slug}
                  className={`px-3 py-1 rounded text-sm ${
                    episodeInfo.navigation?.next_episode?.slug
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-gray-800 text-gray-500 cursor-not-allowed"
                  } transition-colors`}
                >
                  Next Episode
                </button>
              </div>
            </div>

            {/* Video Player */}
            <div className="aspect-video w-full bg-black relative">
              {selectedServer && selectedServer.url ? (
                <iframe
                  src={selectedServer.url}
                  className="w-full h-full"
                  allowFullScreen
                  frameBorder="0"
                  scrolling="no"
                  title={`${episodeInfo.title} Episode Player`}
                ></iframe>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-red-500">
                  <p>Video tidak tersedia. Silakan pilih server lain.</p>
                </div>
              )}
            </div>

            {/* Server Selection Dropdown */}
            <div className="p-4 border-t border-gray-800">
              <div className="relative server-dropdown mb-4">
                <h3 className="text-white text-sm font-semibold mb-3">
                  Pilih Server:
                </h3>
                <button 
                  onClick={toggleServerDropdown}
                  className="flex justify-between items-center w-full bg-[#0f1729] border border-gray-700 hover:border-red-500 rounded-md px-4 py-2 text-left text-white"
                >
                  <span>{selectedServer ? selectedServer.server : "Pilih Server"}</span>
                  <svg 
                    className={`w-4 h-4 transition-transform ${showServerDropdown ? "transform rotate-180" : ""}`} 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showServerDropdown && (
                  <div className="absolute z-10 mt-1 w-full rounded-md bg-[#0f1729] border border-gray-700 shadow-lg">
                    <div className="py-1 max-h-60 overflow-auto">
                      {streamingServers.map((server, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSelectedServer(server);
                            setShowServerDropdown(false);
                          }}
                          className={`block px-4 py-2 text-sm w-full text-left ${
                            selectedServer === server
                              ? "bg-red-900/50 text-white"
                              : "text-gray-300 hover:bg-red-900/30"
                          }`}
                        >
                          {server.server}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="text-xs text-gray-400">
                <p>Jika video tidak dapat diputar, silakan coba server lain atau refresh halaman.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Download Section */}
        {episodeInfo.download && Object.keys(episodeInfo.download).length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">Download Episode</h2>
            <div className="bg-[#121a2e] rounded-lg overflow-hidden shadow-xl shadow-black/20">
              {/* Download Type Selection Dropdown */}
              <div className="p-4 bg-[#0f1729] border-b border-gray-800">
                <div className="relative format-dropdown mb-4">
                  <h3 className="text-white text-sm font-semibold mb-3">Format:</h3>
                  <button 
                    onClick={toggleDownloadFormatDropdown}
                    className="flex justify-between items-center w-full sm:w-64 bg-[#0f1729] border border-gray-700 hover:border-red-500 rounded-md px-4 py-2 text-left text-white"
                  >
                    <span className="capitalize">{selectedDownloadType}</span>
                    <svg 
                      className={`w-4 h-4 transition-transform ${showDownloadFormatDropdown ? "transform rotate-180" : ""}`} 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {showDownloadFormatDropdown && (
                    <div className="absolute z-10 mt-1 w-full sm:w-64 rounded-md bg-[#0f1729] border border-gray-700 shadow-lg">
                      <div className="py-1 max-h-60 overflow-auto">
                        {downloadTypes.map((type, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setSelectedDownloadType(type);
                              setShowDownloadFormatDropdown(false);
                            }}
                            className={`block px-4 py-2 text-sm w-full text-left capitalize ${
                              selectedDownloadType === type
                                ? "bg-red-900/50 text-white"
                                : "text-gray-300 hover:bg-red-900/30"
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quality Selection with Accordion */}
              <div className="p-4">
                {episodeInfo.download[selectedDownloadType]?.map((quality, qualityIndex) => (
                  <div
                    key={qualityIndex}
                    className="mb-4 last:mb-0 bg-[#0f1729] rounded-lg overflow-hidden"
                  >
                    <div 
                      className="bg-red-900/50 p-3 px-4 flex justify-between items-center cursor-pointer"
                      onClick={() => toggleQualityExpand(qualityIndex)}
                    >
                      <h4 className="text-white text-sm font-medium">
                        {quality.quality || `Kualitas ${qualityIndex + 1}`}
                      </h4>
                      <svg 
                        className={`w-4 h-4 transition-transform ${expandedQualityIndex === qualityIndex ? "transform rotate-180" : ""}`} 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    
                    {expandedQualityIndex === qualityIndex && (
                      <div className="p-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {Object.entries(quality.links || {}).map(
                          ([provider, url], linkIndex) => (
                            <a
                              key={linkIndex}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-red-900/40 hover:bg-red-800 text-white text-xs font-medium py-2 px-3 rounded text-center transition-colors"
                            >
                              {provider}
                            </a>
                          )
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Episode List */}
        {episodeInfo.episode_list && episodeInfo.episode_list.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Daftar Episode</h2>
            <div className="bg-[#121a2e] rounded-lg overflow-hidden shadow-xl shadow-black/20">
              <div className="p-4 border-b border-gray-800 flex flex-col md:flex-row justify-between md:items-center gap-3">
                <div className="text-white font-semibold">
                  {animeTitle} Episode List
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Search */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Cari episode..."
                      className="bg-[#0f1729] border border-gray-700 rounded-md px-3 py-1.5 w-full sm:w-44 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-600 pl-8"
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>

                  {/* Sort */}
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

              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {getFilteredAndSortedEpisodes(episodeInfo.episode_list).map(
                  (episode, index) => {
                    // Check if current episode
                    const isCurrentEpisode = episode.slug === slug;
                    // Ekstrak nomor episode dari judul
                    let epNumber = episode.title.match(/Episode\s+(\d+)/i)?.[1] || "?";
                    
                    // Cek jika ini adalah movie dan belum ada nomor episode
                    if (epNumber === "?" && (
                      episode.title.toLowerCase().includes('movie') ||
                      episode.slug.toLowerCase().includes('movie') ||
                      animeTitle.toLowerCase().includes('movie')
                    )) {
                      epNumber = "1";
                    }

                    return (
                      <Link
                        key={index}
                        href={`/anime/watch/${episode.slug}`}
                        className={`block rounded-lg overflow-hidden ${
                          isCurrentEpisode
                            ? "ring-2 ring-red-600"
                            : "hover:ring-1 hover:ring-red-500"
                        } transition-all`}
                      >
                        {/* Poster dengan overlay nomor episode */}
                        <div className="aspect-video relative">
                          <Image
                            src={episode.thumbnail || episodeInfo?.thumbnail || "https://via.placeholder.com/480x270?text=No+Image"}
                            alt={episode.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80"></div>
                          
                          {/* Episode number badge */}
                          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-sm">
                            Ep {epNumber}
                          </div>
                          
                          {/* Current episode indicator */}
                          {isCurrentEpisode && (
                            <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-sm">
                              Sedang Ditonton
                            </div>
                          )}
                          
                          {/* Play button */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-10 h-10 bg-red-600/80 rounded-full flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                          
                          {/* Episode title and date */}
                          <div className="absolute bottom-0 left-0 right-0 p-3">
                            <h4 className="text-white text-xs font-medium truncate">
                              Episode {epNumber}
                            </h4>
                            <p className="text-xs text-gray-400">{episode.date}</p>
                          </div>
                        </div>
                      </Link>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Disclaimer Section */}
        <div className="mb-8 text-center text-xs text-gray-500 p-4 border border-gray-800 rounded-lg bg-[#121a2e]/50">
          <p>Semua video anime di situs ini berasal dari berbagai sumber dan hanya ditampilkan untuk tujuan edukasi. Jika Anda adalah pemilik konten dan ingin konten Anda dihapus, silakan hubungi kami.</p>
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="bg-[#0f1729] min-h-screen pb-16">
      {/* Breadcrumb Skeleton */}
      <div className="bg-[#121a2e] py-3 shadow-md shadow-black/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="flex items-center text-sm flex-wrap">
              <div className="h-4 bg-slate-700 w-16 rounded animate-pulse"></div>
              <span className="mx-2 text-gray-600">/</span>
              <div className="h-4 bg-slate-700 w-20 rounded animate-pulse"></div>
              <span className="mx-2 text-gray-600">/</span>
              <div className="h-4 bg-slate-700 w-28 rounded animate-pulse"></div>
              <span className="mx-2 text-gray-600">/</span>
              <div className="h-4 bg-slate-700 w-24 rounded animate-pulse"></div>
            </div>
            <div className="h-8 bg-slate-700 w-full sm:w-64 md:w-72 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Title Skeleton */}
        <div className="h-8 bg-slate-700 w-2/3 rounded animate-pulse mb-6"></div>
      
        {/* Player Section Skeleton */}
        <div className="mb-8">
          <div className="bg-[#121a2e] rounded-lg overflow-hidden shadow-xl">
            {/* Navigation Bar Skeleton */}
            <div className="flex flex-wrap items-center gap-3 justify-between bg-[#0f1729] p-3 border-b border-gray-800">
              <div className="flex items-center space-x-4">
                <div className="h-4 bg-slate-700 w-20 rounded animate-pulse"></div>
                <div className="h-4 w-px bg-gray-700"></div>
                <div className="h-4 bg-slate-700 w-40 rounded animate-pulse"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 bg-slate-700 w-24 rounded animate-pulse"></div>
                <div className="h-8 bg-slate-700 w-24 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Video Player Skeleton */}
            <div className="aspect-video w-full bg-black/40 animate-pulse"></div>

            {/* Server Selection Skeleton */}
            <div className="p-4 border-t border-gray-800">
              <div className="h-5 bg-slate-700 w-24 rounded mb-3 animate-pulse"></div>
              <div className="h-10 bg-slate-700 rounded-md w-full sm:w-64 animate-pulse"></div>
              <div className="h-4 bg-slate-700 w-full rounded mt-4 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Download Section Skeleton */}
        <div className="mb-12">
          <div className="h-6 bg-slate-700 w-40 rounded animate-pulse mb-4"></div>
          <div className="bg-[#121a2e] rounded-lg overflow-hidden shadow-xl">
            {/* Download Type Selection Skeleton */}
            <div className="p-4 bg-[#0f1729] border-b border-gray-800">
              <div className="h-5 bg-slate-700 w-16 rounded mb-3 animate-pulse"></div>
              <div className="h-10 bg-slate-700 rounded-md w-full sm:w-64 animate-pulse"></div>
            </div>

            {/* Quality Selection Skeleton */}
            <div className="p-4">
              {[...Array(3)].map((_, qualityIndex) => (
                <div key={qualityIndex} className="mb-4 last:mb-0 bg-[#0f1729] rounded-lg overflow-hidden">
                  <div className="bg-red-900/50 p-3 px-4 flex justify-between items-center">
                    <div className="h-4 bg-slate-700 w-24 rounded animate-pulse"></div>
                    <div className="h-4 bg-slate-700 w-4 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Episode List Skeleton */}
        <div className="mb-8">
          <div className="h-6 bg-slate-700 w-40 rounded animate-pulse mb-4"></div>
          <div className="bg-[#121a2e] rounded-lg overflow-hidden shadow-xl">
            <div className="p-4 border-b border-gray-800 flex flex-col md:flex-row justify-between md:items-center gap-3">
              <div className="h-6 bg-slate-700 w-40 rounded animate-pulse"></div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="h-8 bg-slate-700 w-44 rounded animate-pulse"></div>
                <div className="h-8 bg-slate-700 w-32 rounded animate-pulse"></div>
              </div>
            </div>

            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="aspect-video bg-slate-800 rounded-lg animate-pulse relative">
                  <div className="absolute top-2 left-2 h-4 w-8 bg-slate-700 rounded-sm animate-pulse"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <div className="h-4 bg-slate-700 w-24 rounded mb-1 animate-pulse"></div>
                    <div className="h-3 bg-slate-700 w-16 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Disclaimer Section Skeleton */}
        <div className="mb-8 p-4 border border-gray-800 rounded-lg bg-[#121a2e]/50">
          <div className="h-3 bg-slate-700 w-full rounded mb-2 animate-pulse"></div>
          <div className="h-3 bg-slate-700 w-4/5 mx-auto rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
} 