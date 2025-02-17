"use client";
import { useLogout } from "@/app/hooks/logout";
import Link from "next/link";
import React, { useState } from "react";
import { Search, ShoppingCart, User, Menu, X,Languages } from "lucide-react";





 export default function Navbar() {

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  return (
    <nav className="fixed top-0 left-0 right-0 bg-greens p-4 shadow-md z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Mobile Menu Button */}
        <button className="md:hidden text-white" onClick={toggleMenu}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        <div className="flex-shrink-0">
          <Link href="/" className="text-2xl font-bold text-white">The Company</Link>
        </div>

        {/* Centered Search Bar - Responsive */}
        <div className="hidden md:flex flex-1 justify-center">
          <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </form>
        </div>

        {/* Icons on the Right */}
        <div className="flex items-center space-x-4">
          <Link href="/cart">
          <ShoppingCart className="h-6 w-6 text-white" />
          </Link>
          <button onClick={toggleProfile} className="focus:outline-none">
            <User className="h-6 w-6 text-white" />
          </button>
          <Languages  className="h-6 w-6 text-white"strokeWidth={1.75} />
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black text-white text-center py-4">
          <span className="block py-2 cursor-pointer">Home</span>
          <span className="block py-2 cursor-pointer">Products</span>
          <span className="block py-2 cursor-pointer">Cart</span>
          <span className="block py-2 cursor-pointer">Contact</span>
          <span className="block py-2 cursor-pointer">About Us</span>
        </div>
      )}

      {/* Profile Dropdown */}
      {isProfileOpen && (
        <div className="absolute right-4 top-full mt-2 bg-white shadow-lg rounded-md w-48">
          <ul className="py-2">
            <li className="px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer">
              Profile
            </li>
            <li className="px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer">
              Orders
            </li>
           
            <li className="px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer">
             <button onClick={handlelogout}>logout</button>
            </li>
            
          </ul>
        </div>
      )}
    </nav>
  );
}


