"use client";
import { useLogout } from "@/app/hooks/uselogout";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Search, ShoppingCart, User, Menu, X, Languages } from "lucide-react";

export default function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const handlelogout = useLogout();
  
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchQuery(e.target.value);
    
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search:", searchQuery);
    setSearchQuery("");
  };

  // Handle navbar transparency on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsProfileOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 bg-greens z-50 transition-all duration-300 ${
        scrolled ? "py-2 shadow-lg" : "py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors" 
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Logo with subtle effect */}
        <div className="flex-shrink-0">
          <Link 
            href="/" 
            className="text-2xl font-bold text-white flex items-center tracking-tight hover:scale-105 transition-transform"
          >
            <span className="mr-1">The</span>
            <span className="bg-white/10 px-2 py-1 rounded">Company</span>
          </Link>
        </div>

        {/* Desktop Navigation Links - Added */}
        <div className="hidden md:flex items-center space-x-6 text-white/90 font-medium">
          <Link href="/" className="hover:text-white hover:underline underline-offset-4 transition-colors">Home</Link>
          <Link href="/products" className="hover:text-white hover:underline underline-offset-4 transition-colors">Products</Link>
          <Link href="/about" className="hover:text-white hover:underline underline-offset-4 transition-colors">About</Link>
          <Link href="/contact" className="hover:text-white hover:underline underline-offset-4 transition-colors">Contact</Link>
        </div>

        {/* Centered Search Bar - Responsive */}
        <div className="hidden md:flex flex-1 justify-center max-w-md mx-6">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-white/70" />
            </div>
          </form>
        </div>

        {/* Icons on the Right */}
        <div className="flex items-center space-x-1 md:space-x-4">
          <Link href="/cart" className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ShoppingCart className="h-5 w-5 text-white" />
          </Link>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              toggleProfile();
            }} 
            className="p-2 hover:bg-white/10 rounded-full transition-colors focus:outline-none relative"
          >
            <User className="h-5 w-5 text-white" />
            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 bg-white shadow-lg rounded-md w-48 overflow-hidden z-50 border border-gray-100">
                <ul className="py-1">
                  <li className="hover:bg-gray-50 transition-colors">
                    <Link href="/profile" className="block px-4 py-2 text-gray-800">Profile</Link>
                  </li>
                  <li className="hover:bg-gray-50 transition-colors">
                    <Link href="/orders" className="block px-4 py-2 text-gray-800">Orders</Link>
                  </li>
                  <li className="hover:bg-gray-50 transition-colors border-t border-gray-100">
                    <button 
                      onClick={handlelogout} 
                      className="w-full text-left px-4 py-2 text-red-600 font-medium"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </button>
          
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Languages className="h-5 w-5 text-white" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {/* Mobile Search - Added below hamburger menu */}
      <div className={`md:hidden px-4 pb-2 ${isMenuOpen ? "block" : "hidden"}`}>
        <form onSubmit={handleSearchSubmit} className="relative w-full mt-2">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-white/70" />
          </div>
        </form>
      </div>

      {/* Mobile Dropdown Menu - Enhanced */}
      {isMenuOpen && (
        <div className="md:hidden bg-greens/95 backdrop-blur-sm text-white border-t border-white/10 animate-fadeIn">
          <div className="py-2 px-4">
            <Link href="/" className="flex items-center py-3 hover:bg-white/10 px-2 rounded-lg transition-colors">
              Home
            </Link>
            <Link href="/products" className="flex items-center py-3 hover:bg-white/10 px-2 rounded-lg transition-colors">
              Products
            </Link>
            <Link href="/cart" className="flex items-center py-3 hover:bg-white/10 px-2 rounded-lg transition-colors">
              Cart
            </Link>
            <Link href="/contact" className="flex items-center py-3 hover:bg-white/10 px-2 rounded-lg transition-colors">
              Contact
            </Link>
            <Link href="/about" className="flex items-center py-3 hover:bg-white/10 px-2 rounded-lg transition-colors">
              About Us
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}