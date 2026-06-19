"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RoomData } from "./room-card";
import { MapPin, Phone, MessageSquare, ShieldCheck, CheckCircle2, Sparkles } from "lucide-react";

interface RoomDetailModalProps {
  room: RoomData | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function RoomDetailModal({ room, isOpen, onClose }: RoomDetailModalProps) {
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    if (room) {
      setActiveImage(room.imageUrl);
    }
  }, [room]);

  if (!room) return null;

  const formattedPrice = room.price.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });

  // Additional detail view placeholder images to explore cozy room elements
  const gallery = [
    room.imageUrl,
    "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=600",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl sm:max-w-4xl overflow-y-auto max-h-[90vh] rounded-3xl border-2 border-border-olive p-0 bg-white md:p-0">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Visual Showcase (Left/Top) - Interactive Gallery */}
          <div className="flex flex-col p-6 md:p-8 border-b-2 md:border-b-0 md:border-r-2 border-border-olive bg-sage/5 justify-between gap-6">
            <div className="space-y-4">
              <span className="font-bold text-foreground text-sm block flex items-center gap-1">
                <Sparkles className="h-4 w-4 text-terracotta" />
                Hình ảnh không gian
              </span>
              
              {/* Active Image Preview (Preserves Landscape Aspect Ratio) */}
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-border-olive shadow-2xs bg-black/5">
                <Image
                  src={activeImage || "/placeholder-room.jpg"}
                  alt={room.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Thumbnails list */}
              <div className="grid grid-cols-4 gap-2">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      activeImage === img
                        ? "border-olive ring-2 ring-olive/20 scale-102"
                        : "border-border-olive/50 hover:border-olive/80"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Stylized Mock Map Location */}
            <div className="space-y-2">
              <span className="font-bold text-foreground text-sm block">Vị trí bản đồ</span>
              <div className="relative w-full h-36 rounded-2xl overflow-hidden border-2 border-border-olive bg-background flex flex-col items-center justify-center text-center p-4">
                <div className="absolute inset-0 bg-[radial-gradient(#d5ded3_1.5px,transparent_1.5px)] [background-size:16px_16px] opacity-40" />
                {/* Horizontal & Vertical grid street paths */}
                <div className="absolute top-1/2 left-0 right-0 h-4 bg-sage/20 border-y border-border-olive/40 -translate-y-1/2" />
                <div className="absolute top-0 bottom-0 left-1/3 w-4 bg-sage/20 border-x border-border-olive/40" />
                
                {/* Park */}
                <div className="absolute top-2 right-2 w-14 h-14 rounded-lg bg-olive/10 border border-olive/20 flex items-center justify-center">
                  <span className="text-[9px] text-olive font-extrabold tracking-wider">PARK</span>
                </div>
                
                {/* Map Pin */}
                <div className="relative z-10 flex flex-col items-center gap-1 animate-bounce">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-terracotta text-white shadow-md">
                    <MapPin className="h-4 w-4" />
                  </div>
                </div>
                
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/95 px-3 py-0.5 rounded-full border border-border-olive text-[9px] font-bold text-foreground shadow-2xs z-10">
                  {room.district}
                </div>
              </div>
            </div>
          </div>

          {/* Details Content (Right/Bottom) */}
          <div className="flex flex-col p-6 md:p-8 justify-between">
            <div>
              <DialogHeader className="text-left">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-terracotta mb-2">
                  <MapPin className="h-4 w-4" />
                  <span>{room.district}</span>
                </div>
                <DialogTitle className="text-2xl font-black text-foreground leading-snug">
                  {room.title}
                </DialogTitle>
              </DialogHeader>

              {/* Price Tag */}
              <div className="mt-4 bg-sage/30 rounded-2xl p-4 border border-border-olive/50 flex items-center justify-between">
                <div>
                  <span className="text-xs text-muted-foreground block">Chi phí thuê</span>
                  <span className="text-2xl font-black text-terracotta">{formattedPrice}</span>
                  <span className="text-xs text-muted-foreground">/tháng</span>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    room.status === "AVAILABLE"
                      ? "bg-olive/10 text-olive"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {room.status === "AVAILABLE" ? "Còn phòng trống" : "Đã cho thuê"}
                </span>
              </div>

              {/* Address */}
              <div className="mt-6 text-sm">
                <span className="font-bold text-foreground block mb-1">Địa chỉ phòng</span>
                <p className="text-muted-foreground bg-background-sage/20 rounded-xl p-3 border border-border-olive/20 flex gap-2 items-start">
                  <MapPin className="h-4 w-4 text-olive shrink-0 mt-0.5" />
                  <span>{room.address}</span>
                </p>
              </div>

              {/* Description */}
              <div className="mt-6 text-sm">
                <span className="font-bold text-foreground block mb-2">Thông tin mô tả</span>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {room.description}
                </p>
              </div>

              {/* Amenities */}
              <div className="mt-6">
                <span className="font-bold text-foreground text-sm block mb-3">Tiện ích đi kèm</span>
                <div className="flex flex-wrap gap-2">
                  {room.amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-1 rounded-full border border-border-olive/80 bg-sage/10 px-3 py-1.5 text-xs font-semibold text-olive"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-8 pt-6 border-t border-border-olive/50 flex flex-col sm:flex-row gap-3">
              <a
                href="https://zalo.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-olive text-white px-6 py-3.5 font-bold shadow-sm transition-all hover:bg-olive-hover hover:scale-[1.02]"
              >
                <MessageSquare className="h-5 w-5" />
                <span>Liên hệ Zalo tư vấn</span>
              </a>

              <a
                href="tel:0900000000"
                className="flex items-center justify-center gap-2 rounded-full border border-border-olive hover:border-olive text-foreground hover:bg-sage/10 px-6 py-3.5 font-bold transition-all"
              >
                <Phone className="h-5 w-5 text-olive" />
                <span>Gọi điện</span>
              </a>
            </div>

            <div className="mt-4 flex items-center gap-1.5 justify-center text-2xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-olive" />
              <span>Uni Living cam kết thông tin phòng chính xác 100%</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
