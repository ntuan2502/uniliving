import Link from "next/link";
import AdminContainer, { LeadData } from "@/components/admin-container";
import { getRooms } from "@/app/actions/room-actions";
import { getLeads } from "@/app/actions/lead-actions";
import { RoomData } from "@/components/room-card";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export const revalidate = 0; // Live database updates in admin panel

export default async function AdminPage() {
  const roomsRes = await getRooms();
  const leadsRes = await getLeads();

  const initialRooms = (roomsRes.success && roomsRes.data ? roomsRes.data : []) as RoomData[];
  const initialLeads = (leadsRes.success && leadsRes.data ? leadsRes.data : []) as unknown as LeadData[];

  return (
    <div className="relative min-h-screen bg-background pb-16">
      {/* Leaf Shadow Accent */}
      <div className="leaf-overlay" />

      {/* Admin Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border-olive bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-border-olive hover:border-olive bg-transparent px-4 text-xs font-bold text-foreground transition-all hover:bg-sage/10"
            >
              <ArrowLeft className="h-4 w-4" />
              Về Trang chủ
            </Link>
            <div className="h-4 w-px bg-border-olive" />
            <h1 className="text-sm sm:text-base font-black tracking-wider text-olive flex items-center gap-1.5 uppercase">
              <ShieldCheck className="h-5 w-5" />
              Quản trị Uni Living
            </h1>
          </div>
        </div>
      </header>

      {/* Main Admin Area */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        <div className="mb-6">
          <h2 className="text-2xl font-black text-foreground">
            Bảng Điều Khiển Quản Trị
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Quản lý danh sách các phòng trọ, căn hộ cho thuê và danh sách khách hàng đăng ký nhận tư vấn.
          </p>
        </div>

        {/* Tab & Management Lists Container */}
        <AdminContainer initialRooms={initialRooms} initialLeads={initialLeads} />
      </main>
    </div>
  );
}
