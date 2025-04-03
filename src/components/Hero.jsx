"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

const Hero = () => {
  const [backgroundImages, setBackgroundImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    const fetchBackgroundImages = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_API_KEY;

        // Fetch donghua data
        const donghuaRes = await fetch(
          "https://anyapi-beta.vercel.app/v1/donghua/anichin/ongoing",
          {
            headers: {
              "X-API-Key": apiKey,
            },
            cache: "no-store",
          }
        );

        // Fetch anime data
        const animeRes = await fetch(
          "https://anyapi-beta.vercel.app/v1/anime/samehadaku/ongoing",
          {
            headers: {
              "X-API-Key": apiKey,
            },
            cache: "no-store",
          }
        );

        if (!donghuaRes.ok && !animeRes.ok) {
          throw new Error("Failed to fetch data from both APIs");
        }

        let combinedImages = [];

        // Process donghua data if available
        if (donghuaRes.ok) {
          const donghuaData = await donghuaRes.json();
          if (
            donghuaData.data &&
            donghuaData.data.ongoing_donghua &&
            Array.isArray(donghuaData.data.ongoing_donghua)
          ) {
            const donghuaImages = donghuaData.data.ongoing_donghua
              .slice(0, 5)
              .map((item) => ({
                ...item,
                contentType: "donghua",
                url: `/donghua/${item.slug ? item.slug.replace("/", "") : ""}`,
              }));
            combinedImages = [...combinedImages, ...donghuaImages];
          }
        }

        // Process anime data if available
        if (animeRes.ok) {
          const animeData = await animeRes.json();
          if (
            animeData.data &&
            animeData.data.animes &&
            Array.isArray(animeData.data.animes)
          ) {
            const animeImages = animeData.data.animes
              .slice(0, 5)
              .map((item) => ({
                title: item.title,
                poster: item.poster,
                slug: item.slug,
                contentType: "anime",
                url: `/anime/${item.slug}`,
              }));
            combinedImages = [...combinedImages, ...animeImages];
          }
        }

        if (combinedImages.length === 0) {
          throw new Error("No data available from APIs");
        }

        // Shuffle the combined images to mix donghua and anime
        const shuffledImages = combinedImages.sort(() => 0.5 - Math.random());
        setBackgroundImages(shuffledImages.slice(0, 10));
      } catch (error) {
        console.error("Error fetching background images:", error);
        setBackgroundImages([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBackgroundImages();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Debounce search untuk mengurangi permintaan API
    searchTimeoutRef.current = setTimeout(() => {
      setIsSearching(true);
      fetchSearchResults(value);
    }, 500);
  };

  const fetchSearchResults = async (keyword) => {
    if (!keyword || keyword.trim() === "") return;

    try {
      const apiKey = process.env.NEXT_PUBLIC_API_KEY;
      setIsSearching(true);

      // Membuat URL pencarian untuk donghua dan anime
      const donghuaSearchUrl = `https://anyapi-beta.vercel.app/v1/donghua/anichin/search/${encodeURIComponent(
        keyword
      )}`;
      const animeSearchUrl = `https://anyapi-beta.vercel.app/v1/anime/samehadaku/search/${encodeURIComponent(
        keyword
      )}`;

      // Melakukan kedua pencarian secara paralel
      const [donghuaRes, animeRes] = await Promise.all([
        fetch(donghuaSearchUrl, {
          headers: { "X-API-Key": apiKey },
          cache: "no-store",
        }),
        fetch(animeSearchUrl, {
          headers: { "X-API-Key": apiKey },
          cache: "no-store",
        }),
      ]);

      let combinedResults = [];

      // Proses hasil pencarian donghua jika berhasil
      if (donghuaRes.ok) {
        const donghuaData = await donghuaRes.json();

        if (donghuaData && donghuaData.data && donghuaData.data.donghua) {
          const donghuaItems = Array.isArray(donghuaData.data.donghua)
            ? donghuaData.data.donghua
            : [donghuaData.data.donghua];

          // Format hasil donghua - PERBAIKAN: selalu gunakan URL internal
          const formattedDonghuaResults = donghuaItems.map((item) => ({
            ...item,
            contentType: "donghua",
            url: `/donghua/${item.slug ? item.slug.replace("/", "") : ""}`,
          }));

          combinedResults = [...combinedResults, ...formattedDonghuaResults];
        }
      }

      // Proses hasil pencarian anime jika berhasil
      if (animeRes.ok) {
        const animeData = await animeRes.json();

        if (animeData && animeData.data && animeData.data.animes) {
          const animeItems = Array.isArray(animeData.data.animes)
            ? animeData.data.animes
            : [animeData.data.animes];

          // Format hasil anime
          const formattedAnimeResults = animeItems.map((item) => ({
            title: item.title,
            poster: item.poster,
            slug: item.slug,
            score: item.score,
            type: item.type || "TV",
            contentType: "anime",
            url: `/anime/${item.slug}`,
            genres: item.genres,
            status: item.status,
            views: item.views,
          }));

          combinedResults = [...combinedResults, ...formattedAnimeResults];
        }
      }

      // Jika tidak ada hasil dari kedua API
      if (combinedResults.length === 0) {
        setSearchResults([]);
        setShowResults(true);
        return;
      }

      // Batasi hasil pencarian untuk performa lebih baik (6 item)
      // Acak urutan untuk mencampur anime dan donghua
      const shuffledResults = combinedResults.sort(() => 0.5 - Math.random());
      const limitedResults = shuffledResults.slice(0, 11);

      setSearchResults(limitedResults);
      setShowResults(true);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle click outside search results
  useEffect(() => {
    const handleClickOutside = () => {
      setShowResults(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Stop propagation on search container clicks
  const handleSearchContainerClick = (e) => {
    e.stopPropagation();
    if (searchTerm.trim() !== "") {
      setShowResults(true);
    }
  };

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      // Gunakan path yang lebih konsisten untuk pencarian
      window.location.href = `/donghua/search/${encodeURIComponent(searchTerm)}`;
    }
  };

  return (
    <div className="pt-0 md:pt-16 h-screen flex items-center justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      {/* Animated background */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute right-0 top-20 grid grid-cols-3 gap-4 transform rotate-12">
          {!isLoading &&
            backgroundImages.map((item, index) => (
              <Link
                href={item.contentType === "donghua" ? `/donghua/${item.slug}` : `/anime/${item.slug}`}
                key={item.slug || `bg-image-${index}`}
                className="relative z-10 hover-shine"
              >
                <div
                  className="w-24 h-32 rounded-lg overflow-hidden group transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg hover:shadow-blue-500/30"
                  style={{
                    position: "relative",
                    top: (index % 3) * 30,
                    opacity: 0.7 - index * 0.05,
                    transform: `rotate(${index % 2 === 0 ? "5deg" : "-5deg"})`,
                    transition: "all 0.3s ease-out",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform =
                      "rotate(0deg) scale(1.15)";
                    e.currentTarget.style.opacity = "1";
                    e.currentTarget.style.zIndex = "30";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = `rotate(${
                      index % 2 === 0 ? "5deg" : "-5deg"
                    }) scale(1)`;
                    e.currentTarget.style.opacity = 0.7 - index * 0.05;
                    e.currentTarget.style.zIndex = "10";
                  }}
                >
                  <Image
                    src={item.poster}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100px, 150px"
                    className="object-cover transition-all group-hover:scale-110"
                    priority={index < 2}
                    loading={index < 2 ? "eager" : "lazy"}
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAEIQJPfrpQJwAAAABJRU5ErkJggg=="
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                    <div className="text-xs text-white font-medium truncate">
                      {item.title.split(" ").slice(0, 2).join(" ")}
                      {item.type && (
                        <span
                          className={`ml-1 px-1 text-[8px] rounded ${
                            item.type === "anime" ? "bg-red-600" : "bg-blue-600"
                          }`}
                        >
                          {item.type === "anime" ? "Anime" : "Donghua"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}

          {/* Tambahkan elemen dummy jika data belum tersedia */}
          {isLoading &&
            Array(10)
              .fill(0)
              .map((_, index) => (
                <div
                  key={`dummy-${index}`}
                  className="w-24 h-32 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 animate-pulse"
                  style={{
                    position: "relative",
                    top: (index % 3) * 30,
                    opacity: 0.7 - index * 0.05,
                    transform: `rotate(${index % 2 === 0 ? "5deg" : "-5deg"})`,
                  }}
                />
              ))}
        </div>
      </div>

      {/* Content */}
      <div className="h-screen text-center relative z-10 w-full max-w-2xl lg:-left-36 py-36 ">
        <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl mb-6 flex items-center justify-center">
          <div className="mr-4 relative flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
            <div
              className="absolute -bottom-1 -left-1 w-2 h-2 bg-purple-400 rounded-full animate-pulse"
              style={{ animationDelay: "0.5s" }}
            ></div>
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
            ARNISEKAI
          </span>
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
          Situs menonton anime dan donghua secara online & gratis
        </p>

        <div className="max-w-xl mx-auto" onClick={handleSearchContainerClick}>
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="flex items-center">
              <div className="p-2 bg-blue-500 rounded-full absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
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
                placeholder="Cari anime dan donghua..."
                className="w-full py-4 pl-16 rounded-full bg-gray-800/70 backdrop-blur-sm text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>

            {/* Search results dropdown */}
            {showResults && (
              <div className="absolute mt-2 w-full bg-gray-900/95 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden z-[100] left-0 right-0 max-w-xl mx-auto">
                {isSearching ? (
                  <div className="p-4 text-center">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="py-2">
                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                      {searchResults.map((result) => (
                        <Link
                          href={`/${result.contentType}/${result.slug}`}
                          key={result.slug || result.id}
                          className="flex items-center px-4 py-3 hover:bg-gray-800/80 transition-colors"
                        >
                          {result.poster && (
                            <div className="relative w-10 h-14 flex-shrink-0 rounded overflow-hidden mr-3">
                              <Image
                                src={result.poster}
                                alt={result.title}
                                fill
                                className="object-cover"
                                sizes="40px"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate text-left">
                              {result.title}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 text-xs mt-0.5">
                              <span
                                className={`px-1.5 py-0.5 rounded-sm text-white ${
                                  result.contentType === "anime"
                                    ? "bg-red-600"
                                    : "bg-blue-600"
                                }`}
                              >
                                {result.contentType === "anime"
                                  ? "Anime"
                                  : "Donghua"}
                              </span>
                              {result.score && (
                                <span className="flex items-center text-yellow-400">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3 w-3 mr-0.5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                  </svg>
                                  {result.score}
                                </span>
                              )}
                              {result.status && (
                                <span className="text-gray-400">
                                  {result.status}
                                </span>
                              )}
                              {result.views && (
                                <span className="text-gray-400">
                                  {(result.views/1000).toFixed(1)}K
                                </span>
                              )}
                            </div>
                          </div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-400"
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
                        </Link>
                      ))}
                    </div>
                    
                    <div className="border-t border-gray-800 mt-2 pt-2 px-4 py-2">
                      <button
                        onClick={handleSearchSubmit}
                        className="w-full text-center text-blue-400 hover:text-blue-300 text-sm"
                      >
                        Lihat semua hasil untuk &quot;{searchTerm}&quot;
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-400">
                    Tidak ditemukan hasil untuk &quot;{searchTerm}&quot;
                  </div>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Hero;
