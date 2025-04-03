import Link from "next/link";
import AnimeCard from "./AnimeCard";

/**
 * Komponen untuk menampilkan bagian anime
 * @param {Object} props
 * @param {string} props.title - Judul bagian
 * @param {string} props.linkUrl - URL untuk tombol "Lihat Semua"
 * @param {Array} props.items - Array data anime
 * @param {string} props.type - Tipe anime (ongoing, completed)
 * @param {boolean} props.loading - Status loading
 */
export default function AnimeSection({ 
  title, 
  linkUrl, 
  items = [], 
  type = "ongoing", 
  loading = false 
}) {
  return (
    <section className="mb-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <Link href={linkUrl} className="text-red-400 hover:text-red-300 transition-colors text-sm">
          Lihat Semua →
        </Link>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {loading ? (
          // Skeleton loading state
          Array(12).fill(0).map((_, index) => (
            <AnimeCard key={`skeleton-${index}`} loading={true} />
          ))
        ) : (
          // Actual content
          items.map((item, index) => (
            <AnimeCard 
              key={index} 
              item={item} 
              type={type} 
            />
          ))
        )}
      </div>
    </section>
  );
} 