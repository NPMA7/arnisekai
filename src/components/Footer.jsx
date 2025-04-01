"use client";

import Link from "next/link";
import { useState } from "react";

// Genre Anime dari API
const animeGenres = [
  "Action", "Adventure", "Comedy", "Drama", "Fantasy", 
  "Shounen", "School", "Romance", "Supernatural", "Isekai", 
  "Sci-Fi", "Seinen", "Reincarnation", "Historical", "Mystery", 
  "Super Power", "Harem", "Ecchi", "Slice of Life", "Sports"
];

// Genre Donghua dari API (menghilangkan tahun dan studio)
const donghuaGenres = [
  "Action", "Adventure", "Comedy", "Cultivation", "Demons", 
  "Drama", "Ecchi", "Fantasy", "Friendship", "Game", 
  "Gore", "Harem", "Historical", "Horror", "Isekai", 
  "Magic", "Martial Arts", "Mecha", "Military", "Mystery", 
  "Mythology", "Psychological", "Romance", "School", "Sci-Fi", 
  "Shoujo", "Shounen", "Slice of Life", "Space", "Sports", 
  "Super Power", "Supernatural", "Suspense", "Thriller"
];

const Footer = () => {
  const [email, setEmail] = useState("");
  const [activeGenreTab, setActiveGenreTab] = useState("anime"); // anime atau donghua

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implementasi subscribe dapat ditambahkan di sini
    alert("Terima kasih telah berlangganan!");
    setEmail("");
  };

  return (
    <footer className="bg-[#0a111f] relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-20 -bottom-12 w-64 h-64 rounded-full bg-blue-500/20 blur-3xl"></div>
        <div className="absolute -left-20 top-12 w-72 h-72 rounded-full bg-purple-500/20 blur-3xl"></div>
      </div>

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto pt-12 pb-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-gray-700/50">
          {/* Column 1 - About */}
          <div className="col-span-1 md:col-span-4">
            <div className="flex items-center mb-4">
              <div className="mr-2 relative flex items-center">
                <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                  <span className="text-white font-bold text-xl">A</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                <div
                  className="absolute -bottom-1 -left-1 w-2 h-2 bg-purple-400 rounded-full animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                ></div>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                Arnisekai
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Situs menonton anime dan donghua secara online & gratis dengan
              kualitas ultra HD tanpa registrasi atau pembayaran.
            </p>
            <div className="flex space-x-3">
              
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
             Tautan Cepat
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/anime"
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-blue-400 transition-colors"
              >
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                Anime
              </Link>
              <Link
                href="/donghua" 
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-blue-400 transition-colors"
              >
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                Donghua
              </Link>
              <Link
                href="/anime/ongoing" 
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-blue-400 transition-colors"
              >
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                Ongoing
              </Link>
              <Link
                href="/donghua/ongoing" 
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-blue-400 transition-colors"
              >
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                Ongoing
              </Link>
              <Link
                href="/anime/completed"
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-blue-400 transition-colors"
              >
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                Completed
              </Link>         
              <Link
                href="/donghua/completed"
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-blue-400 transition-colors"
              >
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                Completed
              </Link>    
            </div>
          </div>

          {/* Column 3 - Genre with Tabs */}
          <div className="col-span-1 md:col-span-6">
            <div className="flex mb-4 border-b border-gray-800">
              <button
                onClick={() => setActiveGenreTab("anime")}
                className={`px-4 py-2 text-sm font-medium ${
                  activeGenreTab === "anime"
                    ? "text-blue-400 border-b-2 border-blue-400"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                Genre Anime
              </button>
              <button
                onClick={() => setActiveGenreTab("donghua")}
                className={`px-4 py-2 text-sm font-medium ${
                  activeGenreTab === "donghua"
                    ? "text-blue-400 border-b-2 border-blue-400"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                Genre Donghua
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2 max-h-[300px] pr-2">
              {(activeGenreTab === "anime" ? animeGenres : donghuaGenres).map((genre, index) => (
                <Link
                  key={index}
                  href={activeGenreTab === "anime" 
                    ? `/anime/genres/${genre.toLowerCase().replace(/ /g, "-")}` 
                    : `/donghua/genres/${genre.toLowerCase().replace(/ /g, "-")}`
                  }
                  className={`text-xs py-1 px-2 ${
                    activeGenreTab === "anime"
                      ? "bg-red-900/30 hover:bg-red-900/50"
                      : "bg-blue-900/30 hover:bg-blue-900/50"
                  } text-gray-300 rounded-md transition-colors`}
                >
                  {genre}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Arnisekai. All Rights Reserved. Situs
            ini tidak menyimpan file di server kami.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
