"use client";
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { getAnimeUrl } from "../lib/apiConfig";

// Komponen terpisah untuk Histats Counter
const HistatsCounter = () => {
  useEffect(() => {
    // Pastikan kode hanya berjalan di browser
    if (typeof window !== 'undefined') {
      // Buat variabel Histats jika belum ada
      window._Hasync = window._Hasync || [];
      window._Hasync.push(['Histats.start', '1,4942279,4,602,110,40,00001001']);
      window._Hasync.push(['Histats.fasi', '1']);
      window._Hasync.push(['Histats.track_hits', '']);
      
      // Buat dan tambahkan script
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = '//s10.histats.com/js15_as.js';
      document.head.appendChild(script);

      // Tambahkan interval untuk memastikan histats telah dimuat dan kemudian manipulasi DOM
      const interval = setInterval(() => {
        const histatsCounter = document.getElementById('histats_counter');
        if (histatsCounter && histatsCounter.childNodes.length > 0) {
          clearInterval(interval);
          
          // Tunggu sedikit untuk memastikan semua DOM telah diproses
          setTimeout(() => {
            const counterTable = histatsCounter.querySelector('table');
            if (counterTable) {
              // Ambil hanya elemen yang berisi angka pengunjung (biasanya di baris pertama kolom kedua)
              try {
                const counterCells = counterTable.querySelectorAll('td');
                for (let i = 0; i < counterCells.length; i++) {
                  const cell = counterCells[i];
                  // Sembunyikan sel yang berisi teks "Visits" atau "Online"
                  if (cell.textContent.includes('Visits') || 
                      cell.textContent.includes('Online') ||
                      !(/\d/.test(cell.textContent))) { // Sel yang tidak mengandung angka
                    cell.style.display = 'none';
                  } else {
                    // Untuk sel dengan angka, atur ukuran font
                    cell.style.fontSize = '1.75rem';
                    cell.style.fontWeight = 'bold';
                    cell.style.color = 'white';
                    cell.style.padding = '0';
                  }
                }
              } catch (e) {
                console.error('Error manipulating histats counter:', e);
              }
            }
          }, 500);
        }
      }, 300);
    }
  }, []);
  
  return (
    <div className="histats-wrapper">
      <div id="histats_counter"></div>
      <noscript>
        <a href="/" target="_blank" rel="noreferrer">
          <img src="//sstatic1.histats.com/0.gif?4942279&101" alt="free website stats program" border="0" />
        </a>
      </noscript>
    </div>
  );
};

