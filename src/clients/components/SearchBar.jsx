import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, MapPin } from "lucide-react";

export const SearchBar = ({
  onSearch,
  placeholder = "Search for food, restaurants...",
  className = "",
}) => {
  const [searchQuery] = useSearchParams();
  const [query, setQuery] = useState(searchQuery.get("q") || "");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query.trim());
      } else {
        navigate(`/explore?q=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative flex items-center">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
        />
        <button
          type="submit"
          className="absolute right-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  );
};
