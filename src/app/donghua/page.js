"use client";

import { useState, useEffect } from "react";
import DonghuaHeader from "@/components/DonghuaHeader";
import DonghuaSection from "@/components/DonghuaSection";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";

export default function DonghuaPage() {
  const [donghuaData, setDonghuaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const apiKey = process.env.NEXT_PUBLIC_API_KEY;
        const response = await fetch(`https://anyapi-beta.vercel.app/v1/donghua/anichin/home?page=${currentPage}`, {
          headers: {
            "X-API-Key": apiKey,
          },
          cache: "no-store",
        });
        
        if (!response.ok) {
          throw new Error("Gagal mengambil data donghua");
        }
        
        const data = await response.json();
        setDonghuaData(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching donghua data:", err);
        setError("Terjadi kesalahan saat mengambil data. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  const handleRetry = () => {
    window.location.reload();
  };

  if (loading) {
    return <LoadingState type="donghua" />;
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
              <span className="text-white font-medium">Donghua</span>
            </div>
            
            <SearchBar className="w-full sm:w-64 md:w-72" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <DonghuaHeader />

      {/* Latest Releases Section */}
        <DonghuaSection 
          title="Episode Terbaru"
          linkUrl="/donghua/ongoing"
          items={donghuaData?.data?.latest_release || []}
          type="latest"
          loading={loading}
        />

      {/* Completed Donghua Section */}
        <DonghuaSection 
          title="Donghua Completed"
          linkUrl="/donghua/completed"
          items={donghuaData?.data?.completed_donghua || []}
          type="completed"
          loading={loading}
        />
      </div>
    </div>
  );
} 