"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RoomData } from "./room-card";
import { MapPin, Phone, MessageSquare, ShieldCheck, CheckCircle2, Sparkles, ChevronLeft, ChevronRight, X } from "lucide-react";

interface RoomDetailModalProps {
  room: RoomData | null;
  isOpen: boolean;
  onClose: () => void;
}

// Reusable hook to enable drag-to-scroll on desktop with snapping and click prevention
function useDragToScroll() {
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const hasMoved = useRef(false);
  const cleanups = useRef<(() => void) | null>(null);

  const callbackRef = useCallback((element: HTMLDivElement | null) => {
    // Run previous cleanup if any
    if (cleanups.current) {
      cleanups.current();
      cleanups.current = null;
    }

    if (!element) return;

    const handleMouseDown = (e: MouseEvent) => {
      isDown.current = true;
      hasMoved.current = false;
      element.style.scrollBehavior = "auto"; // Disable smooth scroll during drag
      startX.current = e.pageX - element.offsetLeft;
      scrollLeftStart.current = element.scrollLeft;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown.current) return;
      e.preventDefault();
      const x = e.pageX - element.offsetLeft;
      const walk = (x - startX.current) * 1.5; // Scroll speed multiplier
      if (Math.abs(walk) > 5) {
        hasMoved.current = true;
      }
      element.scrollLeft = scrollLeftStart.current - walk;
    };

    const handleMouseUpOrLeave = () => {
      if (!isDown.current) return;
      isDown.current = false;
      element.style.scrollBehavior = ""; // Restore default/smooth scroll

      // Snap to the nearest page
      const clientWidth = element.clientWidth;
      if (clientWidth > 0) {
        const index = Math.round(element.scrollLeft / clientWidth);
        element.scrollTo({
          left: index * clientWidth,
          behavior: "smooth"
        });
      }
    };

    // Prevent click events on children if we dragged
    const handleClick = (e: MouseEvent) => {
      if (hasMoved.current) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    element.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUpOrLeave);
    element.addEventListener("mouseleave", handleMouseUpOrLeave);
    element.addEventListener("click", handleClick, { capture: true });

    cleanups.current = () => {
      element.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUpOrLeave);
      element.removeEventListener("mouseleave", handleMouseUpOrLeave);
      element.removeEventListener("click", handleClick, { capture: true });
    };
  }, []);

  return callbackRef;
}

// Function to synchronize thumbnail container scroll position with the main container
const syncThumbnailsScroll = (
  mainContainer: HTMLDivElement,
  thumbsContainer: HTMLDivElement
) => {
  const scrollLeft = mainContainer.scrollLeft;
  const clientWidth = mainContainer.clientWidth;
  if (clientWidth === 0) return;

  const scrollFraction = scrollLeft / clientWidth;
  const totalItems = thumbsContainer.children.length;
  if (totalItems === 0) return;

  const indexFloor = Math.floor(scrollFraction);
  const indexCeil = Math.min(indexFloor + 1, totalItems - 1);
  const percent = scrollFraction - indexFloor;

  const childFloor = thumbsContainer.children[indexFloor] as HTMLElement;
  const childCeil = thumbsContainer.children[indexCeil] as HTMLElement;

  if (childFloor && childCeil) {
    const leftFloor = childFloor.offsetLeft;
    const widthFloor = childFloor.clientWidth;

    const leftCeil = childCeil.offsetLeft;
    const widthCeil = childCeil.clientWidth;

    // Interpolate offsetLeft and width
    const targetOffsetLeft = leftFloor + (leftCeil - leftFloor) * percent;
    const targetWidth = widthFloor + (widthCeil - widthFloor) * percent;

    const containerWidth = thumbsContainer.clientWidth;

    // Scroll thumbsContainer to keep target element centered
    thumbsContainer.scrollLeft = targetOffsetLeft - containerWidth / 2 + targetWidth / 2;
  }
};

import { useCallback } from "react";

