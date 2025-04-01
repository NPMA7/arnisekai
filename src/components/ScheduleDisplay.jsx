"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// Hari dalam bahasa Indonesia dengan key sesuai API
const daysOfWeek = [
  { id: "sunday", name: "Minggu" },
  { id: "monday", name: "Senin" },
  { id: "tuesday", name: "Selasa" },
  { id: "wednesday", name: "Rabu" },
  { id: "thursday", name: "Kamis" },
  { id: "friday", name: "Jumat" },
  { id: "saturday", name: "Sabtu" }
];

// Mendapatkan hari saat ini
function getCurrentDay() {
  const dayIndex = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
  return daysOfWeek[dayIndex].id;
}

const ScheduleDisplay = () => {
  const [activeDay, setActiveDay] = useState(getCurrentDay());
  const [scheduleData, setScheduleData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Format waktu dalam 24 jam
  function formatTime(timeString) {
    if (!timeString) return "TBA";
    return timeString;
  }

  useEffect(() => {
    const fetchScheduleData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Menggunakan endpoint jadwal anime yang sebenarnya
        const apiKey = process.env.NEXT_PUBLIC_API_KEY;
        const response = await fetch('https://anyapi-beta.vercel.app/v1/anime/samehadaku/schedule', {
          headers: {
            'X-API-Key': apiKey
          },
          cache: 'no-store'
        });
        
        if (!response.ok) {
          throw new Error(`Gagal mengambil data jadwal: ${response.status}`);
        }
        
        const apiData = await response.json();
        
        if (apiData && apiData.status === "Ok" && apiData.data && apiData.data.schedule) {
          setScheduleData(apiData.data.schedule);
        } else {
          throw new Error('Format data API tidak sesuai ekspektasi');
        }
      } catch (error) {
        console.error("Error loading schedule data:", error);
        setError(error.message);
        setScheduleData({});
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchScheduleData();
  }, []);

  const renderScheduleContent = () => {
    if (isLoading) {
      return (
        <div className="py-8">
          <div className="grid grid-cols-1 gap-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex items-center space-x-4 bg-gray-800/40 backdrop-blur-sm p-3 rounded-lg animate-pulse">
                <div className="w-12 h-14 bg-gray-700/70 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-700/70 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-700/70 rounded w-1/2"></div>
                </div>
                <div className="w-14 h-8 bg-gray-700/70 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    if (error || !scheduleData[activeDay] || scheduleData[activeDay].length === 0) {
      return (
        <div className="py-12 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-400">Tidak ada jadwal untuk hari ini</p>
        </div>
      );
    }
    
    return (
      <div className="py-4">
        <div className="grid grid-cols-1 gap-3">
          {scheduleData[activeDay].map((item, index) => (
            <Link 
              href={`/anime/${item.slug}` || '#'} 
              key={item.slug || index}
              className="flex items-center gap-4 bg-gray-800/40 backdrop-blur-sm hover:bg-gray-700/40 rounded-lg p-3 transition-colors group"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="relative w-12 h-16 flex-shrink-0 rounded overflow-hidden">
                <Image
                  src={item.poster}
                  alt={item.title}
                  fill
                  sizes="48px"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium text-base line-clamp-1 group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h3>
                <div className="flex items-center text-gray-400 text-xs mt-1">
                  <span className="mr-2">{item.type || "TV"}</span>
                  {item.genres && <span className="bg-gray-700/80 px-1.5 py-0.5 rounded text-[10px]">{item.genres.split(',')[0]}</span>}
                  {item.score && (
                    <div className="flex items-center ml-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-yellow-400 mr-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                      <span>{item.score}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-gray-900/80 backdrop-blur-sm text-blue-400 text-sm font-medium px-3 py-1.5 rounded">
                {formatTime(item.time)}
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="mb-4 md:mb-0">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 inline-block">
            Jadwal Rilis
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-600 mt-3"></div>
        </div>
      </div>
      
      {/* Day tabs */}
      <div className="flex overflow-x-auto scrollbar-hide space-x-2 mb-4 pb-2">
        {daysOfWeek.map((day) => (
          <button
            key={day.id}
            onClick={() => setActiveDay(day.id)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              activeDay === day.id
                ? "bg-blue-600 text-white"
                : "bg-gray-800/40 text-gray-300 hover:bg-gray-700/40"
            }`}
          >
            {day.name}
          </button>
        ))}
      </div>
      
      {/* Schedule content */}
      <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl overflow-hidden">
        {renderScheduleContent()}
      </div>
    </div>
  );
};

export default ScheduleDisplay; 