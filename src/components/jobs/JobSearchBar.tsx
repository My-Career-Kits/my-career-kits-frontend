"use client";
import { Search, MapPin } from "lucide-react";

interface JobSearchBarProps {
  keywords: string;
  location: string;
  onKeywordsChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onSearch: () => void;  // ← new
}

export default function JobSearchBar({
  keywords,
  location,
  onKeywordsChange,
  onLocationChange,
  onSearch,
}: JobSearchBarProps) {

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") onSearch();
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">

      {/* keywords input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
        <input
          type="text"
          value={keywords}
          onChange={(e) => onKeywordsChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Job title, keywords, or company"
          className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-3 text-sm text-text-primary focus:border-accent focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,194,255,0.1)] placeholder:text-text-tertiary"
        />
      </div>

      {/* location input */}
      <div className="relative flex-1">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
        <input
          type="text"
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="City or postcode"
          className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-3 text-sm text-text-primary focus:border-accent focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,194,255,0.1)] placeholder:text-text-tertiary"
        />
      </div>

      {/* search button — matches your accent design */}
      <button
        onClick={onSearch}
        disabled={!keywords.trim() || !location.trim()}
        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-accent text-black text-sm font-semibold hover:bg-accent-dark transition-colors shadow-[0_0_20px_rgba(0,194,255,0.3)] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
      >
        <Search className="w-4 h-4" />
        Search
      </button>

    </div>
  );
}
