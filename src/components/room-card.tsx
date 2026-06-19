"use client";

import Image from "next/image";
import { MapPin, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface RoomData {
  id: string;
  title: string;
  description: string;
  price: number;
  address: string;
  district: string;
  imageUrl: string[];
  amenities: string[];
  status: string;
}

interface RoomCardProps {
  room: RoomData;
  onOpenDetails: (room: RoomData) => void;
}

export default function RoomCard({ room, onOpenDetails }: RoomCardProps) {
  const isAvailable = room.status === "AVAILABLE";

  const formattedPrice = room.price.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });

  return (
    <div
      onClick={() => onOpenDetails(room)}
      className="group relative cursor-pointer flex flex-col overflow-hidden bg-white border-2 border-border-olive rounded-3xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-olive"
    >
      {/* Image Container with Olive Frame effect */}
      <div className="relative aspect-4/3 w-full overflow-hidden border-b-2 border-border-olive">
        <Image
          src={(Array.isArray(room.imageUrl) ? room.imageUrl[0] : room.imageUrl) || "/placeholder-room.jpg"}
          alt={room.title}
          fill
          sizes="(max-w-7xl) 33vw, 50vw, 100vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Status Badge */}
        <div className="absolute top-4 left-4 z-10">
          <Badge
            className={`font-semibold shadow-sm rounded-full px-3 py-1 ${
              isAvailable
                ? "bg-olive text-white"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {isAvailable ? "Còn phòng" : "Đã thuê"}
          </Badge>
        </div>

        {/* Terracotta Visual Accent for Green rooms */}
        {room.amenities.includes("Green") && (
          <div className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-terracotta text-white shadow-sm">
            <Sparkles className="h-4 w-4" />
          </div>
        )}
      </div>

      {/* Info Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-terracotta">
          <MapPin className="h-3.5 w-3.5" />
          <span>{room.district}</span>
        </div>

        <h3 className="mt-2 text-lg font-bold leading-snug text-foreground line-clamp-1 group-hover:text-olive transition-colors">
          {room.title}
        </h3>

        <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
          {room.description}
        </p>

        {/* Quick Amenities Preview */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {room.amenities.slice(0, 3).map((amenity) => (
            <span
              key={amenity}
              className="rounded-full bg-sage/50 px-2.5 py-0.5 text-xs font-medium text-olive"
            >
              {amenity}
            </span>
          ))}
          {room.amenities.length > 3 && (
            <span className="rounded-full bg-sage/50 px-2.5 py-0.5 text-xs font-medium text-olive">
              +{room.amenities.length - 3}
            </span>
          )}
        </div>

        {/* Price & Action */}
        <div className="mt-6 flex items-center justify-between border-t border-border-olive/50 pt-4">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Giá thuê</span>
            <span className="text-lg font-black text-terracotta">
              {formattedPrice}
              <span className="text-xs font-medium text-muted-foreground">
                /tháng
              </span>
            </span>
          </div>

          <div className="flex h-9 items-center justify-center rounded-full border border-olive bg-transparent px-4 text-xs font-bold text-olive transition-all group-hover:bg-olive group-hover:text-white">
            Chi tiết
          </div>
        </div>
      </div>
    </div>
  );
}
