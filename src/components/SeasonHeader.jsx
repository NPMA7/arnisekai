import Link from "next/link";

/**
 * Komponen header untuk halaman seasons
 * @param {Object} props
 * @param {string} props.title - Judul season (tahun atau musim)
 * @param {number} props.totalDonghua - Jumlah total donghua
 * @param {string} props.backgroundImage - URL gambar latar belakang
 * @param {string} props.backgroundClass - Kelas latar belakang alternatif
 * @param {ReactNode} props.decoration - Elemen dekoratif musiman
 */
export default function SeasonHeader({ 
  title, 
  totalDonghua = 0, 
  backgroundImage,
  backgroundClass = "bg-gray-800", 
  decoration 
}) {
  return (
    <div className="relative bg-[#0f1729] border-b border-gray-800">
      {/* Background dengan efek blur untuk musiman */}
      {backgroundImage && (
        <div 
          className="absolute inset-0 w-full overflow-hidden h-full"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(2.5px) brightness(0.7)',
            zIndex: 0
          }}
        ></div>
      )}
      
      {/* Fallback background jika tidak ada gambar */}
      {!backgroundImage && (
        <div className={`absolute inset-0 w-full h-full ${backgroundClass}`}></div>
      )}
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#0f1729]/70 to-[#0f1729]/30"></div>
      
      {/* Dekorasi musiman */}
      {decoration && (
        <div className="absolute inset-0 pointer-events-none">
          {decoration}
        </div>
      )}
      
      {/* Konten utama */}
      <div className="container mx-auto px-4 py-12 relative z-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
              <span className="mr-3 text-5xl text-blue-400 opacity-80">#</span>
              {title}
            </h1>
            <p className="text-blue-100">
              {totalDonghua} donghua
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
                <Link href="/donghua" className="px-3 py-2 bg-blue-800/30 text-sm rounded-md text-blue-200 hover:bg-blue-700/30 transition-colors flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                  </svg>
                  Semua Donghua
                </Link>
                <Link href="/donghua?status=ongoing" className="px-3 py-2 bg-blue-800/30 text-sm rounded-md text-blue-200 hover:bg-blue-700/30 transition-colors flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                  Ongoing
                </Link>
                <Link href="/donghua?status=completed" className="px-3 py-2 bg-blue-800/30 text-sm rounded-md text-blue-200 hover:bg-blue-700/30 transition-colors flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Completed
                </Link>
                <Link href="/donghua/seasons" className="px-3 py-2 bg-blue-700 text-sm rounded-md text-white font-medium flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                  </svg>
                  Seasons
                </Link>
              </div>
        </div>
      </div>
    </div>
  );
} 