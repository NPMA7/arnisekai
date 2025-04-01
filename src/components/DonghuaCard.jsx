import Image from "next/image";
import Link from "next/link";

/**
 * Komponen untuk menampilkan kartu donghua
 * @param {Object} props
 * @param {Object} props.item - Data donghua yang akan ditampilkan
 * @param {string} props.type - Tipe donghua (latest, completed)
 * @param {boolean} props.loading - Status loading
 */
export default function DonghuaCard({ item, type = "latest", loading = false }) {
  if (loading) {
    return (
      <div className="relative overflow-hidden rounded-lg aspect-[2/3] bg-slate-800/40 animate-pulse shadow-lg"></div>
    );
  }

  if (!item) return null;

  // Menangani URL yang berbeda berdasarkan tipe
  const url = type === "latest" 
    ? item.url.replace("https://anyapi-beta.vercel.app/v1/donghua/anichin/episode/", "/donghua/watch/")
    : item.url.replace("https://anyapi-beta.vercel.app/v1/donghua/anichin/detail/", "/donghua/");

  // Menangani judul untuk tipe latest
  const title = type === "latest" 
    ? item.title.replace(` ${item.current_episode} Subtitle Indonesia`, '')
    : item.title;

  return (
    <Link href={url} className="group">
      <div className="relative overflow-hidden rounded-lg aspect-[2/3] bg-slate-800/40 shadow-lg hover:shadow-blue-900/30 hover:shadow-xl transition-all duration-300">
        <Image 
          src={item.poster} 
          alt={title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
          className="object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {type === "latest" ? (
          <div className="absolute top-2 right-2 bg-blue-600 text-xs font-medium py-1 px-2 rounded-full backdrop-blur-sm shadow-sm">
            {item.current_episode}
          </div>
        ) : (
          <div className="absolute top-2 right-2 bg-green-600 text-xs font-medium py-1 px-2 rounded-full backdrop-blur-sm shadow-sm">
            {item.type}
          </div>
        )}
        
        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-xs font-medium py-1 px-2 rounded-full text-gray-300 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          {type === "latest" ? "Episode Baru" : "Completed"}
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/95 via-black/80 to-transparent transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
          <h3 className={`line-clamp-2 text-sm font-semibold text-white mb-1 group-hover:${type === "latest" ? "text-blue-300" : "text-green-300"} transition-colors`}>
            {title}
          </h3>
          {type === "latest" ? (
            <p className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
              Klik untuk nonton episode terbaru
            </p>
          ) : (
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
              <span className="text-xs text-gray-400">Sudah tamat</span>
              <span className="bg-green-900/60 text-green-300 text-xs px-1.5 py-0.5 rounded">Series</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
} 