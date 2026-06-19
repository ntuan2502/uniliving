"use client";

/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { createRoom, updateRoom } from "@/app/actions/room-actions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RoomData } from "@/components/room-card";

interface RoomDialogProps {
  room: RoomData | null; // Null means creating a new room
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess: () => void;
}

const DISTRICTS = [
  "Quận 1",
  "Quận 3",
  "Quận 10",
  "Bình Thạnh",
  "Gò Vấp",
  "Tân Bình",
  "Thủ Đức",
];

const COMMON_AMENITIES = [
  "New",
  "Green",
  "Full",
  "1 phòng ngủ",
  "Wifi",
  "Máy giặt",
  "Tủ lạnh",
  "Ban công",
  "Bảo vệ 24/7",
  "Khu vệ sinh riêng",
];

export default function RoomDialog({ room, isOpen, onClose, onSaveSuccess }: RoomDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("Quận 10");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [status, setStatus] = useState("AVAILABLE");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (room) {
      setTitle(room.title);
      setDescription(room.description);
      setPrice(room.price.toString());
      setAddress(room.address);
      setDistrict(room.district);
      setImageUrl(Array.isArray(room.imageUrl) ? room.imageUrl.join("\n") : room.imageUrl || "");
      setSelectedAmenities(room.amenities);
      setStatus(room.status);
    } else {
      setTitle("");
      setDescription("");
      setPrice("");
      setAddress("");
      setDistrict("Quận 10");
      setImageUrl("");
      setSelectedAmenities([]);
      setStatus("AVAILABLE");
    }
    setError("");
  }, [room, isOpen]);

  const toggleAmenity = (value: string) => {
    if (selectedAmenities.includes(value)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== value));
    } else {
      setSelectedAmenities([...selectedAmenities, value]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const parsedPrice = parseInt(price, 10);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setError("Vui lòng nhập giá phòng hợp lệ");
      setLoading(false);
      return;
    }

    const imageUrlsArray = imageUrl
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url !== "");

    const payload = {
      title,
      description,
      price: parsedPrice,
      address,
      district,
      imageUrl: imageUrlsArray.length > 0 ? imageUrlsArray : ["/placeholder-room.jpg"],
      amenities: selectedAmenities,
      status,
    };

    let res;
    if (room) {
      res = await updateRoom(room.id, payload);
    } else {
      res = await createRoom(payload);
    }

    setLoading(false);
    if (res.success) {
      onSaveSuccess();
      onClose();
    } else {
      setError(res.error || "Lưu thông tin thất bại");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl sm:max-w-4xl overflow-y-auto max-h-[90vh] rounded-3xl border-2 border-border-olive bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-foreground">
            {room ? "Chỉnh sửa phòng trọ" : "Thêm phòng trọ mới"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-4">
          {error && <div className="rounded-xl bg-destructive/10 p-3 text-xs text-destructive font-semibold">{error}</div>}

          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-xs font-bold text-foreground">Tiêu đề tin đăng *</Label>
            <Input
              id="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Căn hộ dịch vụ Full nội thất có ban công"
              className="rounded-xl border-border-olive"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="price" className="text-xs font-bold text-foreground">Giá thuê (VND/tháng) *</Label>
              <Input
                id="price"
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Ví dụ: 5000000"
                className="rounded-xl border-border-olive"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="district" className="text-xs font-bold text-foreground">Quận/Huyện *</Label>
              <select
                id="district"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {DISTRICTS.map((dist) => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="address" className="text-xs font-bold text-foreground">Địa chỉ chi tiết *</Label>
            <Input
              id="address"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ví dụ: Số 123 Đường 3/2, Phường 11, Quận 10"
              className="rounded-xl border-border-olive"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="imageUrl" className="text-xs font-bold text-foreground">Link hình ảnh phòng (Mỗi link 1 dòng) *</Label>
            <Textarea
              id="imageUrl"
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Nhập các link ảnh Unsplash, mỗi dòng một link ảnh để hiển thị slide."
              className="rounded-xl border-border-olive min-h-[100px]"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-xs font-bold text-foreground">Mô tả phòng *</Label>
            <Textarea
              id="description"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập thông tin chi tiết về phòng trọ, căn hộ..."
              className="rounded-xl border-border-olive min-h-[80px]"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-foreground block">Tiện ích</Label>
            <div className="grid grid-cols-3 gap-2">
              {COMMON_AMENITIES.map((amenity) => {
                const isSelected = selectedAmenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`flex items-center justify-center rounded-full py-1.5 text-xs font-semibold border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-olive/10 border-olive text-olive"
                        : "bg-transparent border-border-olive text-muted-foreground hover:bg-sage/10"
                    }`}
                  >
                    {amenity}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="status" className="text-xs font-bold text-foreground">Trạng thái phòng</Label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="AVAILABLE">Còn phòng trống (AVAILABLE)</option>
              <option value="RENTED">Đã cho thuê (RENTED)</option>
            </select>
          </div>

          <DialogFooter className="pt-4 flex sm:justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-full border-border-olive hover:border-olive"
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-olive hover:bg-olive-hover text-white rounded-full font-bold px-6 cursor-pointer"
            >
              {loading ? "Đang lưu..." : "Lưu thông tin"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
