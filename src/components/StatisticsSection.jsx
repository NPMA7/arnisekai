"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const StatisticsSection = () => {
  const [stats, setStats] = useState({
    animeCount: 0,
    donghuaCount: 0,
    episodeCount: 0,
    userCount: 0
  });
  
  const [isVisible, setIsVisible] = useState(false);
  
  // Statistik target
  const targetStats = {
    animeCount: 1000,
    donghuaCount: 1000,
    episodeCount: 25000,
    userCount: 1000
  };
  
  useEffect(() => {
    // Observer untuk memulai animasi ketika komponen terlihat di viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 } // Trigger ketika 10% dari elemen terlihat
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
  
  // Animasi penghitung
  useEffect(() => {
    if (!isVisible) return;
    
    const duration = 2000; // Durasi animasi dalam ms
    const steps = 20; // Jumlah langkah animasi
    const interval = duration / steps;
    
    const counters = {
      animeCount: { start: 0, end: targetStats.animeCount, current: 0 },
      donghuaCount: { start: 0, end: targetStats.donghuaCount, current: 0 },
      episodeCount: { start: 0, end: targetStats.episodeCount, current: 0 },
      userCount: { start: 0, end: targetStats.userCount, current: 0 }
    };
    
    let step = 0;
    
    const timer = setInterval(() => {
      step += 1;
      
      const progress = step / steps;
      const easeProgress = easeOutQuart(progress);
      
      const newStats = {};
      Object.keys(counters).forEach(key => {
        const { start, end } = counters[key];
        newStats[key] = Math.round(start + (end - start) * easeProgress);
      });
      
      setStats(newStats);
      
      if (step >= steps) {
        clearInterval(timer);
        setStats(targetStats); // Pastikan nilai akhir tepat
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, [isVisible]);
  
  // Fungsi easing untuk animasi yang lebih alami
  const easeOutQuart = (x) => {
    return 1 - Math.pow(1 - x, 4);
  };
  
  // Format angka dengan pemisah ribuan
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  
  const statsItems = [
    {
      title: "Anime",
      value: formatNumber(stats.animeCount),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
          <path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06z" />
        </svg>
      ),
      color: "from-red-600 to-red-400"
    },
    {
      title: "Donghua",
      value: formatNumber(stats.donghuaCount),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
          <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
        </svg>
      ),
      color: "from-blue-600 to-blue-400"
    },
    {
      title: "Episode",
      value: formatNumber(stats.episodeCount),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
          <path fillRule="evenodd" d="M2.625 6.75a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0A.75.75 0 018.25 6h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75zM2.625 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zM7.5 12a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12A.75.75 0 017.5 12zm-4.875 5.25a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75z" clipRule="evenodd" />
        </svg>
      ),
      color: "from-purple-600 to-purple-400"
    },
    {
      title: "Pengguna",
      value: formatNumber(stats.userCount),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
          <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z" clipRule="evenodd" />
          <path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z" />
        </svg>
      ),
      color: "from-green-600 to-green-400"
    }
  ];

  return (
    <div id="statistics-section" className="py-16 bg-gray-900/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 inline-block">
            Statistik Konten
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mt-3"></div>
          <p className="text-gray-300 mt-3 text-lg">
            Temukan ribuan konten anime dan donghua berkualitas tinggi
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {statsItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-br ${item.color} mb-4 text-white`}>
                {item.icon}
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white">{item.value}+</div>
              <div className="text-gray-400 text-sm mt-1">{item.title}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatisticsSection; 