'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

// Komponen Logo Arnisekai
const Logo = () => (
  <div className="mr-4 relative flex items-center">
    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
      <span className="text-white font-bold text-xl">A</span>
    </div>
    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
    <div
      className="absolute -bottom-1 -left-1 w-2 h-2 bg-purple-400 rounded-full animate-pulse"
      style={{ animationDelay: "0.5s" }}
    ></div>
  </div>
);

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-[#0f1729]/90 backdrop-blur-sm shadow-lg' 
          : 'bg-[#0f1729] border-b border-gray-800'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Logo />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                Arnisekai
              </span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="/anime" className="hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium text-white">
                Anime
              </Link>
              <Link href="/donghua" className="hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium text-white">
                Donghua
              </Link>
            </div>
          </div>
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="text-white hover:text-blue-400 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${
        isMenuOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
      } overflow-hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-[#0f1729] border-t border-gray-800">
          <Link 
            href="/anime" 
            className="block hover:text-blue-400 px-3 py-2 rounded-md text-base font-medium text-white"
            onClick={() => setIsMenuOpen(false)}
          >
            Anime
          </Link>
          <Link 
            href="/donghua" 
            className="block hover:text-blue-400 px-3 py-2 rounded-md text-base font-medium text-white"
            onClick={() => setIsMenuOpen(false)}
          >
            Donghua
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 