import Link from "next/link";

/**
 * Komponen header untuk halaman anime
 */
export default function AnimeHeader() {
  return (
    <div className="relative mb-12 overflow-hidden rounded-2xl">
      <div className="absolute inset-0 bg-gradient-to-r from-red-900 to-blue-900 opacity-90"></div>
      <div className="absolute inset-0 bg-[url('/anime-pattern.jpg')] bg-cover opacity-30 mix-blend-overlay"></div>
      
      <div className="relative z-10 p-8 md:p-12">
        <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-300 to-blue-300 mb-4">
          Anime
        </h1>
        <p className="text-gray-200 text-lg max-w-3xl mb-6">
          Jelajahi koleksi anime Jepang terbaik dengan subtitle Indonesia. 
          Dari series shonen yang populer hingga drama slice of life yang mengharukan, 
          temukan anime favorit Anda disini.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/anime/ongoing" className="bg-red-900/50 text-red-100 px-4 py-1.5 rounded-full hover:bg-red-800/70 transition-colors text-sm">
            Ongoing
          </Link>
          <Link href="/anime/completed" className="bg-red-900/50 text-red-100 px-4 py-1.5 rounded-full hover:bg-red-800/70 transition-colors text-sm">
            Completed
          </Link>
          <Link href="/anime/genres" className="bg-red-900/50 text-red-100 px-4 py-1.5 rounded-full hover:bg-red-800/70 transition-colors text-sm">
            Daftar Genre
          </Link>
          <Link href="/anime/animelist" className="bg-red-900/50 text-red-100 px-4 py-1.5 rounded-full hover:bg-red-800/70 transition-colors text-sm">
            Daftar Anime
          </Link>
        </div>
      </div>
    </div>
  );
} 