"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import SearchBar from "@/components/SearchBar";

export default function DonghuaDetailPage() {
  const params = useParams();
  const slug = params.slug;
  
  const [donghuaData, setDonghuaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // State untuk dropdown batch
  const [openBatchIndexes, setOpenBatchIndexes] = useState([]);
  const [openQualities, setOpenQualities] = useState({});
  // State untuk episode pagination dan pengurutan
  const [visibleEpisodes, setVisibleEpisodes] = useState(20);
  const [sortOrder, setSortOrder] = useState("newest"); // "newest" atau "oldest"
  const [searchQuery, setSearchQuery] = useState(""); // State untuk pencarian episode

  // Toggle function untuk batch
  const toggleBatch = (index) => {
    if (openBatchIndexes.includes(index)) {
      setOpenBatchIndexes(openBatchIndexes.filter(i => i !== index));
    } else {
      setOpenBatchIndexes([...openBatchIndexes, index]);
    }
  };

  // Toggle function untuk kualitas
  const toggleQuality = (batchIndex, quality) => {
    setOpenQualities(prev => {
      const key = `${batchIndex}-${quality}`;
      const updated = { ...prev };
      if (updated[key]) {
        delete updated[key];
      } else {
        updated[key] = true;
      }
      return updated;
    });
  };

  // Check if batch is open
  const isBatchOpen = (index) => openBatchIndexes.includes(index);
  
  // Check if quality is open
  const isQualityOpen = (batchIndex, quality) => !!openQualities[`${batchIndex}-${quality}`];

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
      episode.episode.toLowerCase().includes(query) || 
      episode.episode.match(/Episode\s+(\d+)/i)?.[1]?.includes(query)
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
        const apiKey = process.env.NEXT_PUBLIC_API_KEY;
        const response = await fetch(`https://anyapi-beta.vercel.app/v1/donghua/anichin/detail/${slug}`, {
          headers: {
            "X-API-Key": apiKey,
          },
          cache: "no-store",
        });
        
        if (!response.ok) {
          throw new Error("Gagal mengambil data detail donghua");
        }
        
        const data = await response.json();
        setDonghuaData(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching donghua detail:", err);
        setError("Terjadi kesalahan saat mengambil data. Silakan coba lagi nanti.");
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

  const donghua = donghuaData?.data;
  if (!donghua) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#0f1729]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-yellow-500 mb-2">Donghua Tidak Ditemukan</h2>
          <p className="text-gray-300 mb-4">Maaf, donghua yang Anda cari tidak tersedia.</p>
          <Link href="/donghua" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors inline-block">
            Kembali ke Daftar Donghua
          </Link>
        </div>
      </div>
    );
  }

  // Mendapatkan jumlah episode dari episodes_count atau dari panjang episodes_list
  const episodeCount = donghua.episodes_count || donghua.episodes_list?.length || 0;
  
  // Tentukan warna status berdasarkan status donghua
  const statusColor = donghua.status === "Completed" 
    ? "bg-green-600 text-green-100" 
    : "bg-indigo-600 text-indigo-100";

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
              <span className="text-white font-medium truncate">{donghua.title}</span>
            </div>
            
            <SearchBar className="w-full sm:w-64 md:w-72" />
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative w-full">
        {/* Background Image (blurred) */}
        <div className="absolute inset-0">
          <Image 
            src={donghua.poster} 
            alt={donghua.title}
            fill
            className="object-cover opacity-30 blur-sm"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f1729]/70 via-[#0f1729]/80 to-[#0f1729]"></div>
        </div>
        
        {/* Content Container */}
        <div className="container mx-auto px-4 relative z-10 flex items-end pb-16 ">
          <div className="flex flex-col min-[375px]:flex-row items-start gap-8 w-full">
            {/* Poster */}
            <div className="w-48 md:w-64 flex-shrink-0 rounded-lg overflow-hidden shadow-xl shadow-black/30 border-2 border-gray-800">
              <div className="aspect-[2/3] relative">
                <Image 
                  src={donghua.poster} 
                  alt={donghua.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            
            {/* Info */}
            <div className="flex-1 text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{donghua.title}</h1>
              
              {donghua.alter_title && (
                <h2 className="text-xl text-gray-300 mb-4">{donghua.alter_title}</h2>
              )}
              
              <div className="flex flex-wrap gap-2 mb-6">
                <span className={`${statusColor} px-3 py-1 rounded-full text-sm font-medium`}>
                  {donghua.status}
                </span>
                <span className="bg-gray-700 text-gray-100 px-3 py-1 rounded-full text-sm">
                  {donghua.type}
                </span>
                {donghua.season && (
                  <span className="bg-gray-700 text-gray-100 px-3 py-1 rounded-full text-sm">
                    {donghua.season}
                  </span>
                )}
                <span className="bg-gray-700 text-gray-100 px-3 py-1 rounded-full text-sm">
                  {episodeCount} Episode
                </span>
              </div>
              
              <div className="flex flex-wrap gap-x-8 gap-y-2 mb-2 text-sm text-gray-300">
                {donghua.studio && (
                  <div>
                    <span className="text-gray-400">Studio:</span> {donghua.studio}
                  </div>
                )}
                {donghua.duration && (
                  <div>
                    <span className="text-gray-400">Durasi:</span> {donghua.duration}
                  </div>
                )}
                {donghua.network && (
                  <div>
                    <span className="text-gray-400">Network:</span> {donghua.network}
                  </div>
                )}
                {donghua.released && (
                  <div>
                    <span className="text-gray-400">Rilis:</span> {donghua.released}
                  </div>
                )}
                {donghua.updated_on && (
                  <div>
                    <span className="text-gray-400">Diperbarui:</span> {donghua.updated_on}
                  </div>
                )}
              </div>
              
              {/* Genres */}
              {donghua.genres && donghua.genres.length > 0 && (
                <div className="mt-4">
                  <span className="text-gray-400 text-sm block mb-2">Genre:</span>
                  <div className="flex flex-wrap gap-2">
                    {donghua.genres.map((genre, index) => (
                      <Link
                        key={index}
                        href={`/genre/${genre.slug}`}
                        className="bg-blue-900/40 hover:bg-blue-800/60 text-blue-200 px-3 py-1 rounded-full text-sm transition-colors"
                      >
                        {genre.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sinopsis dan Episodes */}
          <div className="col-span-1 lg:col-span-2">
            {/* Sinopsis */}
            <div className="bg-slate-800/40 backdrop-blur-sm p-6 rounded-lg mb-8">
              <h3 className="text-xl font-bold text-white mb-4">Sinopsis</h3>
              <div className="text-gray-300 leading-relaxed">
                {donghua.synopsis ? (
                  <p>{donghua.synopsis}</p>
                ) : (
                  <p className="text-gray-400 italic">Sinopsis belum tersedia untuk donghua ini.</p>
                )}
              </div>
            </div>
            
            {/* Batch Download */}
            {donghua.batch && donghua.batch.length > 0 && (
              <div className="bg-slate-800/40 backdrop-blur-sm p-6 rounded-lg mb-8">
                <h3 className="text-xl font-bold text-white mb-4">Batch Download</h3>
                
                {/* Dropdown Accordion untuk Batch */}
                <div className="space-y-3">
                  {donghua.batch.map((batchItem, batchIndex) => (
                    <div key={batchIndex} className="border border-gray-700 rounded-lg overflow-hidden">
                      {/* Header Batch dengan toggle */}
                      <button 
                        className="w-full bg-gray-800 hover:bg-gray-700 p-4 text-left flex items-center justify-between transition-colors"
                        onClick={() => toggleBatch(batchIndex)}
                      >
                        <h4 className="text-lg font-semibold text-blue-300">{batchItem.title}</h4>
                        <svg 
                          className={`w-5 h-5 text-gray-400 transition-transform ${isBatchOpen(batchIndex) ? 'transform rotate-180' : ''}`}
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {/* Konten Batch */}
                      {isBatchOpen(batchIndex) && (
                        <div className="p-4 space-y-4 bg-gray-800/30">
                          {/* 480p Links */}
                          {batchItem.links["480p"] && (
                            <div className="border border-gray-700 rounded-lg overflow-hidden">
                              <button 
                                className="w-full bg-gray-700 hover:bg-gray-600 p-3 text-left flex items-center justify-between transition-colors"
                                onClick={() => toggleQuality(batchIndex, "480p")}
                              >
                                <div className="flex items-center gap-2">
                                  <span className="bg-blue-600 text-white text-xs font-medium px-2.5 py-1 rounded">480p</span>
                                  <span className="text-gray-300 text-sm">Ukuran file lebih kecil, kualitas dasar</span>
                                </div>
                                <svg 
                                  className={`w-5 h-5 text-gray-400 transition-transform ${isQualityOpen(batchIndex, "480p") ? 'transform rotate-180' : ''}`}
                                  fill="none" 
                                  viewBox="0 0 24 24" 
                                  stroke="currentColor"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                              
                              {isQualityOpen(batchIndex, "480p") && (
                                <div className="p-3 bg-gray-700/20">
                                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                                    {batchItem.links["480p"].map((link, linkIndex) => (
                                      <a 
                                        key={linkIndex}
                                        href={link.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium px-3 py-2 rounded text-center transition-colors"
                                      >
                                        {link.server}
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                          
                          {/* 720p Links */}
                          {batchItem.links["720p"] && (
                            <div className="border border-gray-700 rounded-lg overflow-hidden">
                              <button 
                                className="w-full bg-gray-700 hover:bg-gray-600 p-3 text-left flex items-center justify-between transition-colors"
                                onClick={() => toggleQuality(batchIndex, "720p")}
                              >
                                <div className="flex items-center gap-2">
                                  <span className="bg-indigo-600 text-white text-xs font-medium px-2.5 py-1 rounded">720p</span>
                                  <span className="text-gray-300 text-sm">Ukuran file sedang, kualitas baik</span>
                                </div>
                                <svg 
                                  className={`w-5 h-5 text-gray-400 transition-transform ${isQualityOpen(batchIndex, "720p") ? 'transform rotate-180' : ''}`}
                                  fill="none" 
                                  viewBox="0 0 24 24" 
                                  stroke="currentColor"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                              
                              {isQualityOpen(batchIndex, "720p") && (
                                <div className="p-3 bg-gray-700/20">
                                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                                    {batchItem.links["720p"].map((link, linkIndex) => (
                                      <a 
                                        key={linkIndex}
                                        href={link.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium px-3 py-2 rounded text-center transition-colors"
                                      >
                                        {link.server}
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                          
                          {/* 1080p Links */}
                          {batchItem.links["1080p"] && (
                            <div className="border border-gray-700 rounded-lg overflow-hidden">
                              <button 
                                className="w-full bg-gray-700 hover:bg-gray-600 p-3 text-left flex items-center justify-between transition-colors"
                                onClick={() => toggleQuality(batchIndex, "1080p")}
                              >
                                <div className="flex items-center gap-2">
                                  <span className="bg-purple-600 text-white text-xs font-medium px-2.5 py-1 rounded">1080p</span>
                                  <span className="text-gray-300 text-sm">Ukuran file besar, kualitas terbaik</span>
                                </div>
                                <svg 
                                  className={`w-5 h-5 text-gray-400 transition-transform ${isQualityOpen(batchIndex, "1080p") ? 'transform rotate-180' : ''}`}
                                  fill="none" 
                                  viewBox="0 0 24 24" 
                                  stroke="currentColor"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                              
                              {isQualityOpen(batchIndex, "1080p") && (
                                <div className="p-3 bg-gray-700/20">
                                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                                    {batchItem.links["1080p"].map((link, linkIndex) => (
                                      <a 
                                        key={linkIndex}
                                        href={link.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium px-3 py-2 rounded text-center transition-colors"
                                      >
                                        {link.server}
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Daftar Episode */}
            {donghua.episodes_list && donghua.episodes_list.length > 0 && (
              <div className="bg-slate-800/40 backdrop-blur-sm p-6 rounded-lg">
                <h3 className="text-xl font-bold text-white mb-4">Episode</h3>
                
                {/* Search & Sort */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  {/* Search Input */}
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input 
                      type="text"
                      placeholder="Cari episode (contoh: 10, 100, finale)"
                      className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg block w-full pl-10 p-2.5 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                  
                  {/* Sort & Count */}
                  <div className="flex items-center gap-4">
                    <div className="text-gray-300 whitespace-nowrap">
                      Total {donghua.episodes_list.length} episode
                    </div>
                    <div className="flex items-center space-x-2">
                      <select 
                        className="bg-gray-700 text-white text-sm rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500"
                        value={sortOrder}
                        onChange={handleSortChange}
                      >
                        <option value="newest">Terbaru</option>
                        <option value="oldest">Terlama</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                {/* Search results info */}
                {searchQuery.trim() !== "" && (
                  <div className="mb-4 text-gray-300 text-sm">
                    Hasil pencarian untuk "{searchQuery}": {getFilteredAndSortedEpisodes(donghua.episodes_list).length} episode ditemukan
                  </div>
                )}
                
                {/* Episode list */}
                {getFilteredAndSortedEpisodes(donghua.episodes_list).length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {getFilteredAndSortedEpisodes(donghua.episodes_list).slice(0, visibleEpisodes).map((episode, index) => {
                      // Extract episode number from title
                      const episodeNumber = episode.episode.match(/Episode\s+(\d+)/i)?.[1] || index + 1;
                      
                      return (
                        <Link
                          key={index}
                          href={`/donghua/watch/${episode.slug}`}
                          className="bg-slate-700/50 hover:bg-slate-700/80 rounded-lg p-4 transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 flex-shrink-0 bg-blue-600 rounded-lg flex items-center justify-center font-semibold text-white group-hover:bg-blue-500 transition-colors">
                              {episodeNumber}
                            </div>
                            <span className="text-gray-200 group-hover:text-white transition-colors line-clamp-1">
                              {episode.episode.replace("Subtitle Indonesia", "").trim()}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-slate-700/30 rounded-lg p-8 text-center">
                    <div className="text-gray-400 mb-2">Tidak ada episode yang ditemukan</div>
                    <div className="text-sm text-gray-500">Coba gunakan kata kunci yang berbeda</div>
                  </div>
                )}
                
                {visibleEpisodes < getFilteredAndSortedEpisodes(donghua.episodes_list).length && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={loadMoreEpisodes}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors inline-flex items-center gap-2"
                    >
                      <span>Muat Lebih Banyak</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Informasi Tambahan */}
          <div className="col-span-1">
            <div className="bg-slate-800/40 backdrop-blur-sm p-6 rounded-lg mb-8 sticky top-4">
              <h3 className="text-xl font-bold text-white mb-4">Informasi Donghua</h3>
              
              <div className="space-y-3">
                <InfoItem label="Judul" value={donghua.title} />
                {donghua.alter_title && <InfoItem label="Judul Alternatif" value={donghua.alter_title} />}
                <InfoItem label="Status" value={donghua.status} />
                <InfoItem label="Tipe" value={donghua.type} />
                {donghua.episodes_count && <InfoItem label="Total Episode" value={donghua.episodes_count} />}
                {donghua.duration && <InfoItem label="Durasi" value={donghua.duration} />}
                {donghua.studio && <InfoItem label="Studio" value={donghua.studio} />}
                {donghua.network && <InfoItem label="Network" value={donghua.network} />}
                {donghua.season && <InfoItem label="Musim" value={donghua.season} />}
                {donghua.country && <InfoItem label="Negara" value={donghua.country} />}
                {donghua.released && <InfoItem label="Tanggal Rilis" value={donghua.released} />}
                {donghua.released_on && <InfoItem label="Dirilis Pada" value={donghua.released_on} />}
                {donghua.updated_on && <InfoItem label="Diperbarui Pada" value={donghua.updated_on} />}
              </div>
              
              {/* Share Buttons */}
              <div className="mt-8">
                <h4 className="text-sm font-semibold text-gray-400 mb-3">Bagikan</h4>
                <div className="flex gap-2">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </button>
                  <button className="bg-blue-800 hover:bg-blue-900 text-white p-2 rounded-full transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                    </svg>
                  </button>
                  <button className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                  </button>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Komponen InfoItem untuk detail donghua
function InfoItem({ label, value }) {
  if (!value) return null;
  
  return (
    <div className="flex flex-col">
      <span className="text-gray-400 text-sm">{label}</span>
      <span className="text-white">{value}</span>
    </div>
  );
}

// Loading state component
function LoadingState() {
  return (
    <div className="bg-[#0f1729] min-h-screen pb-16">
      {/* Navigasi Breadcrumb Skeleton */}
      <div className="bg-[#121a2e] py-3 shadow-md shadow-black/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="flex items-center text-sm flex-wrap">
              <div className="h-4 w-16 bg-slate-700 rounded animate-pulse"></div>
              <span className="mx-2 text-gray-600">/</span>
              <div className="h-4 w-20 bg-slate-700 rounded animate-pulse"></div>
              <span className="mx-2 text-gray-600">/</span>
              <div className="h-4 w-40 bg-slate-700 rounded animate-pulse"></div>
            </div>
            
            <div className="h-8 w-full sm:w-64 md:w-72 bg-slate-700 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Hero Banner Skeleton */}
      <div className="relative w-full">
        <div className="absolute inset-0 bg-slate-800 animate-pulse"></div>
        <div className="container mx-auto px-4 relative z-10 flex items-end pb-12">
        <div className="flex flex-col min-[375px]:flex-row items-start gap-8 w-full">
            {/* Poster Skeleton */}
            <div className="w-48 md:w-64 flex-shrink-0 rounded-lg overflow-hidden bg-slate-700 animate-pulse">
              <div className="aspect-[2/3]"></div>
            </div>
            
            {/* Info Skeleton */}
            <div className="flex-1 w-full">
              <div className="h-10 bg-slate-700 rounded w-3/4 mb-3 animate-pulse"></div>
              <div className="h-6 bg-slate-700 rounded w-1/2 mb-6 animate-pulse"></div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <div className="h-8 w-24 bg-slate-700 rounded-full animate-pulse"></div>
                <div className="h-8 w-20 bg-slate-700 rounded-full animate-pulse"></div>
                <div className="h-8 w-32 bg-slate-700 rounded-full animate-pulse"></div>
              </div>
              
              <div className="flex flex-wrap gap-x-8 gap-y-4 mb-6">
                <div className="h-5 w-36 bg-slate-700 rounded animate-pulse"></div>
                <div className="h-5 w-36 bg-slate-700 rounded animate-pulse"></div>
                <div className="h-5 w-36 bg-slate-700 rounded animate-pulse"></div>
              </div>
              
              <div className="mt-4">
                <div className="h-5 w-20 bg-slate-700 rounded mb-2 animate-pulse"></div>
                <div className="flex flex-wrap gap-2">
                  <div className="h-8 w-24 bg-slate-700 rounded-full animate-pulse"></div>
                  <div className="h-8 w-24 bg-slate-700 rounded-full animate-pulse"></div>
                  <div className="h-8 w-24 bg-slate-700 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content Skeleton */}
      <div className="container mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="col-span-1 lg:col-span-2">
            <div className="bg-slate-800/40 p-6 rounded-lg mb-8">
              <div className="h-8 bg-slate-700 rounded w-40 mb-4 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 bg-slate-700 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-slate-700 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-slate-700 rounded w-5/6 animate-pulse"></div>
                <div className="h-4 bg-slate-700 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-slate-700 rounded w-4/5 animate-pulse"></div>
              </div>
            </div>
            
            <div className="bg-slate-800/40 p-6 rounded-lg">
              <div className="h-8 bg-slate-700 rounded w-40 mb-4 animate-pulse"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[...Array(10)].map((_, index) => (
                  <div key={index} className="bg-slate-700/50 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-slate-600 rounded-lg animate-pulse"></div>
                      <div className="h-5 bg-slate-600 rounded w-4/5 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="col-span-1">
            <div className="bg-slate-800/40 p-6 rounded-lg mb-8">
              <div className="h-8 bg-slate-700 rounded w-56 mb-6 animate-pulse"></div>
              <div className="space-y-4">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="space-y-1">
                    <div className="h-4 bg-slate-700 rounded w-24 animate-pulse"></div>
                    <div className="h-5 bg-slate-700 rounded w-full animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 