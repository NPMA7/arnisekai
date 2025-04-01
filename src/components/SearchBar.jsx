"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

/**
 * Komponen SearchBar yang dapat digunakan di semua halaman donghua
 * @param {Object} props
 * @param {string} props.placeholder - Placeholder untuk input pencarian
 * @param {string} props.className - Class tambahan untuk container
 * @param {string} props.inputClassName - Class tambahan untuk input
 * @param {string} props.buttonClassName - Class tambahan untuk tombol
 */
export default function SearchBar({ placeholder = "Cari donghua...", className = "" }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchTimeoutRef = useRef(null);
  const searchRef = useRef(null);

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
      // Navigasi ke halaman pencarian
      router.push(`/donghua/search/${encodeURIComponent(searchQuery.trim())}`);
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
      const apiKey = process.env.NEXT_PUBLIC_API_KEY;
      
      // URL endpoint pencarian donghua
      const searchUrl = `https://anyapi-beta.vercel.app/v1/donghua/anichin/search/${encodeURIComponent(keyword)}`;
      
      const response = await fetch(searchUrl, {
        headers: { "X-API-Key": apiKey },
        cache: "no-store"
      });
      
      if (!response.ok) {
        throw new Error("Gagal melakukan pencarian");
      }
      
      const data = await response.json();
      
      if (data && data.data && data.data.donghua) {
        // Batasi hasil menjadi maksimal 5 item
        const limitedResults = data.data.donghua.slice(0, 5);
        setSearchResults(limitedResults);
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
        placeholder={placeholder}
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
              {searchResults.map((result, index) => (
                <Link
                  key={index}
                  href={`/donghua/${result.slug}`}
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
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        result.status?.toLowerCase().includes('completed') 
                          ? 'bg-green-600/80 text-green-100' 
                          : result.status?.toLowerCase().includes('hiatus')
                            ? 'bg-yellow-600/80 text-yellow-100'
                            : 'bg-blue-600/80 text-blue-100'
                      }`}>
                        {result.status || 'Ongoing'}
                      </span>
                      <span className="text-gray-400 text-xs ml-2">{result.type || 'Donghua'}</span>
                    </div>
                  </div>
                </Link>
              ))}
              <div className="px-4 py-2 border-t border-gray-700">
                <button
                  onClick={handleSearch}
                  className="text-blue-400 text-sm hover:text-blue-300 transition-colors flex items-center w-full justify-center"
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