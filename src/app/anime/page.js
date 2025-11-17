"use client";

import { useState, useEffect } from "react";
import AnimeHeader from "@/components/AnimeHeader";
import AnimeSection from "@/components/AnimeSection";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import { getAnimeUrl } from "@/lib/apiConfig";

export default function AnimePage() {
  const [animeData, setAnimeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(getAnimeUrl("home"), {
          cache: "no-store",
        });
        
        if (!response.ok) {
          throw new Error("Gagal mengambil data anime");
        }
        
        const data = await response.json();
        setAnimeData(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching anime data:", err);
        setError("Terjadi kesalahan saat mengambil data. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRetry = () => {
    window.location.reload();
  };

  if (loading) {
    return <LoadingState type="anime" />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={handleRetry} />;
  }

  return (
    <div className="bg-[#0f1729] min-h-screen pb-16">
      {/* Navigasi Breadcrumb */}
      <div className="bg-[#121a2e] py-3 shadow-md shadow-black/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="flex items-center text-sm flex-wrap">
              <Link href="/" className="text-gray-400 hover:text-white transition-colors">Beranda</Link>
              <span className="mx-2 text-gray-600">/</span>
              <span className="text-white font-medium">Anime</span>
            </div>
            
            <SearchBar className="w-full sm:w-64 md:w-72" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <AnimeHeader />

        {/* Ongoing Anime Section */}
        <AnimeSection 
          title="Anime Ongoing"
          linkUrl="/anime/ongoing"
          items={animeData?.data?.ongoing_anime || []}
          type="ongoing"
          loading={loading}
        />

        {/* Completed Anime Section */}
        <AnimeSection 
          title="Anime Completed"
          linkUrl="/anime/completed"
          items={animeData?.data?.completed_anime || []}
          type="completed"
          loading={loading}
        />
      </div>
    </div>
  );
} 