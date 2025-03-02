"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, User, Languages } from "lucide-react";
import { useLogout } from "@/app/hooks/uselogout";

export default function NavIcons() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const handleLogout = useLogout();

  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center space-x-1 md:space-x-4">
      <Link href="/cart" className="p-2 hover:bg-white/10 rounded-full transition-colors" aria-label="Shopping cart">
        <ShoppingCart className="h-5 w-5 text-white" />
      </Link>
      
      <div ref={profileRef} className="relative">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            toggleProfile();
          }} 
          className="p-2 hover:bg-white/10 rounded-full transition-colors focus:outline-none"
          aria-label="User profile"
          aria-expanded={isProfileOpen}
        >
          <User className="h-5 w-5 text-white" />
        </button>
        
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
                  onClick={handleLogout} 
                  className="w-full text-left px-4 py-2 text-red-600 font-medium"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
      
      <button className="p-2 hover:bg-white/10 rounded-full transition-colors" aria-label="Change language">
        <Languages className="h-5 w-5 text-white" strokeWidth={1.75} />
      </button>
    </div>
  );
}
