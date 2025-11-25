"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import { getAnimeUrl } from "@/lib/apiConfig";

export default function AnimeBatchDownloadPage() {
  const params = useParams();
  const slug = params.slug;
  
  const [batchData, setBatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState("mkv");
  const [expandedQualityIndex, setExpandedQualityIndex] = useState(null);
  
  // Toggle fungsi untuk expandable quality section
  const toggleQualityExpand = (index) => {
    if (expandedQualityIndex === index) {
      setExpandedQualityIndex(null);
    } else {
      setExpandedQualityIndex(index);
    }
  };
  
  // Function untuk handle format selection
  const handleFormatChange = (format) => {
    setSelectedFormat(format);
    setExpandedQualityIndex(null); // Reset expanded quality when changing format
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(getAnimeUrl(`downloads/${slug}`), {
          cache: "no-store",
        });
        
        if (!response.ok) {
          throw new Error("Gagal mengambil data batch download anime");
        }
        
        const data = await response.json();
        setBatchData(data);
        
        // Set default format berdasarkan yang tersedia
        if (data?.data?.download_links) {
          const availableFormats = Object.keys(data.data.download_links);
          if (availableFormats.length > 0) {
            setSelectedFormat(availableFormats[0]);
          }
        }
        
        setError(null);
      } catch (err) {
        console.error("Error fetching batch download data:", err);
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
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  const batchInfo = batchData?.data;
  if (!batchInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#0f1729]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-yellow-500 mb-2">Batch Download Tidak Ditemukan</h2>
          <p className="text-gray-300 mb-4">Maaf, batch download yang Anda cari tidak tersedia.</p>
          <Link href="/anime" className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors inline-block">
            Kembali ke Daftar Anime
          </Link>
        </div>
      </div>
    );
  }

  // Dapatkan format download yang tersedia
  const availableFormats = Object.keys(batchInfo.download_links || {});
  
  // Tentukan status color
  const statusColor = batchInfo.information?.Status === "Completed" 
    ? "bg-green-600 text-green-100" 
    : "bg-red-600 text-red-100";

  return (
    <div className="bg-[#0f1729] mx-auto p-4 min-h-screen pb-16">
      {/* Navigasi Breadcrumb */}
      <div className="container mx-auto bg-[#121a2e] py-3 shadow-md shadow-black/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="flex items-center text-sm flex-wrap">
              <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                Beranda
              </Link>
              <span className="mx-2 text-gray-600">/</span>
              <Link href="/anime" className="text-gray-400 hover:text-white transition-colors">
                Anime
              </Link>
              <span className="mx-2 text-gray-600">/</span>
              <Link href={`/anime/${batchInfo.slug}`} className="text-gray-400 hover:text-white transition-colors">
                {batchInfo.title.replace("Episode 1-25 [BATCH] Subtitle Indonesia", "").trim()}
              </Link>
              <span className="mx-2 text-gray-600">/</span>
              <span className="text-white font-medium">Batch Download</span>
            </div>
            
            <SearchBar className="w-full sm:w-64 md:w-72" />
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 pt-8">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="w-64 flex-shrink-0">
            <div className="rounded-lg overflow-hidden shadow-xl shadow-black/30 border-2 border-gray-800">
              <div className="aspect-[2/3] relative">
                <Image 
                  src={batchInfo.poster} 
                  alt={batchInfo.title}
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
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {batchInfo.title.replace("[BATCH] Subtitle Indonesia", "").trim()}
              </h1>
              <div className="text-white bg-red-600 inline-block px-3 py-1 rounded-md text-sm font-medium">
                {batchInfo.episode_range}
              </div>
            </div>
            
            {/* Tags Section */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className={`${statusColor} px-3 py-1 rounded-md text-sm font-medium`}>
                {batchInfo.information?.Status || "Unknown"}
              </span>
              <span className="bg-gray-700 text-gray-100 px-3 py-1 rounded-md text-sm">
                {batchInfo.information?.Type || "TV"}
              </span>
              {batchInfo.information?.Season && batchInfo.information.Season.length > 0 && (
                <span className="bg-gray-700 text-gray-100 px-3 py-1 rounded-md text-sm">
                  {batchInfo.information.Season[0]}
                </span>
              )}
              <span className="bg-gray-700 text-gray-100 px-3 py-1 rounded-md text-sm">
                {batchInfo.information?.["Total Episode"] || "?"} Episode
              </span>
            </div>
            
            {/* Additional Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mb-6 text-sm">
              {batchInfo.information?.Synonyms && (
                <InfoItem label="Alternative" value={batchInfo.information.Synonyms} />
              )}
              {batchInfo.information?.Japanese && (
                <InfoItem label="Japanese" value={batchInfo.information.Japanese} />
              )}
              {batchInfo.information?.English && (
                <InfoItem label="English" value={batchInfo.information.English} />
              )}
              {batchInfo.information?.Source && (
                <InfoItem label="Source" value={batchInfo.information.Source} />
              )}
              {batchInfo.information?.Duration && (
                <InfoItem label="Duration" value={batchInfo.information.Duration} />
              )}
              {batchInfo.information?.Score && (
                <InfoItem label="Score" value={batchInfo.information.Score} />
              )}
              {batchInfo.information?.Studio && batchInfo.information.Studio.length > 0 && (
                <InfoItem label="Studio" value={batchInfo.information.Studio.join(", ")} />
              )}
              {batchInfo.information?.Producers && batchInfo.information.Producers.length > 0 && (
                <InfoItem label="Producers" value={batchInfo.information.Producers.join(", ")} />
              )}
              {batchInfo.information?.Released && (
                <InfoItem label="Released" value={batchInfo.information.Released} />
              )}
            </div>
            
            {/* Genres */}
            {batchInfo.information?.Genre && batchInfo.information.Genre.length > 0 && (
              <div className="mb-6">
                <div className="text-white font-semibold mb-2">Genres:</div>
                <div className="flex flex-wrap gap-2">
                  {batchInfo.information.Genre.map((genre, index) => (
                    <Link 
                      key={index} 
                      href={`/anime/genres/${genre.slug}`}
                      className="bg-[#121a2e] hover:bg-[#1c2744] text-gray-200 hover:text-white text-xs px-3 py-1.5 rounded-md transition-colors"
                    >
                      {genre.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            {/* Synopsis */}
            {batchInfo.synopsis && (
              <div className="mb-6">
                <div className="text-white font-semibold mb-2">Synopsis:</div>
                <div className="text-gray-300 text-sm bg-[#121a2e] p-4 rounded-lg shadow-inner">
                  {batchInfo.synopsis}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Download Section */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-white mb-6">Download {batchInfo.title}</h2>
          
          {/* Format Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {availableFormats.map((format, index) => (
              <button
                key={index}
                onClick={() => handleFormatChange(format)}
                className={`px-5 py-2 rounded-md text-sm uppercase font-semibold transition-colors ${
                  selectedFormat === format 
                    ? "bg-red-600 text-white" 
                    : "bg-gray-700 hover:bg-gray-600 text-gray-200"
                }`}
              >
                {format}
              </button>
            ))}
          </div>
          
          {/* Quality Accordion */}
          <div className="bg-[#121a2e] rounded-lg overflow-hidden shadow-xl shadow-black/20">
            {batchInfo.download_links[selectedFormat]?.map((quality, qualityIndex) => (
              <div
                key={qualityIndex}
                className="mb-4 last:mb-0 bg-[#0f1729] rounded-lg overflow-hidden"
              >
                <div 
                  className="bg-red-900/50 p-3 px-4 flex justify-between items-center cursor-pointer"
                  onClick={() => toggleQualityExpand(qualityIndex)}
                >
                  <h4 className="text-white text-sm font-medium uppercase">
                    {quality.quality}
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
                          className="bg-red-900/40 hover:bg-red-800 text-white text-sm font-medium py-2 px-3 rounded text-center transition-colors"
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
        
        {/* Disclaimer Section */}
        <div className="mt-10 text-center text-xs text-gray-500 p-4 border border-gray-800 rounded-lg bg-[#121a2e]/50">
          <p>Semua link download batch anime di situs ini berasal dari berbagai sumber dan hanya ditampilkan untuk tujuan edukasi. Jika Anda adalah pemilik konten dan ingin konten Anda dihapus, silakan hubungi kami.</p>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="flex">
      <div className="text-gray-400 w-24 flex-shrink-0">{label}:</div>
      <div className="text-white">{value}</div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="bg-[#0f1729] mx-auto p-4 min-h-screen pb-16">
      {/* Breadcrumb Skeleton */}
      <div className="container mx-auto bg-[#121a2e] py-3 shadow-md shadow-black/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="flex items-center text-sm flex-wrap">
              <div className="h-4 bg-slate-700 w-16 rounded animate-pulse"></div>
              <span className="mx-2 text-gray-600">/</span>
              <div className="h-4 bg-slate-700 w-20 rounded animate-pulse"></div>
              <span className="mx-2 text-gray-600">/</span>
              <div className="h-4 bg-slate-700 w-32 rounded animate-pulse"></div>
              <span className="mx-2 text-gray-600">/</span>
              <div className="h-4 bg-slate-700 w-24 rounded animate-pulse"></div>
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
            <div className="rounded-lg overflow-hidden shadow-xl shadow-black/30 border-2 border-gray-800">
              <div className="aspect-[2/3] bg-slate-700 animate-pulse"></div>
            </div>
          </div>
          
          {/* Main Content Skeleton */}
          <div className="flex-1">
            <div className="h-10 bg-slate-700 w-3/4 rounded animate-pulse mb-2"></div>
            <div className="h-6 bg-slate-700 w-1/4 rounded animate-pulse mb-6"></div>
            
            <div className="flex gap-2 mb-6">
              <div className="h-6 bg-slate-700 w-20 rounded animate-pulse"></div>
              <div className="h-6 bg-slate-700 w-20 rounded animate-pulse"></div>
              <div className="h-6 bg-slate-700 w-20 rounded animate-pulse"></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mb-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center">
                  <div className="h-4 bg-slate-700 w-24 rounded animate-pulse"></div>
                  <div className="h-4 bg-slate-700 w-40 rounded animate-pulse ml-2"></div>
                </div>
              ))}
            </div>
            
            <div className="mb-6">
              <div className="h-5 bg-slate-700 w-20 rounded animate-pulse mb-2"></div>
              <div className="flex gap-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-7 bg-slate-700 w-20 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
            
            <div>
              <div className="h-5 bg-slate-700 w-20 rounded animate-pulse mb-2"></div>
              <div className="h-28 bg-slate-700 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
        
        {/* Download Section Skeleton */}
        <div className="mt-10">
          <div className="h-8 bg-slate-700 w-64 rounded animate-pulse mb-6"></div>
          
          <div className="flex gap-2 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-8 bg-slate-700 w-24 rounded animate-pulse"></div>
            ))}
          </div>
          
          <div className="bg-[#121a2e] rounded-lg overflow-hidden shadow-xl p-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="mb-4 last:mb-0 bg-slate-700 h-12 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 