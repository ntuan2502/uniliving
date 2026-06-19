"use client";

import { useState } from "react";
import { getRooms } from "@/app/actions/room-actions";
import FilterSection from "./filter-section";
import RoomCard, { RoomData } from "./room-card";
import RoomDetailModal from "./room-detail-modal";
import { Home, ListCollapse } from "lucide-react";

interface HomeContainerProps {
  initialRooms: RoomData[];
}

export default function HomeContainer({ initialRooms }: HomeContainerProps) {
  const [rooms, setRooms] = useState<RoomData[]>(initialRooms);
  const [loading, setLoading] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFilterChange = async (filters: {
    searchText: string;
    district: string;
    amenities: string[];
  }) => {
    setLoading(true);

    const res = await getRooms({
      district: filters.district,
      searchText: filters.searchText,
      amenities: filters.amenities,
    });

    if (res.success && res.data) {
      setRooms(res.data as RoomData[]);
    }
    setLoading(false);
  };

  const handleOpenDetails = (room: RoomData) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setSelectedRoom(null);
    setIsModalOpen(false);
  };

  return (
    <section id="danh-sach-phong" className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-16">
      {/* Title & Filters */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-foreground flex items-center justify-center gap-2">
          <Home className="h-7 w-7 text-olive" />
          Khám Phá Không Gian Sống Của Bạn
        </h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
          Dễ dàng tìm kiếm phòng trọ, căn hộ dịch vụ cao cấp, không gian xanh
          thân thiện và đầy đủ tiện nghi tại TP.HCM.
        </p>
      </div>

      {/* Filter Section */}
      <FilterSection onFilterChange={handleFilterChange} />

      {/* Room Grid / Loader */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-olive border-t-transparent" />
          <p className="mt-4 text-xs font-semibold text-muted-foreground">
            Đang tìm căn phòng phù hợp...
          </p>
        </div>
      ) : rooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-border-olive/60 rounded-3xl bg-white/40">
          <ListCollapse className="h-12 w-12 text-muted-foreground/60" />
          <h3 className="mt-4 text-lg font-bold text-foreground">
            Không tìm thấy phòng phù hợp
          </h3>
          <p className="mt-1.5 text-xs text-muted-foreground max-w-xs">
            Hãy thử thay đổi từ khoá tìm kiếm, chọn quận khác hoặc xoá bớt các thẻ
            lọc tiện ích.
          </p>
        </div>
      ) : (
        /* Asymmetric grid layout to disrupt standard bento clichés */
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => {
            return (
              <RoomCard
                key={room.id}
                room={room}
                onOpenDetails={handleOpenDetails}
              />
            );
          })}
        </div>
      )}

      {/* Detail Modal Dialog */}
      <RoomDetailModal
        room={selectedRoom}
        isOpen={isModalOpen}
        onClose={handleCloseDetails}
      />
    </section>
  );
}