const StatisticsSection = () => {
  // Hitung donghua count berdasarkan formula
  const donghuaCountValue = 19300; // Nilai sesuai screenshot

  // Initial values dengan nilai default
  const [stats, setStats] = useState({
    animeCount: 0,
    donghuaCount: 0,
    episodeCount: 0,
    userCount: 0
  });
  
  const [isVisible, setIsVisible] = useState(false);
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  
  // Ref untuk menyimpan nilai target animasi
  const targetStats = useRef({
    animeCount: 9904, // Nilai sesuai screenshot
    donghuaCount: donghuaCountValue,
    episodeCount: 350448, // Nilai sesuai screenshot
    userCount: 0
  });
  
  // Fetch data anime dari API
  useEffect(() => {
    const fetchAnimeData = async () => {
      try {
        const response = await fetch(getAnimeUrl('anime-list/1'), {
          cache: "no-store",
        });
        
        if (!response.ok) {
          throw new Error(`Gagal mengambil data anime: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data?.data?.animes && data?.data?.pagination) {
          const animePerPage = data.data.animes.length;
          const totalPages = data.data.pagination.total_pages;
          
          // Hitung total anime
          const totalAnime = Math.min(animePerPage * totalPages, 9904); // Maksimal 9904 sesuai screenshot
          
          // Update nilai target animasi dengan data API dan perhitungan episode
          targetStats.current = {
            ...targetStats.current,
            animeCount: totalAnime
          };
          
          setIsApiLoaded(true);
        } else {
          setIsApiLoaded(true); // Tetap set loaded meskipun ada error
        }
      } catch (error) {
        setIsApiLoaded(true); // Tetap set loaded meskipun ada error
      }
    };
    
    fetchAnimeData();
  }, []);
  
  // Deteksi visibility untuk memulai animasi
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    
    const element = document.getElementById('statistics-section');
    if (element) {
      observer.observe(element);
    }
    
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);
  
  // Animasi penghitung ketika section visible DAN data API sudah dimuat
  useEffect(() => {
    if (!isVisible || !isApiLoaded) {
      return; // Tunggu hingga section visible dan API loaded
    }
    
    const duration = 2000;
    const steps = 20;
    const interval = duration / steps;
    
    // Selalu mulai dari 0
    const startValues = {
      animeCount: 0,
      donghuaCount: 0,
      episodeCount: 0,
      userCount: 0
    };
    
    let step = 0;
    
    const timer = setInterval(() => {
      step += 1;
      
      const progress = step / steps;
      const easeProgress = easeOutQuart(progress);
      
      const newStats = {};
      Object.keys(startValues).forEach(key => {
        const start = startValues[key];
        const end = targetStats.current[key];
        newStats[key] = Math.round(start + (end - start) * easeProgress);
      });
      
      setStats(newStats);
      
      if (step >= steps) {
        clearInterval(timer);
        // Set nilai akhir persis sama dengan target
        setStats({
          animeCount: targetStats.current.animeCount,
          donghuaCount: targetStats.current.donghuaCount,
          episodeCount: targetStats.current.episodeCount,
          userCount: targetStats.current.userCount
        });
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, [isVisible, isApiLoaded]); // Jalankan animasi ketika kedua kondisi terpenuhi
  
  // Fungsi easing untuk animasi
  const easeOutQuart = (x) => {
    return 1 - Math.pow(1 - x, 4);
  };
  
  // Format angka dengan pemisah ribuan
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  
  // Data statistik sesuai dengan screenshot
  const statsItems = [
    {
      title: "Anime",
      value: formatNumber(stats.animeCount),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
          <path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06z" />
        </svg>
      ),
      bgColor: "#F4405F",
      textColor: "#FFFFFF"
    },
    {
      title: "Donghua",
      value: formatNumber(stats.donghuaCount),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
          <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
        </svg>
      ),
      bgColor: "#3B82F6",
      textColor: "#FFFFFF"
    },
    {
      title: "Episode",
      value: formatNumber(stats.episodeCount),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
          <path fillRule="evenodd" d="M2.625 6.75a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0A.75.75 0 018.25 6h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75zM2.625 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zM7.5 12a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12A.75.75 0 017.5 12zm-4.875 5.25a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75z" clipRule="evenodd" />
        </svg>
      ),
      bgColor: "#9333EA",
      textColor: "#FFFFFF"
    },
    {
      hasCustomValue: false,
      hasHistats: true,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
          <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z" clipRule="evenodd" />
          <path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z" />
        </svg>
      ),
      bgColor: "#10B981",
      textColor: "#FFFFFF"
    }
  ];

  return (
    <div id="statistics-section" className="py-16 bg-[#121827] relative">
      {/* Background dengan efek gradien */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-purple-900/10 pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-blue-400 mb-2">
            Statistik Konten
          </h2>
          <div className="h-1 w-20 bg-blue-500 mx-auto mb-6"></div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Temukan ribuan konten anime dan donghua berkualitas tinggi
          </p>
        </div>
        
        {/* 3 Kartu statistik utama dalam 3 kolom */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
          {statsItems.slice(0, 3).map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-800/60 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl transform hover:translate-y-[-5px] transition-all duration-300"
            >
              {/* Header dengan ikon */}
              <div 
                className="px-4 py-4 flex justify-center items-center" 
                style={{ backgroundColor: item.bgColor }}
              >
                <div className="text-white">{item.icon}</div>
              </div>
              
              {/* Body dengan statistik */}
              <div className="px-4 py-6 text-center">
                <div className="font-bold text-white text-2xl md:text-3xl mb-2">{item.value}+</div>
                <div className="text-gray-400 text-sm font-medium">{item.title}</div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Kartu Pengguna dengan Histats di bawah dengan lebar penuh */}
        {statsItems.length > 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-gray-800/60 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl transform hover:translate-y-[-5px] transition-all duration-300"
          >
            {/* Header dengan ikon */}
            <div 
              className="px-4 py-4 flex justify-center items-center" 
              style={{ backgroundColor: statsItems[3].bgColor }}
            >
              <div className="text-white">{statsItems[3].icon}</div>
            </div>
            
            {/* Body dengan statistik */}
            <div className="px-4 py-6 text-center">
              <div className="text-gray-400 text-sm font-medium">{statsItems[3].title}</div>
              
              <div className="histats-container max-w-md mx-auto">
                <div className="text-xs text-gray-500 mb-1">Live Stats</div>
                <HistatsCounter />
              </div>
            </div>
          </motion.div>
        )}
      </div>
      
      <style jsx global>{`
        #statistics-section {
          background-color: #121827;
        }
        
        #histats_counter {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 30px;
          font-weight: bold;
          color: white;
          transform: scale(1.2);
        }
        
        .histats-wrapper {
          position: relative;
          width: 100%;
          min-height: 30px;
          margin-top: -5px;
          margin-bottom: -5px;
        }
        
        /* Styling untuk tabel histats */
        #histats_counter table {
          margin: 0 auto !important;
          border-collapse: collapse;
        }
        
        /* Hapus border dan styling tidak perlu */
        #histats_counter table,
        #histats_counter table tr,
        #histats_counter table td {
          border: none !important;
          background-color: transparent !important;
        }
        
        #histats_counter img {
          max-width: 100%;
          height: auto;
        }
      `}</style>
    </div>
  );
};

export default StatisticsSection; 