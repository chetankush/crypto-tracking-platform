import React from 'react'
import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeContext'
import { MdDarkMode, MdLightMode } from 'react-icons/md'
import { HiMenu, HiX } from 'react-icons/hi'
import { AiOutlineStar } from 'react-icons/ai'
import { useState } from 'react'

interface NavbarProps {
  onFavoritesClick?: () => void;
}

const Navbar = ({ onFavoritesClick }: NavbarProps) => {
  const { isDark, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md border-b border-gray-200 dark:border-dark-border transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600 bg-clip-text text-transparent">
              Ctrack
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">Home</Link>

            {/* Favorites Button */}
            <button
              onClick={onFavoritesClick}
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium"
            >
              <AiOutlineStar className="w-5 h-5" />
              Favorites
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-dark-card hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <MdLightMode className="w-5 h-5 text-yellow-500" />
              ) : (
                <MdDarkMode className="w-5 h-5 text-gray-700" />
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-dark-card hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <MdLightMode className="w-5 h-5 text-yellow-500" />
              ) : (
                <MdDarkMode className="w-5 h-5 text-gray-700" />
              )}
            </button>
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg bg-gray-100 dark:bg-dark-card hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
            >
              {isMobileMenuOpen ? (
                <HiX className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              ) : (
                <HiMenu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-dark-bg border-t border-gray-200 dark:border-dark-border">
          <div className="px-4 py-2 space-y-1">
            <Link href="/" className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium">Home</Link>
            <button
              onClick={onFavoritesClick}
              className="flex items-center gap-2 w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium"
            >
              <AiOutlineStar className="w-5 h-5" />
              Favorites
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
