"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getAnimeUrl, getDonghuaUrl } from '@/lib/apiConfig';

/**
 * Komponen SearchBar yang dapat digunakan di semua halaman
 * @param {Object} props
 * @param {string} props.placeholder - Placeholder untuk input pencarian
 * @param {string} props.className - Class tambahan untuk container
 */
export default function SearchBar({ placeholder = "Cari...", className = "" }) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchTimeoutRef = useRef(null);
  const searchRef = useRef(null);

  // Menentukan apakah kita berada di halaman anime atau donghua
  const isAnimeContext = pathname?.includes('/anime');

  // Menangani klik di luar komponen untuk menutup dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fungsi untuk melakukan pencarian
  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Navigasi ke halaman pencarian sesuai dengan konteks
      if (isAnimeContext) {
        router.push(`/anime/search/${encodeURIComponent(searchQuery.trim())}`);
      } else {
      router.push(`/donghua/search/${encodeURIComponent(searchQuery.trim())}`);
      }
      setShowResults(false);
    }
  };

  // Fungsi untuk menangani input pencarian
  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Reset hasil pencarian jika input kosong
    if (value.trim() === "") {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    // Set state bahwa dropdown hasil pencarian ditampilkan
    setShowResults(true);

    // Implementasi debounce untuk mengurangi jumlah request API
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Mulai pencarian setelah pengguna berhenti mengetik selama 300ms
    searchTimeoutRef.current = setTimeout(() => {
      fetchSearchResults(value);
    }, 300);
  };

  // Fungsi untuk mengambil hasil pencarian dari API
  const fetchSearchResults = async (keyword) => {
    if (!keyword || keyword.trim() === "") return;

    try {
      setIsSearching(true);
      
      // URL endpoint pencarian berdasarkan konteks
      let searchUrl;
      if (isAnimeContext) {
        // URL untuk pencarian anime
        searchUrl = getAnimeUrl(`search/${encodeURIComponent(keyword)}`);
      } else {
        // URL untuk pencarian donghua
        searchUrl = getDonghuaUrl(`search/${encodeURIComponent(keyword)}`);
      }
      
      const response = await fetch(searchUrl, {
        cache: "no-store"
      });
      
      if (!response.ok) {
        throw new Error("Gagal melakukan pencarian");
      }
      
      const data = await response.json();
      
      if (data && data.data) {
        // Batasi hasil menjadi maksimal 5 item
        let results = [];
        if (isAnimeContext && data.data.animes) {
          results = data.data.animes.slice(0, 5);
        } else if (!isAnimeContext && data.data.donghua) {
          results = data.data.donghua.slice(0, 5);
        }
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error searching:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input 
        type="text"
        placeholder={placeholder || (isAnimeContext ? "Cari anime..." : "Cari donghua...")}
        value={searchQuery}
        onChange={handleSearchInput}
        className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg block w-full pl-10 p-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleSearch();
          }
        }}
      />
      <button
        className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-white"
        onClick={handleSearch}
      >
        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>

      {/* Dropdown hasil pencarian */}
      {showResults && (
        <div className="absolute mt-2 w-full bg-gray-800/95 backdrop-blur-md rounded-lg shadow-2xl overflow-hidden z-50">
          {isSearching ? (
            <div className="p-4 text-center">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="py-2 max-h-[400px] overflow-y-auto custom-scrollbar">
              {searchResults.map((result, index) => {
                // Menentukan URL berdasarkan konteks
                const itemUrl = isAnimeContext 
                  ? `/anime/${result.slug}`
                  : `/donghua/${result.slug}`;
                
                // Menentukan warna aksen berdasarkan konteks
                const accentColor = isAnimeContext 
                  ? 'bg-red-600/80 text-red-100' 
                  : 'bg-blue-600/80 text-blue-100';
                
                // Menentukan warna untuk status
                let statusColor = '';
                if (result.status) {
                  if (result.status.toLowerCase().includes('completed')) {
                    statusColor = 'bg-green-600/80 text-green-100';
                  } else if (result.status.toLowerCase().includes('hiatus')) {
                    statusColor = 'bg-yellow-600/80 text-yellow-100';
                  } else {
                    statusColor = isAnimeContext
                      ? 'bg-red-600/80 text-red-100'
                      : 'bg-blue-600/80 text-blue-100';
                  }
                }
                
                return (
                <Link
                  key={index}
                    href={itemUrl}
                  className="flex items-center px-4 py-3 hover:bg-gray-700/80 transition-colors"
                  onClick={() => setShowResults(false)}
                >
                  <div className="w-10 h-14 relative flex-shrink-0">
                    <Image
                      src={result.poster}
                      alt={result.title}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="text-white text-sm font-medium line-clamp-1">{result.title}</div>
                    <div className="flex items-center mt-1">
                        <span className={`text-xs px-1.5 py-0.5 rounded ${statusColor}`}>
                          {result.status || (isAnimeContext ? 'Anime' : 'Donghua')}
                        </span>
                        <span className="text-gray-400 text-xs ml-2">{result.type || (isAnimeContext ? 'TV' : 'Series')}</span>
                        {result.score && (
                          <span className="text-yellow-400 text-xs ml-2 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 mr-0.5">
                              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                            </svg>
                            {result.score}
                      </span>
                        )}
                    </div>
                  </div>
                </Link>
                );
              })}
              <div className="px-4 py-2 border-t border-gray-700">
                <button
                  onClick={handleSearch}
                  className={`text-sm hover:text-blue-300 transition-colors flex items-center w-full justify-center ${isAnimeContext ? 'text-red-400 hover:text-red-300' : 'text-blue-400 hover:text-blue-300'}`}
                >
                  <span>Lihat semua hasil</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-400">
              <div>Tidak ada hasil</div>
              <div className="text-xs text-gray-500 mt-1">Coba kata kunci lain</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 