import Link from "next/link";

/**
 * Komponen header untuk halaman donghua
 */
export default function DonghuaHeader() {
  return (
    <div className="relative mb-12 overflow-hidden rounded-2xl">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-purple-900 opacity-90"></div>
      <div className="absolute inset-0 bg-[url('/donghua-pattern.jpg')] bg-cover opacity-30 mix-blend-overlay"></div>
      
      <div className="relative z-10 p-8 md:p-12">
        <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300 mb-4">
          Donghua
        </h1>
        <p className="text-gray-200 text-lg max-w-3xl mb-6">
          Jelajahi koleksi donghua (animasi Tiongkok) terbaik dengan subtitle Indonesia. 
          Dari series kultivasi yang populer hingga adaptasi novel web terkenal, temukan 
          petualangan baru Anda disini.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/donghua/ongoing" className="bg-blue-900/50 text-blue-100 px-4 py-1.5 rounded-full hover:bg-blue-800/70 transition-colors text-sm">
            Ongoing
          </Link>
          <Link href="/donghua/completed" className="bg-blue-900/50 text-blue-100 px-4 py-1.5 rounded-full hover:bg-blue-800/70 transition-colors text-sm">
            Completed
          </Link>
          <Link href="/donghua/genres" className="bg-blue-900/50 text-blue-100 px-4 py-1.5 rounded-full hover:bg-blue-800/70 transition-colors text-sm">
            Daftar Genre
          </Link>
          <Link href="/donghua/seasons" className="bg-blue-900/50 text-blue-100 px-4 py-1.5 rounded-full hover:bg-blue-800/70 transition-colors text-sm">
            Daftar Seasons
          </Link>
        </div>
      </div>
    </div>
  );
} 