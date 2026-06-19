"use client";

import { useState } from "react";
import { RoomData } from "@/components/room-card";
import RoomDialog from "@/app/admin/room-dialog";
import { deleteRoom, getRooms } from "@/app/actions/room-actions";
import { updateLeadStatus, deleteLead, getLeads } from "@/app/actions/lead-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2, Home, Users, RefreshCw, Phone } from "lucide-react";

export interface LeadData {
  id: string;
  name: string;
  phone: string;
  district: string;
  budget: number;
  note: string | null;
  status: string;
  createdAt: Date;
}

interface AdminContainerProps {
  initialRooms: RoomData[];
  initialLeads: LeadData[];
}

export default function AdminContainer({ initialRooms, initialLeads }: AdminContainerProps) {
  const [activeTab, setActiveTab] = useState<"rooms" | "leads">("rooms");
  const [rooms, setRooms] = useState<RoomData[]>(initialRooms);
  const [leads, setLeads] = useState<LeadData[]>(initialLeads);

  const [loading, setLoading] = useState(false);

  // Dialog States
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<RoomData | null>(null);

  const refreshData = async () => {
    setLoading(true);
    if (activeTab === "rooms") {
      const res = await getRooms();
      if (res.success && res.data) {
        setRooms(res.data as RoomData[]);
      }
    } else {
      const res = await getLeads();
      if (res.success && res.data) {
        setLeads(res.data as unknown as LeadData[]);
      }
    }
    setLoading(false);
  };

  const handleEditRoom = (room: RoomData) => {
    setEditingRoom(room);
    setIsDialogOpen(true);
  };

  const handleAddRoom = () => {
    setEditingRoom(null);
    setIsDialogOpen(true);
  };

  const handleDeleteRoom = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xoá phòng này?")) {
      const res = await deleteRoom(id);
      if (res.success) {
        refreshData();
      } else {
        alert("Xoá thất bại!");
      }
    }
  };

  const handleUpdateLeadStatus = async (id: string, status: string) => {
    const res = await updateLeadStatus(id, status);
    if (res.success) {
      refreshData();
    } else {
      alert("Cập nhật trạng thái thất bại!");
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xoá yêu cầu tư vấn này?")) {
      const res = await deleteLead(id);
      if (res.success) {
        refreshData();
      } else {
        alert("Xoá thất bại!");
      }
    }
  };

  return (
    <div className="w-full">
      {/* Tab Select & Refresh */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white border border-border-olive rounded-3xl p-3 shadow-2xs">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("rooms")}
            className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold transition-all cursor-pointer ${
              activeTab === "rooms"
                ? "bg-olive text-white shadow-xs"
                : "bg-transparent text-muted-foreground hover:bg-sage/10 hover:text-foreground"
            }`}
          >
            <Home className="h-4 w-4" />
            Quản lý Phòng
          </button>
          <button
            onClick={() => setActiveTab("leads")}
            className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold transition-all cursor-pointer ${
              activeTab === "leads"
                ? "bg-olive text-white shadow-xs"
                : "bg-transparent text-muted-foreground hover:bg-sage/10 hover:text-foreground"
            }`}
          >
            <Users className="h-4 w-4" />
            Yêu cầu tư vấn (Leads)
          </button>
        </div>

        <div className="flex gap-3 w-full sm:w-auto justify-end">
          <Button
            variant="outline"
            onClick={refreshData}
            disabled={loading}
            className="rounded-full border-border-olive hover:border-olive h-10 w-10 p-0"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>

          {activeTab === "rooms" && (
            <Button
              onClick={handleAddRoom}
              className="bg-terracotta hover:bg-terracotta-hover text-white font-bold rounded-full h-10 px-5 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Thêm phòng
            </Button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mt-8 bg-white border border-border-olive rounded-3xl overflow-hidden shadow-2xs">
        
        {/* TAB 1: ROOMS */}
        {activeTab === "rooms" && (
          <div className="overflow-x-auto">
            {rooms.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                Chưa có phòng trọ nào. Ấn &quot;Thêm phòng&quot; để bắt đầu!
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-sage/20 border-b border-border-olive text-xs font-bold text-olive uppercase tracking-wider">
                    <th className="py-4 px-6">Ảnh</th>
                    <th className="py-4 px-6">Tiêu đề / Địa chỉ</th>
                    <th className="py-4 px-6">Khu vực</th>
                    <th className="py-4 px-6">Giá thuê</th>
                    <th className="py-4 px-6">Trạng thái</th>
                    <th className="py-4 px-6 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-olive/50 text-sm">
                  {rooms.map((room) => (
                    <tr key={room.id} className="hover:bg-sage/5 transition-colors">
                      <td className="py-4 px-6 shrink-0">
                        <div className="relative h-12 w-16 overflow-hidden rounded-xl border border-border-olive">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={(Array.isArray(room.imageUrl) ? room.imageUrl[0] : room.imageUrl) || "/placeholder-room.jpg"}
                            alt={room.title}
                            className="object-cover h-full w-full"
                          />
                        </div>
                      </td>
                      <td className="py-4 px-6 max-w-xs md:max-w-md">
                        <span className="font-bold text-foreground block truncate">{room.title}</span>
                        <span className="text-xs text-muted-foreground block truncate mt-0.5">{room.address}</span>
                      </td>
                      <td className="py-4 px-6 font-semibold">{room.district}</td>
                      <td className="py-4 px-6 font-bold text-terracotta">
                        {room.price.toLocaleString("vi-VN")} đ
                      </td>
                      <td className="py-4 px-6">
                        <Badge
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            room.status === "AVAILABLE"
                              ? "bg-olive/10 text-olive hover:bg-olive/10"
                              : "bg-muted text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          {room.status === "AVAILABLE" ? "Còn trống" : "Đã thuê"}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            onClick={() => handleEditRoom(room)}
                            variant="outline"
                            className="rounded-full border-border-olive hover:border-olive hover:text-olive h-9 w-9 p-0"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteRoom(room.id)}
                            variant="outline"
                            className="rounded-full border-border-olive hover:border-destructive hover:bg-destructive/10 hover:text-destructive h-9 w-9 p-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* TAB 2: LEADS */}
        {activeTab === "leads" && (
          <div className="overflow-x-auto">
            {leads.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                Chưa có yêu cầu tư vấn nào từ khách hàng.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-sage/20 border-b border-border-olive text-xs font-bold text-olive uppercase tracking-wider">
                    <th className="py-4 px-6">Khách hàng</th>
                    <th className="py-4 px-6">Khu vực</th>
                    <th className="py-4 px-6">Ngân sách</th>
                    <th className="py-4 px-6">Ghi chú</th>
                    <th className="py-4 px-6">Trạng thái</th>
                    <th className="py-4 px-6 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-olive/50 text-sm">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-sage/5 transition-colors">
                      <td className="py-4 px-6">
                        <span className="font-bold text-foreground block">{lead.name}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <Phone className="h-3 w-3" />
                          <a href={`tel:${lead.phone}`} className="hover:underline">{lead.phone}</a>
                          <span className="text-border-olive">|</span>
                          <a
                            href={`https://zalo.me/${lead.phone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-olive hover:underline font-semibold"
                          >
                            Zalo
                          </a>
                        </span>
                      </td>
                      <td className="py-4 px-6 font-semibold">{lead.district}</td>
                      <td className="py-4 px-6 font-bold text-terracotta">
                        {lead.budget.toLocaleString("vi-VN")} đ
                      </td>
                      <td className="py-4 px-6 text-xs text-muted-foreground max-w-2xs whitespace-pre-wrap leading-relaxed">
                        {lead.note || <span className="italic">Không có ghi chú</span>}
                      </td>
                      <td className="py-4 px-6">
                        <select
                          value={lead.status}
                          onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value)}
                          className={`rounded-full px-3 py-1 text-xs font-bold border outline-none cursor-pointer ${
                            lead.status === "NEW"
                              ? "bg-blue-50 border-blue-200 text-blue-600"
                              : lead.status === "CONTACTED"
                              ? "bg-amber-50 border-amber-200 text-amber-600"
                              : "bg-emerald-50 border-emerald-200 text-emerald-600"
                          }`}
                        >
                          <option value="NEW">Mới nhận (NEW)</option>
                          <option value="CONTACTED">Đang hỗ trợ (CONTACTED)</option>
                          <option value="COMPLETED">Hoàn thành (COMPLETED)</option>
                        </select>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Button
                          onClick={() => handleDeleteLead(lead.id)}
                          variant="outline"
                          className="rounded-full border-border-olive hover:border-destructive hover:bg-destructive/10 hover:text-destructive h-9 w-9 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Room Dialog Popup */}
      <RoomDialog
        room={editingRoom}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSaveSuccess={refreshData}
      />
    </div>
  );
}
