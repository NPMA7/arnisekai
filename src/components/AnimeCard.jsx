"use client";
import Image from "next/image";
import Link from "next/link";

/**
 * Komponen untuk menampilkan kartu anime
 * @param {Object} props
 * @param {Object} props.item - Data anime yang akan ditampilkan
 * @param {string} props.type - Tipe anime (ongoing, completed)
 * @param {boolean} props.loading - Status loading
 * @param {boolean} props.showGenres - Tampilkan genre
 */
export default function AnimeCard({ item, type = "ongoing", loading = false, showGenres = false }) {
  if (loading) {
    return (
      <div className="relative overflow-hidden rounded-lg aspect-[2/3] bg-slate-800/40 animate-pulse shadow-lg"></div>
    );
  }

  if (!item) return null;

  const getLocalUrl = () => {
    if (!item.url) {
      // Jika tidak ada URL, gunakan slug jika tersedia
      return item.slug ? `/anime/${item.slug}` : '/anime';
    }
    
    // Handle URL untuk episode
    if (type === "latest" && item.url.includes('/episode/')) {
      // Ekstrak slug episode
      let slug = '';
      if (item.url.includes('anichin/episode/')) {
        slug = item.url.split('anichin/episode/').pop();
      } else if (item.url.includes('/episode/')) {
        slug = item.url.split('/episode/').pop();
      }
      
      return slug ? `/anime/watch/${slug}` : '/anime';
    } 
    
    // Handle URL untuk detail donghua
    if (item.url.includes('/detail/')) {
      // Ekstrak slug donghua
      let slug = '';
      if (item.url.includes('anichin/detail/')) {
        slug = item.url.split('anichin/detail/').pop();
      } else if (item.url.includes('/detail/')) {
        slug = item.url.split('/detail/').pop();
      }
      
      return slug ? `/anime/${slug}` : '/anime';
    }
    
    // Jika ada slug dalam item tapi format URL tidak dikenali
    if (item.slug) {
      return `/anime/${item.slug}`;
    }
    
    // Fallback, gunakan URL asli
    return item.url;
  };

  const url = getLocalUrl();

  // Menangani judul untuk tipe ongoing vs completed
  const title = item.title || "";
  
  // Menentukan warna label berdasarkan content type
  const labelColor = item.contentType === 'donghua' ? 'bg-blue-600' : 'bg-red-600';
  const contentTypeLabel = item.contentType === 'donghua' ? 'Donghua' : 'Anime';

  return (
    <Link href={url} className="group">
      <div className="relative overflow-hidden rounded-lg aspect-[2/3] bg-slate-800/40 shadow-lg hover:shadow-xl transition-all duration-300">
        <Image 
          src={item.poster} 
          alt={title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
          className="object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="absolute top-2 right-2 text-xs font-medium py-1 px-2 rounded-full backdrop-blur-sm shadow-sm" 
             style={{ backgroundColor: item.contentType === 'donghua' ? 'rgb(37, 99, 235)' : 'rgb(220, 38, 38)' }}>
          {item.episode ? `EP ${item.episode}` : contentTypeLabel}
        </div>
        
        {item.score && (
          <div className="absolute top-2 left-2 bg-yellow-600/80 backdrop-blur-sm text-xs font-medium py-1 px-2 rounded-full text-white">
            ★ {item.score}
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/95 via-black/80 to-transparent transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="line-clamp-2 text-sm font-semibold text-white mb-1 transition-colors">
            {title}
          </h3>
          {showGenres && item.genres && item.genres.length > 0 ? (
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
              <span className="text-xs text-gray-300">{item.genres[0].name}</span>
              {item.status && (
                <span className={`${item.status.toLowerCase().includes('completed') ? 'bg-green-900/60 text-green-300' : 'bg-gray-700/60 text-gray-300'} text-xs px-1.5 py-0.5 rounded`}>
                  {item.status}
                </span>
              )}
            </div>
          ) : (
            <p className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
              {item.released_time || item.type || contentTypeLabel}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
} 