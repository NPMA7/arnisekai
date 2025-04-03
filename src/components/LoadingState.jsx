/**
 * Komponen untuk menampilkan skeleton loading state
 * @param {Object} props
 * @param {string} props.type - Jenis loading state (default, donghua, anime)
 */
export default function LoadingState({ type = "default" }) {
  // Loading state untuk halaman donghua
  if (type === "donghua") {
    return (
      <div className="bg-[#0f1729] min-h-screen pb-16">
        {/* Navigasi Breadcrumb Skeleton */}
        <div className="bg-[#121a2e] py-3 shadow-md shadow-black/20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div className="flex items-center text-sm flex-wrap">
                <div className="h-4 bg-slate-700 w-16 rounded animate-pulse"></div>
                <span className="mx-2 text-gray-600">/</span>
                <div className="h-4 bg-slate-700 w-20 rounded animate-pulse"></div>
              </div>
              <div className="h-8 bg-slate-700 w-full sm:w-64 md:w-72 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          {/* Header Section Skeleton */}
          <div className="relative mb-12 overflow-hidden rounded-2xl bg-slate-800 animate-pulse h-48"></div>
          
          {/* Latest Releases Section Skeleton */}
          <div className="mb-16">
            <div className="h-8 bg-slate-800 w-60 rounded mb-6 animate-pulse"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {[...Array(12)].map((_, index) => (
                <div key={index} className="rounded-lg aspect-[2/3] bg-slate-800 animate-pulse"></div>
              ))}
            </div>
          </div>
          
          {/* Completed Donghua Section Skeleton */}
          <div className="mb-16">
            <div className="h-8 bg-slate-800 w-60 rounded mb-6 animate-pulse"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="rounded-lg aspect-[2/3] bg-slate-800 animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Loading state untuk halaman anime
  if (type === "anime") {
    return (
      <div className="bg-[#0f1729] min-h-screen pb-16">
        {/* Navigasi Breadcrumb Skeleton */}
        <div className="bg-[#121a2e] py-3 shadow-md shadow-black/20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div className="flex items-center text-sm flex-wrap">
                <div className="h-4 bg-slate-700 w-16 rounded animate-pulse"></div>
                <span className="mx-2 text-gray-600">/</span>
                <div className="h-4 bg-slate-700 w-20 rounded animate-pulse"></div>
              </div>
              <div className="h-8 bg-slate-700 w-full sm:w-64 md:w-72 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          {/* Header Section Skeleton dengan warna anime */}
          <div className="relative mb-12 overflow-hidden rounded-2xl bg-gradient-to-r from-red-900/30 to-blue-900/30 animate-pulse h-48"></div>
          
          {/* Ongoing Anime Section Skeleton */}
          <div className="mb-16">
            <div className="h-8 bg-slate-800 w-60 rounded mb-6 animate-pulse"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {[...Array(12)].map((_, index) => (
                <div key={index} className="rounded-lg aspect-[2/3] bg-slate-800 animate-pulse"></div>
              ))}
            </div>
          </div>
          
          {/* Completed Anime Section Skeleton */}
          <div className="mb-16">
            <div className="h-8 bg-slate-800 w-60 rounded mb-6 animate-pulse"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="rounded-lg aspect-[2/3] bg-slate-800 animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default loading state - dapat diperluas untuk jenis lain
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1729]">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-300">Memuat...</p>
      </div>
    </div>
  );
} 