export default function RoomDetailModal({ room, isOpen, onClose }: RoomDetailModalProps) {
  const [activeImage, setActiveImage] = useState("");
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const mainScrollRef = useRef<HTMLDivElement>(null);
  const lightboxScrollRef = useRef<HTMLDivElement>(null);
  const lightboxThumbsRef = useRef<HTMLDivElement>(null);

  const mainDragRef = useDragToScroll();
  const lightboxDragRef = useDragToScroll();

  const gallery = room
    ? (Array.isArray(room.imageUrl) ? room.imageUrl : [room.imageUrl].filter(Boolean))
    : [];
  if (room && gallery.length === 0) {
    gallery.push("/placeholder-room.jpg");
  }

  const centerThumbnail = (index: number) => {
    const container = thumbnailsRef.current;
    if (!container) return;
    const thumbElements = container.children;
    if (thumbElements && thumbElements[index]) {
      const activeThumb = thumbElements[index] as HTMLElement;
      const containerWidth = container.clientWidth;
      const thumbWidth = activeThumb.clientWidth;
      const thumbOffsetLeft = activeThumb.offsetLeft;
      
      container.scrollTo({
        left: thumbOffsetLeft - containerWidth / 2 + thumbWidth / 2,
        behavior: "smooth",
      });
    }
  };

  const centerLightboxThumbnail = (index: number) => {
    const container = lightboxThumbsRef.current;
    if (!container) return;
    const thumbElements = container.children;
    if (thumbElements && thumbElements[index]) {
      const activeThumb = thumbElements[index] as HTMLElement;
      const containerWidth = container.clientWidth;
      const thumbWidth = activeThumb.clientWidth;
      const thumbOffsetLeft = activeThumb.offsetLeft;
      
      container.scrollTo({
        left: thumbOffsetLeft - containerWidth / 2 + thumbWidth / 2,
        behavior: "smooth",
      });
    }
  };

  // Keydown event listener for Escape key, Left & Right arrows
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        setIsLightboxOpen(false);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setLightboxIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setLightboxIndex((prev) => (prev + 1) % gallery.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown, { capture: true });
    return () => {
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
    };
  }, [isLightboxOpen, gallery.length]);

  // Sync activeImage with main scroll container position
  useEffect(() => {
    if (mainScrollRef.current) {
      const idx = gallery.indexOf(activeImage);
      if (idx !== -1) {
        const container = mainScrollRef.current;
        const currentScrollIndex = Math.round(container.scrollLeft / container.clientWidth);
        if (idx !== currentScrollIndex) {
          container.scrollTo({
            left: idx * container.clientWidth,
            behavior: "smooth",
          });
        }
        centerThumbnail(idx);
      }
    }
  }, [activeImage, gallery]);

  // Sync lightboxIndex with lightbox scroll container position
  useEffect(() => {
    if (isLightboxOpen && lightboxScrollRef.current) {
      const container = lightboxScrollRef.current;
      const currentScrollIndex = Math.round(container.scrollLeft / container.clientWidth);
      if (lightboxIndex !== currentScrollIndex) {
        container.scrollTo({
          left: lightboxIndex * container.clientWidth,
          behavior: "smooth",
        });
      }
      centerLightboxThumbnail(lightboxIndex);
    }
  }, [lightboxIndex, isLightboxOpen]);

  useEffect(() => {
    if (room) {
      const firstImg = Array.isArray(room.imageUrl) && room.imageUrl.length > 0
        ? room.imageUrl[0]
        : (typeof room.imageUrl === "string" ? room.imageUrl : "") || "/placeholder-room.jpg";
      setActiveImage(firstImg);
    }
  }, [room]);

  if (!room) return null;

  const formattedPrice = room.price.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });

  const handleOpenLightbox = () => {
    const idx = gallery.indexOf(activeImage);
    setLightboxIndex(idx >= 0 ? idx : 0);
    setIsLightboxOpen(true);
  };

  const handlePrevImage = () => {
    const currentIndex = gallery.indexOf(activeImage);
    const prevIndex = (currentIndex - 1 + gallery.length) % gallery.length;
    setActiveImage(gallery[prevIndex]);
  };

  const handleNextImage = () => {
    const currentIndex = gallery.indexOf(activeImage);
    const nextIndex = (currentIndex + 1) % gallery.length;
    setActiveImage(gallery[nextIndex]);
  };

  const handlePrevLightbox = () => {
    setLightboxIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  const handleNextLightbox = () => {
    setLightboxIndex((prev) => (prev + 1) % gallery.length);
  };

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
              
              {/* Active Image Preview (Preserves Landscape Aspect Ratio) with Horizontal Slider & Chevrons */}
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-border-olive shadow-2xs bg-black/5 group/main">
                {/* Left Arrow */}
                {gallery.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevImage();
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 hover:bg-white text-olive border border-border-olive shadow-md hover:scale-105 transition-all cursor-pointer"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                )}

                {/* Main Image Scroll Container */}
                <div
                  ref={(node) => {
                    mainScrollRef.current = node;
                    mainDragRef(node);
                  }}
                  onScroll={(e) => {
                    const container = e.currentTarget;
                    const index = Math.round(container.scrollLeft / container.clientWidth);
                    if (index >= 0 && index < gallery.length && gallery[index] !== activeImage) {
                      setActiveImage(gallery[index]);
                    }
                    if (thumbnailsRef.current) {
                      syncThumbnailsScroll(container, thumbnailsRef.current);
                    }
                  }}
                  className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none w-full h-full"
                >
                  {gallery.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative w-full h-full shrink-0 snap-start snap-always cursor-zoom-in"
                      onClick={handleOpenLightbox}
                    >
                      <Image
                        src={(failedImages[img] ? "/placeholder-room.jpg" : img) || "/placeholder-room.jpg"}
                        alt={`${room.title} image ${idx + 1}`}
                        fill
                        className="object-cover"
                        priority={idx === 0}
                        onError={() => setFailedImages((prev) => ({ ...prev, [img]: true }))}
                      />
                    </div>
                  ))}
                </div>

                {/* Right Arrow */}
                {gallery.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextImage();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 hover:bg-white text-olive border border-border-olive shadow-md hover:scale-105 transition-all cursor-pointer"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                )}

                {/* Bottom hint overlay on hover */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 bg-black/60 text-white text-[10px] px-3 py-1.5 rounded-full font-bold opacity-0 group-hover/main:opacity-100 transition-opacity pointer-events-none">
                  Kéo trượt hoặc Click để phóng to
                </div>
              </div>

              {/* Thumbnails list - Scrollable Horizontal Row */}
              <div className="relative group/thumbs flex items-center w-full">
                {/* Scrollable Container */}
                <div
                  ref={thumbnailsRef}
                  className={`flex overflow-x-auto gap-2 pb-2 scrollbar-none snap-x snap-mandatory w-full ${
                    gallery.length <= 3 ? "justify-center" : "justify-start"
                  }`}
                >
                  {gallery.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImage(img)}
                      className={`relative aspect-video w-[22%] shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer snap-start ${
                        activeImage === img
                          ? "border-olive ring-2 ring-olive/20 scale-102"
                          : "border-border-olive/50 hover:border-olive/80"
                      }`}
                    >
                      <Image
                        src={failedImages[img] ? "/placeholder-room.jpg" : img}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        className="object-cover"
                        onError={() => setFailedImages((prev) => ({ ...prev, [img]: true }))}
                      />
                    </button>
                  ))}
                </div>
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

      {/* Lightbox Slideshow Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 text-white p-4 select-none animate-in fade-in duration-200">
          {/* Close Button */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all cursor-pointer"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Main Slideshow View with Scroll-Snap Slider & Chevrons */}
          <div className="relative w-full max-w-4xl aspect-video md:aspect-[16/10] flex items-center justify-center group/lightbox">
            {/* Left Arrow */}
            {gallery.length > 1 && (
              <button
                onClick={handlePrevLightbox}
                className="absolute left-3 md:left-6 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:scale-105 transition-all cursor-pointer"
              >
                <ChevronLeft className="h-7 w-7" />
              </button>
            )}

            {/* Scroll Container for Lightbox Images */}
            <div
              ref={(node) => {
                lightboxScrollRef.current = node;
                lightboxDragRef(node);
              }}
              onScroll={(e) => {
                const container = e.currentTarget;
                const index = Math.round(container.scrollLeft / container.clientWidth);
                if (index >= 0 && index < gallery.length && index !== lightboxIndex) {
                  setLightboxIndex(index);
                }
                if (lightboxThumbsRef.current) {
                  syncThumbnailsScroll(container, lightboxThumbsRef.current);
                }
              }}
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none w-full h-full"
            >
              {gallery.map((img, idx) => (
                <div
                  key={idx}
                  className="relative w-full h-full shrink-0 snap-start snap-always"
                >
                  <Image
                    src={(failedImages[img] ? "/placeholder-room.jpg" : img) || "/placeholder-room.jpg"}
                    alt={`Slideshow image ${idx + 1}`}
                    fill
                    className="object-contain"
                    priority={idx === lightboxIndex}
                    onError={() => setFailedImages((prev) => ({ ...prev, [img]: true }))}
                  />
                </div>
              ))}
            </div>

            {/* Right Arrow */}
            {gallery.length > 1 && (
              <button
                onClick={handleNextLightbox}
                className="absolute right-3 md:right-6 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:scale-105 transition-all cursor-pointer"
              >
                <ChevronRight className="h-7 w-7" />
              </button>
            )}
          </div>

          {/* Image counter */}
          <div className="mt-4 text-sm font-semibold text-white/60">
            {lightboxIndex + 1} / {gallery.length}
          </div>

          {/* Lightbox Thumbnails Preview */}
          <div className="w-full max-w-2xl mt-6">
            <div
              ref={lightboxThumbsRef}
              className={`flex overflow-x-auto gap-2 pb-2 scrollbar-none w-full ${
                gallery.length <= 3 ? "justify-center" : "justify-start md:justify-center"
              }`}
            >
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setLightboxIndex(idx)}
                  className={`relative w-16 h-12 md:w-20 md:h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                    lightboxIndex === idx ? "border-terracotta ring-2 ring-terracotta/40 scale-105" : "border-white/20 hover:border-white/50"
                  }`}
                >
                  <Image
                    src={failedImages[img] ? "/placeholder-room.jpg" : img}
                    alt={`Lightbox thumb ${idx + 1}`}
                    fill
                    className="object-cover"
                    onError={() => setFailedImages((prev) => ({ ...prev, [img]: true }))}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </Dialog>
  );
}
