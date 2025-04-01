"use client";
import Image from "next/image";
import Link from "next/link";

/**
 * Komponen untuk menampilkan kartu anime atau donghua
 * @param {Object} props
 * @param {Object} props.item - Data anime/donghua yang akan ditampilkan
 * @param {string} props.className - Class tambahan jika diperlukan
 * @param {boolean} props.showGenres - Flag untuk menampilkan genre (default: true)
 * @param {string} props.aspectRatio - Rasio aspek gambar (default: "2/3")
 * @param {function} props.onClick - Handler untuk klik pada kartu (opsional)
 */
export default function AnimeCard({ 
  item, 
  className = "", 
  showGenres = true,
  aspectRatio = "2/3",
  onClick
}) {
  // Menformat jumlah views
  const formatViews = (views) => {
    if (!views) return "0";
    if (views >= 1000000) {
      return (views / 1000000).toFixed(1) + "M";
    } else if (views >= 1000) {
      return (views / 1000).toFixed(1) + "K";
    }
    return views.toString();
  };

  // Jika tidak ada item, jangan render apa-apa
  if (!item) return null;

  // Konten kartu
  const cardContent = (
    <>
      <div className={`relative aspect-[${aspectRatio}] overflow-hidden`}>
        <Image
          src={item.poster}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, 16vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAEIQJPfrpQJwAAAABJRU5ErkJggg=="
        />
        
        {/* Content type badge */}
        <div className={`absolute top-1 left-1 ${
          item.contentType === "anime" ? "bg-red-600/90" : "bg-blue-600/90"
        } text-white text-[9px] font-medium px-1.5 py-0.5 rounded-sm backdrop-blur-sm`}>
          {item.contentType === "anime" ? "Anime" : "Donghua"}
        </div>
        
        {/* Status badge if available */}
        {item.status && (
          <div className="absolute top-1 right-1 bg-gray-900/80 text-white text-[9px] font-medium px-1.5 py-0.5 rounded-sm backdrop-blur-sm">
            {item.status}
          </div>
        )}
        
        {/* Info overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-2 transform translate-y-0 transition-transform duration-300 backdrop-blur-sm">
          <div className="flex items-center mb-0.5 justify-between">
            <div className="flex items-center">
              {item.score && (
                <div className="flex items-center text-yellow-400 text-[10px] mr-1.5 font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  {item.score}
                </div>
              )}
              
              {item.type && (
                <div className="text-gray-200 text-[10px] font-medium">
                  {item.type}
                </div>
              )}
            </div>
            
            {item.views && (
              <div className="text-gray-200 text-[9px] flex items-center ml-auto font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 text-gray-300 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {formatViews(item.views)}
              </div>
            )}
          </div>
          
          <h3 className="text-white text-xs font-medium line-clamp-1 group-hover:text-blue-400 transition-colors drop-shadow-sm">
            {item.title}
          </h3>
        </div>
      </div>
      
      
    </>
  );

  // Kelas utama untuk kartu
  const cardClasses = `bg-gray-800/40 backdrop-blur-sm rounded-md overflow-hidden transition-transform duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-blue-500/10 group ${className}`;

  // Jika onClick diberikan, gunakan div dengan onClick, jika tidak, gunakan Link
  return onClick ? (
    <div 
      className={cardClasses} 
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      {cardContent}
    </div>
  ) : (
    <Link 
      href={item.url} 
      className={cardClasses}
    >
      {cardContent}
    </Link>
  );
} 