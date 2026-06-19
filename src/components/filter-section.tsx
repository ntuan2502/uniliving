"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";

export interface FilterParams {
  searchText: string;
  district: string;
  amenities: string[];
}

interface FilterSectionProps {
  onFilterChange: (filters: FilterParams) => void;
}

const POPULAR_DISTRICTS = [
  "Tất cả",
  "Quận 1",
  "Quận 3",
  "Quận 10",
  "Bình Thạnh",
  "Gò Vấp",
  "Tân Bình",
  "Thủ Đức",
];

const AMENITY_TAGS = [
  { label: "New", value: "New" },
  { label: "Green", value: "Green" },
  { label: "Full nội thất", value: "Full" },
  { label: "1 phòng ngủ", value: "1 phòng ngủ" },
];

export default function FilterSection({ onFilterChange }: FilterSectionProps) {
  const [searchText, setSearchText] = useState("");
  const [district, setDistrict] = useState("Tất cả");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onFilterChange({
      searchText,
      district,
      amenities: selectedAmenities,
    });
  };

  const handleDistrictChange = (value: string) => {
    setDistrict(value);
    onFilterChange({
      searchText,
      district: value,
      amenities: selectedAmenities,
    });
  };

  const toggleAmenity = (value: string) => {
    let updated: string[];
    if (selectedAmenities.includes(value)) {
      updated = selectedAmenities.filter((a) => a !== value);
    } else {
      updated = [...selectedAmenities, value];
    }
    setSelectedAmenities(updated);
    onFilterChange({
      searchText,
      district,
      amenities: updated,
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <form
        onSubmit={handleSearchSubmit}
        className="flex flex-col sm:flex-row gap-3 items-center bg-white border border-border-olive rounded-3xl sm:rounded-full p-4 sm:p-2 sm:pl-6 shadow-sm transition-all hover:shadow-md focus-within:ring-2 focus-within:ring-olive/20"
      >
        <div className="flex flex-1 w-full items-center gap-2">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Tìm kiếm vị trí (ví dụ: 3/2, Diên Hồng...)"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground/80 py-2"
          />
        </div>

        <div className="flex w-full sm:w-auto items-center gap-2 border-t sm:border-t-0 sm:border-l border-border-olive pt-3 sm:pt-0 sm:pl-4">
          <select
            value={district}
            onChange={(e) => handleDistrictChange(e.target.value)}
            className="w-full sm:w-40 bg-transparent border-none outline-none text-foreground py-2 cursor-pointer font-medium"
          >
            {POPULAR_DISTRICTS.map((dist) => (
              <option key={dist} value={dist}>
                {dist === "Tất cả" ? "Khu vực" : dist}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="flex h-12 w-full sm:h-11 sm:w-36 shrink-0 items-center justify-center rounded-xl sm:rounded-full bg-terracotta hover:bg-terracotta-hover text-white shadow-sm transition-all gap-2 cursor-pointer font-semibold"
        >
          <Search className="h-5 w-5" />
          <span>Tìm kiếm</span>
        </button>
      </form>

      {/* Pill Tags */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
        {AMENITY_TAGS.map((tag) => {
          const isActive = selectedAmenities.includes(tag.value);
          return (
            <button
              key={tag.value}
              type="button"
              onClick={() => toggleAmenity(tag.value)}
              className={`flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? "bg-terracotta text-white shadow-sm scale-102"
                  : "bg-border-olive/40 hover:bg-border-olive/60 text-foreground"
              }`}
            >
              <span>{tag.label}</span>
              {isActive && <X className="h-3.5 w-3.5" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
