"use client";
import Image from "next/image";
import Link from "next/link";

/**
 * Komponen untuk menampilkan kartu anime
 * @param {Object} props
 * @param {Object} props.item - Data anime yang akan ditampilkan
 * @param {string} props.type - Tipe anime (ongoing, completed)
 * @param {boolean} props.loading - Status loading
 */
export default function AnimeCard({ item, type = "ongoing", loading = false }) {
  if (loading) {
    return (
      <div className="relative overflow-hidden rounded-lg aspect-[2/3] bg-slate-800/40 animate-pulse shadow-lg"></div>
    );
  }

  if (!item) return null;

  // Menangani URL untuk detail anime
  const url = item.detail_url 
    ? `/anime/${item.slug}` 
    : `/anime/${item.slug}`;

  // Menangani judul untuk tipe ongoing vs completed
  const title = item.title || "";

  return (
    <Link href={url} className="group">
      <div className="relative overflow-hidden rounded-lg aspect-[2/3] bg-slate-800/40 shadow-lg hover:shadow-red-900/30 hover:shadow-xl transition-all duration-300">
        <Image 
          src={item.poster} 
          alt={title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
          className="object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {type === "ongoing" ? (
          <div className="absolute top-2 right-2 bg-red-600 text-xs font-medium py-1 px-2 rounded-full backdrop-blur-sm shadow-sm">
            {item.episode ? `EP ${item.episode}` : "NEW"}
          </div>
        ) : (
          <div className="absolute top-2 right-2 bg-green-600 text-xs font-medium py-1 px-2 rounded-full backdrop-blur-sm shadow-sm">
            {item.type || "TV"}
          </div>
        )}
        
        {item.score && (
          <div className="absolute top-2 left-2 bg-yellow-600/80 backdrop-blur-sm text-xs font-medium py-1 px-2 rounded-full text-white">
            ★ {item.score}
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/95 via-black/80 to-transparent transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
          <h3 className={`line-clamp-2 text-sm font-semibold text-white mb-1 group-hover:${type === "ongoing" ? "text-red-300" : "text-green-300"} transition-colors`}>
            {title}
          </h3>
          {type === "ongoing" ? (
            <p className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
              {item.released_time ? `${item.released_time}` : "Episode terbaru"}
            </p>
          ) : (
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
              {item.genres && item.genres.length > 0 && (
                <span className="text-xs text-gray-400">{item.genres[0].name}</span>
              )}
              <span className="bg-green-900/60 text-green-300 text-xs px-1.5 py-0.5 rounded">Completed</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
} 