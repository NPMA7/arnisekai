"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

const FeaturedContent = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [error, setError] = useState(null);

  // Load data at component mount
  useEffect(() => {
    const loadFeaturedContent = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Mengambil data dari dua API: Donghua dan Anime
        const apiKey = process.env.NEXT_PUBLIC_API_KEY;
        
        // Fetch donghua data
        const donghuaResponse = await fetch('https://anyapi-beta.vercel.app/v1/donghua/anichin/ongoing', {
          headers: {
            'X-API-Key': apiKey
          },
          cache: 'no-store'
        });
        
        // Fetch anime data
        const animeResponse = await fetch('https://anyapi-beta.vercel.app/v1/anime/samehadaku/ongoing', {
          headers: {
            'X-API-Key': apiKey
          },
          cache: 'no-store'
        });
        
        if (!donghuaResponse.ok && !animeResponse.ok) {
          throw new Error(`Gagal mengambil data: Donghua (${donghuaResponse.status}), Anime (${animeResponse.status})`);
        }
        
        let combinedItems = [];
        
        // Process donghua data if available
        if (donghuaResponse.ok) {
          const donghuaData = await donghuaResponse.json();
          
          if (donghuaData && donghuaData.status === "Ok" && donghuaData.data && donghuaData.data.ongoing_donghua && Array.isArray(donghuaData.data.ongoing_donghua)) {
            // Map donghua items
            const donghuaItems = donghuaData.data.ongoing_donghua.slice(0, 2).map(item => ({
              id: item.slug ? item.slug.replace('/', '') : Math.random().toString(36),
              title: item.title || 'Tanpa Judul',
              description: "Donghua terbaru yang sedang ongoing. Tonton episode terbarunya sekarang di Arnisekai!",
              image: item.poster || 'https://via.placeholder.com/800x450?text=No+Image',
              type: "Donghua",
              status: item.status || 'Ongoing',
              rating: (7.5 + Math.random() * 2).toFixed(1), // Generate random rating antara 7.5-9.5
              url: `/donghua/${item.slug ? item.slug.replace('/', '') : ''}`,
              categories: ['Action', 'Fantasy', 'Adventure']
            }));
            
            combinedItems = [...combinedItems, ...donghuaItems];
          }
        }
        
        // Process anime data if available
        if (animeResponse.ok) {
          const animeData = await animeResponse.json();
          
          if (animeData && animeData.status === "Ok" && animeData.data && animeData.data.animes && Array.isArray(animeData.data.animes)) {
            // Map anime items
            const animeItems = animeData.data.animes.slice(0, 2).map(item => ({
              id: item.slug || Math.random().toString(36),
              title: item.title || 'Tanpa Judul',
              description: item.synopsis || "Anime terbaru yang sedang ongoing. Tonton episode terbarunya sekarang di Arnisekai!",
              image: item.poster || 'https://via.placeholder.com/800x450?text=No+Image',
              type: "Anime",
              status: item.status || 'Ongoing',
              rating: item.score || (7.5 + Math.random() * 2).toFixed(1),
              url: `/anime/${item.slug}`,
              categories: item.genres ? item.genres.slice(0, 3).map(g => g.name) : ['Drama', 'Fantasy']
            }));
            
            combinedItems = [...combinedItems, ...animeItems];
          }
        }
        
        if (combinedItems.length === 0) {
          throw new Error('Tidak berhasil mendapatkan data dari kedua API');
        }
        
        // Shuffle the combined list to mix donghua and anime
        const shuffledItems = combinedItems.sort(() => 0.5 - Math.random());
        setFeaturedItems(shuffledItems.slice(0, 4)); // Show maximum 4 featured items
        
      } catch (error) {
        console.error("Error loading featured content:", error);
        setError(error.message);
        setFeaturedItems([]); // Set empty array instead of dummy data
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFeaturedContent();
  }, []);

  // Carousel controls
  const nextSlide = useCallback(() => {
    if (featuredItems.length === 0) return;
    setCurrentSlide((prev) => (prev === featuredItems.length - 1 ? 0 : prev + 1));
  }, [featuredItems.length]);

  const prevSlide = useCallback(() => {
    if (featuredItems.length === 0) return;
    setCurrentSlide((prev) => (prev === 0 ? featuredItems.length - 1 : prev - 1));
  }, [featuredItems.length]);

  // Auto-slide
  useEffect(() => {
    if (isLoading || featuredItems.length === 0) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 8000);

    return () => clearInterval(interval);
  }, [isLoading, nextSlide, featuredItems.length]);
  
  // Handle dot navigation
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 inline-block">
            Konten Ongoing
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mt-3"></div>
        </div>
        
        <div className="w-full h-[400px] bg-gray-800/50 rounded-2xl animate-pulse flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error || featuredItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 inline-block">
            Konten Ongoing
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mt-3"></div>
        </div>
        
        <div className="w-full py-16 bg-gray-800/30 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-xl font-semibold text-white mb-2">
            Tidak dapat memuat konten
          </h3>
          <p className="text-gray-300 max-w-md mx-auto">
            {error || "Sepertinya ada masalah dalam memuat konten. Silakan coba muat ulang halaman ini."}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full transition-colors"
          >
            Muat Ulang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 inline-block">
          Anime & Donghua Ongoing
        </h2>
        <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mt-3"></div>
        <p className="text-gray-300 mt-3 text-lg">
          Jelajahi konten terbaru yang sedang tayang
        </p>
      </div>
      
      <div className="relative w-full overflow-hidden rounded-2xl shadow-2xl bg-gray-900/40 backdrop-blur-sm">
        {/* Carousel */}
        <div className="relative h-[500px] overflow-hidden">
          {featuredItems.map((item, index) => (
            <div
              key={item.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              {/* Background image with overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10"></div>
              <div className="absolute inset-0">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="100vw"
                  className="object-cover object-center"
                  priority={index === currentSlide}
                  loading={index === currentSlide ? "eager" : "lazy"}
                />
              </div>
              
              {/* Content */}
              <div className="relative z-20 h-full flex flex-col justify-center p-8 md:p-16 max-w-2xl">
                <div className="flex items-center space-x-3 mb-4">
                  <span className={`text-white text-xs font-bold px-3 py-1 rounded-full ${
                    item.type === "Anime" ? "bg-red-600" : "bg-blue-600"
                  }`}>
                    {item.type}
                  </span>
                  <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {item.status}
                  </span>
                  <span className="flex items-center bg-yellow-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                    {item.rating}
                  </span>
                </div>
                
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {item.title}
                </h3>
                
                <p className="text-gray-300 mb-6 line-clamp-3">
                  {item.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {item.categories.map((category) => (
                    <span key={category} className="bg-gray-700/50 text-gray-300 text-xs px-3 py-1 rounded-full">
                      {category}
                    </span>
                  ))}
                </div>
                
                <Link
                  href={item.url}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full inline-block transition-all duration-300 transform hover:scale-105 shadow-lg w-fit"
                >
                  Tonton Sekarang
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        {/* Navigation arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full z-30 transition-all"
          aria-label="Previous slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full z-30 transition-all"
          aria-label="Next slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        {/* Dots indicators */}
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
          {featuredItems.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide
                  ? "bg-blue-500 w-6"
                  : "bg-gray-400/50 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedContent; 