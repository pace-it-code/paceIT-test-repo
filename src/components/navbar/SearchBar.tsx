// components/navbar/SearchBar.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

interface SearchResult {
  id: string;
  name: string;
}

export default function SearchBar() {
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleProductSelect = (productId: string) => {
    if (!productId) return; // Prevent errors if ID is missing
    console.log(`✅ Manually Redirecting to: /product/${productId}`);
    window.location.href = `/product/${productId}`;
  };

  // Handle search results
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        setSearchResults(data.data || []);
        console.log("🔍 API Response:", data);
        
        // No automatic redirect - removed the auto-redirect code that was here
      } catch (error) {
        console.error("❌ Error fetching search results:", error);
        setSearchResults([]);
      }
    };

    const delay = setTimeout(fetchSearchResults, 300);
    return () => clearTimeout(delay);
  }, [searchQuery]);
  
  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={searchRef} className="hidden md:flex flex-1 justify-center max-w-md mx-6 relative">
      <form onSubmit={handleSearchSubmit} className="w-full">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
          aria-label="Search products"
          autoComplete="off"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-5 w-5 text-white/70" />
        </div>
        <button type="submit" className="hidden">Search</button>
      </form>
      
      {/* Search Suggestions Dropdown */}
      {searchResults.length > 0 && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md rounded-md mt-2 z-50">
          {searchResults.map((product) => (
            <button 
              key={product.id} 
              onClick={() => handleProductSelect(product.id)} 
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-900 border-b border-gray-100 last:border-0"
            >
              <span className="font-medium">{product.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}