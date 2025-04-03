"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import { getDonghuaUrl } from "@/lib/apiConfig";

export default function WatchDonghuaPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug;

  const [episodeData, setEpisodeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedServer, setSelectedServer] = useState(null);
  const [selectedDownloadQuality, setSelectedDownloadQuality] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest"); // "newest" atau "oldest"

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(getDonghuaUrl(`episode/${slug}`), {
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

        // Set kualitas download default ke 1080p jika tersedia
        if (data?.data?.download_url?.download_url_1080p) {
          setSelectedDownloadQuality("1080p");
        } else if (data?.data?.download_url?.download_url_720p) {
          setSelectedDownloadQuality("720p");
        } else if (data?.data?.download_url?.download_url_480p) {
          setSelectedDownloadQuality("480p");
        } else if (data?.data?.download_url?.download_url_360p) {
          setSelectedDownloadQuality("360p");
        } else if (data?.data?.download_url?.download_url_4k) {
          setSelectedDownloadQuality("4k");
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
            href="/donghua"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors inline-block"
          >
            Kembali ke Daftar Donghua
          </Link>
        </div>
      </div>
    );
  }

  // Dapatkan URL download untuk kualitas yang dipilih
  const getDownloadUrls = () => {
    if (!selectedDownloadQuality || !episodeInfo.download_url) return null;

    const qualityMap = {
      "360p": episodeInfo.download_url.download_url_360p,
      "480p": episodeInfo.download_url.download_url_480p,
      "720p": episodeInfo.download_url.download_url_720p,
      "1080p": episodeInfo.download_url.download_url_1080p,
      "4k": episodeInfo.download_url.download_url_4k,
    };

    return qualityMap[selectedDownloadQuality];
  };

  const downloadUrls = getDownloadUrls();

  // Fungsi untuk membersihkan dan memformat tipe donghua
  const formatDonghuaType = (type) => {
    if (!type) return "Donghua";

    // Pisahkan kata berdasarkan kapitalisasi (camelCase atau PascalCase)
    const cleanType = type.replace(/([a-z])([A-Z])/g, "$1 $2");

    // Hapus duplikasi kata
    const typeWords = cleanType.split(" ");
    const uniqueWords = [...new Set(typeWords)];

    // Jika hanya ada "Donghua", kembalikan itu saja
    if (uniqueWords.length === 1 && uniqueWords[0] === "Donghua") {
      return "Donghua";
    }

    // Jika dimulai dengan "Donghua", pisahkan dengan spasi
    if (uniqueWords[0] === "Donghua") {
      return `${uniqueWords[0]} · ${uniqueWords.slice(1).join(" ")}`;
    }

    return uniqueWords.join(" ");
  };

  // Fungsi untuk memfilter episode berdasarkan pencarian
  const getFilteredEpisodes = (episodes) => {
    if (!episodes) return [];
    if (!searchQuery.trim()) return episodes;

    const query = searchQuery.toLowerCase().trim();
    return episodes.filter(
      (episode) =>
        episode.episode.toLowerCase().includes(query) ||
        episode.episode.match(/Episode\s+(\d+)/i)?.[1]?.includes(query)
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
      router.push(`/donghua/watch/${slug}`);
    }
  };

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
                href="/donghua"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Donghua
              </Link>
              <span className="mx-2 text-gray-600">/</span>
              <Link
                href={`/donghua/${episodeInfo.donghua_details.slug}`}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {episodeInfo.donghua_details.title}
              </Link>
              <span className="mx-2 text-gray-600">/</span>
              <span className="text-white font-medium truncate">
                {episodeInfo.episode}
              </span>
            </div>

            <SearchBar className="w-full sm:w-64 md:w-72" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-6">
        {/* Judul Episode */}
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">
          {episodeInfo.episode}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Kolom Kiri: Video Player & Server Selection */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            <div className="bg-[#0a0f1d] rounded-lg overflow-hidden shadow-xl shadow-black/30 border border-gray-800 mb-6">
              <div className="aspect-video relative">
                {selectedServer && (
                  <iframe
                    src={selectedServer.url}
                    className="w-full h-full"
                    frameBorder="0"
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                )}
              </div>
            </div>

            {/* Server Selection */}
            <div className="bg-[#121a2e] rounded-lg p-4 mb-6 border border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-3">
                Pilih Server
              </h3>

              {/* Tampilan grid untuk layar md ke atas */}
              <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-2">
                {episodeInfo.streaming.servers.map((server, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedServer(server)}
                    className={`py-2 px-3 rounded text-sm font-medium transition-colors
                      ${
                        selectedServer && selectedServer.name === server.name
                          ? "bg-blue-600 text-white"
                          : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      }`}
                  >
                    {server.name}
                  </button>
                ))}
              </div>

              {/* Dropdown untuk layar di bawah md */}
              <div className="md:hidden">
                <select
                  className="w-full bg-gray-800 text-gray-300 py-2 px-3 rounded text-sm font-medium border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => {
                    const selectedServerIndex = parseInt(e.target.value);
                    setSelectedServer(
                      episodeInfo.streaming.servers[selectedServerIndex]
                    );
                  }}
                  value={episodeInfo.streaming.servers.findIndex(
                    (server) =>
                      selectedServer && server.name === selectedServer.name
                  )}
                >
                  {episodeInfo.streaming.servers.map((server, index) => (
                    <option key={index} value={index}>
                      {server.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* Navigasi Episode */}
            <div className="bg-[#121a2e] rounded-lg p-4 mb-6 border border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-3">
                Navigasi Episode
              </h3>
              <div className="flex flex-col gap-3">
                {episodeInfo.navigation.next_episode && (
                  <button
                    onClick={() =>
                      navigateToEpisode(
                        episodeInfo.navigation.next_episode.slug
                      )
                    }
                    className="py-2 px-3 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded text-sm transition-colors flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
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
                    Episode Sebelumnya
                  </button>
                )}

                {episodeInfo.navigation.previous_episode && (
                  <button
                    onClick={() =>
                      navigateToEpisode(
                        episodeInfo.navigation.previous_episode.slug
                      )
                    }
                    className="py-2 px-3 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded text-sm transition-colors flex items-center justify-between"
                  >
                    <span>Episode Selanjutnya</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            {/* Download Links */}
            {episodeInfo.download_url &&
              Object.keys(episodeInfo.download_url).length > 0 && (
                <div className="bg-[#121a2e] rounded-lg p-4 mb-6 border border-gray-800">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Download
                  </h3>

                  {/* Kualitas */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-400 mb-2">
                      Kualitas:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {episodeInfo.download_url.download_url_360p && (
                        <button
                          onClick={() => setSelectedDownloadQuality("360p")}
                          className={`py-1.5 px-3 rounded text-xs font-medium transition-colors
                          ${
                            selectedDownloadQuality === "360p"
                              ? "bg-green-600 text-white"
                              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                          }`}
                        >
                          360p
                        </button>
                      )}
                      {episodeInfo.download_url.download_url_480p && (
                        <button
                          onClick={() => setSelectedDownloadQuality("480p")}
                          className={`py-1.5 px-3 rounded text-xs font-medium transition-colors
                          ${
                            selectedDownloadQuality === "480p"
                              ? "bg-green-600 text-white"
                              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                          }`}
                        >
                          480p
                        </button>
                      )}
                      {episodeInfo.download_url.download_url_720p && (
                        <button
                          onClick={() => setSelectedDownloadQuality("720p")}
                          className={`py-1.5 px-3 rounded text-xs font-medium transition-colors
                          ${
                            selectedDownloadQuality === "720p"
                              ? "bg-green-600 text-white"
                              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                          }`}
                        >
                          720p
                        </button>
                      )}
                      {episodeInfo.download_url.download_url_1080p && (
                        <button
                          onClick={() => setSelectedDownloadQuality("1080p")}
                          className={`py-1.5 px-3 rounded text-xs font-medium transition-colors
                          ${
                            selectedDownloadQuality === "1080p"
                              ? "bg-green-600 text-white"
                              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                          }`}
                        >
                          1080p
                        </button>
                      )}
                      {episodeInfo.download_url.download_url_4k && (
                        <button
                          onClick={() => setSelectedDownloadQuality("4k")}
                          className={`py-1.5 px-3 rounded text-xs font-medium transition-colors
                          ${
                            selectedDownloadQuality === "4k"
                              ? "bg-green-600 text-white"
                              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                          }`}
                        >
                          4K
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Link Download */}
                  {downloadUrls && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">
                        Link Download:
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {Object.entries(downloadUrls).map(
                          ([provider, url], index) => (
                            <a
                              key={index}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors flex items-center justify-center"
                            >
                              {provider}
                            </a>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
          </div>

          {/* Kolom Kanan: Info Donghua & Navigasi Episode */}
          <div className="lg:col-span-1">
            {/* Info Donghua */}
            <div className="bg-[#121a2e] rounded-lg p-4 mb-6 border border-gray-800">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-20 h-28 flex-shrink-0 overflow-hidden rounded-md border border-gray-800">
                  <Image
                    src={episodeInfo.donghua_details.poster}
                    alt={episodeInfo.donghua_details.title}
                    width={80}
                    height={112}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    {episodeInfo.donghua_details.title}
                  </h3>
                  <div className="text-xs text-gray-400 mb-2">
                    {formatDonghuaType(episodeInfo.donghua_details.type)}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/donghua/${episodeInfo.donghua_details.slug}`}
                      className="text-xs bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded inline-block transition-colors"
                    >
                      Lihat Detail
                    </Link>
                    <Link
                      href="/donghua/genres"
                      className="text-xs bg-gray-700 hover:bg-gray-600 text-white py-1 px-2 rounded inline-block transition-colors"
                    >
                      Lihat Genre
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Daftar Episode */}
            <div className="bg-[#121a2e] rounded-lg p-4 mb-6 border border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-3">
                Daftar Episode
              </h3>

              {/* Search & Sort */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                {/* Search Input */}
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
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
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Sort Dropdown */}
                <div className="flex-shrink-0">
                  <select
                    value={sortOrder}
                    onChange={handleSortChange}
                    className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="newest">Terbaru</option>
                    <option value="oldest">Terlama</option>
                  </select>
                </div>
              </div>

              <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                <div className="flex flex-col gap-2">
                  {getFilteredAndSortedEpisodes(episodeInfo.episodes_list).map(
                    (ep, index) => (
                      <button
                        key={index}
                        onClick={() => navigateToEpisode(ep.slug)}
                        className={`py-2 px-3 rounded-md text-left text-sm transition-colors
                        ${
                          ep.slug === slug
                            ? "bg-blue-600 text-white"
                            : "bg-gray-800 hover:bg-gray-700 text-gray-200"
                        }`}
                      >
                        {ep.episode}
                      </button>
                    )
                  )}
                </div>
              </div>

              {getFilteredEpisodes(episodeInfo.episodes_list).length === 0 && (
                <div className="bg-gray-800/30 rounded-lg p-4 text-center mt-3">
                  <p className="text-gray-400">
                    Tidak ada episode yang ditemukan
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Coba gunakan kata kunci pencarian yang berbeda
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
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
            <div className="h-4 bg-gray-700 rounded w-60 animate-pulse"></div>
            <div className="h-10 bg-gray-700 rounded w-64 animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-6">
        {/* Judul Episode Skeleton */}
        <div className="h-8 bg-gray-700 rounded w-2/3 mb-6 animate-pulse"></div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Kolom Kiri: Video Player & Server Selection Skeletons */}
          <div className="lg:col-span-2">
            {/* Video Player Skeleton */}
            <div className="bg-[#0a0f1d] rounded-lg overflow-hidden shadow-xl shadow-black/30 border border-gray-800 mb-6">
              <div className="aspect-video bg-gray-800 animate-pulse"></div>
            </div>

            {/* Server Selection Skeleton */}
            <div className="bg-[#121a2e] rounded-lg p-4 mb-6 border border-gray-800">
              <div className="h-6 bg-gray-700 rounded w-40 mb-3 animate-pulse"></div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {[...Array(8)].map((_, index) => (
                  <div
                    key={index}
                    className="h-10 bg-gray-700 rounded animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
            {/* Navigasi Episode Skeleton */}
            <div className="bg-[#121a2e] rounded-lg p-4 mb-6 border border-gray-800">
              <div className="h-6 bg-gray-700 rounded w-40 mb-3 animate-pulse"></div>
              <div className="flex flex-col gap-3">
                <div className="h-10 bg-gray-700 rounded animate-pulse"></div>
                <div className="h-10 bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>
            {/* Download Links Skeleton */}
            <div className="bg-[#121a2e] rounded-lg p-4 mb-6 border border-gray-800">
              <div className="h-6 bg-gray-700 rounded w-40 mb-3 animate-pulse"></div>
              <div className="mb-4">
                <div className="h-5 bg-gray-700 rounded w-24 mb-2 animate-pulse"></div>
                <div className="flex flex-wrap gap-2">
                  {[...Array(4)].map((_, index) => (
                    <div
                      key={index}
                      className="h-8 w-16 bg-gray-700 rounded animate-pulse"
                    ></div>
                  ))}
                </div>
              </div>

              <div>
                <div className="h-5 bg-gray-700 rounded w-32 mb-2 animate-pulse"></div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {[...Array(3)].map((_, index) => (
                    <div
                      key={index}
                      className="h-10 bg-gray-700 rounded animate-pulse"
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Info Donghua & Navigasi Episode Skeletons */}
          <div className="lg:col-span-1">
            {/* Info Donghua Skeleton */}
            <div className="bg-[#121a2e] rounded-lg p-4 mb-6 border border-gray-800">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-20 h-28 flex-shrink-0 bg-gray-700 rounded-md animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-700 rounded w-full mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-700 rounded w-24 mb-3 animate-pulse"></div>
                  <div className="flex flex-wrap gap-2">
                    <div className="h-6 w-24 bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-6 w-24 bg-gray-700 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Daftar Episode Skeleton */}
            <div className="bg-[#121a2e] rounded-lg p-4 mb-6 border border-gray-800">
              <div className="h-6 bg-gray-700 rounded w-40 mb-3 animate-pulse"></div>
              <div className="flex flex-col gap-4 mb-4">
                <div className="h-10 bg-gray-700 rounded animate-pulse"></div>
                <div className="h-10 bg-gray-700 rounded w-32 animate-pulse"></div>
              </div>

              <div className="flex flex-col gap-2">
                {[...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className="h-10 bg-gray-700 rounded animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
