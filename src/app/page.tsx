import Navbar from "@/components/navbar";
import HomeContainer from "@/components/home-container";
import LeadForm from "@/components/lead-form";
import Footer from "@/components/footer";
import { getRooms } from "@/app/actions/room-actions";
import { RoomData } from "@/components/room-card";
import { Sparkles, Compass } from "lucide-react";

export const revalidate = 0; // Disable static cache to get live DB updates

export default async function Home() {
  const roomsRes = await getRooms();
  const initialRooms = (roomsRes.success && roomsRes.data ? roomsRes.data : []) as RoomData[];

  return (
    <div className="relative min-h-screen flex flex-col bg-background selection:bg-olive/20">
      {/* Leaf Shadow Premium Overlay */}
      <div className="leaf-overlay" />

      {/* Navigation Header */}
      <Navbar />

      <main className="flex-1">
        {/* Massive Typographic Hero Section (Anti-cliché Center Asymmetry) */}
        <section className="relative w-full py-24 md:py-36 px-4 overflow-hidden bg-gradient-to-b from-white to-background border-b border-border-olive/50">
          <div className="max-w-5xl mx-auto flex flex-col items-center text-center relative z-10 space-y-6">
            
            {/* Soft Premium Tag */}
            <div className="inline-flex items-center gap-1.5 rounded-full bg-olive/10 border border-olive/20 px-4 py-1.5 text-xs font-bold text-olive tracking-wider uppercase animate-fade-in">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Chất lượng & Tiện nghi đi đầu</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-foreground tracking-tight leading-[1.15] max-w-4xl">
              Không gian sống <span className="text-olive underline decoration-terracotta decoration-wavy underline-offset-8">Xanh</span> <br />
              cho thế hệ trẻ năng động.
            </h1>

            {/* Description */}
            <p className="max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed">
              Uni Living chuyên cung cấp giải pháp tư vấn, kết nối phòng trọ & căn hộ dịch vụ cao cấp, đầy đủ tiện nghi với không gian xanh mát lành tại TP. Hồ Chí Minh.
            </p>

            {/* Scroll Indicator button */}
            <div className="pt-6">
              <a
                href="#danh-sach-phong"
                className="inline-flex items-center gap-2 rounded-full bg-olive text-white px-8 py-3.5 font-bold shadow-sm transition-all hover:bg-olive-hover hover:scale-102 hover:shadow-md cursor-pointer"
              >
                <Compass className="h-5 w-5 animate-pulse" />
                Tìm phòng ngay
              </a>
            </div>
          </div>

          {/* Abstract background shapes representing plants/leaf vectors */}
          <div className="absolute top-1/4 left-[-10%] w-60 h-60 rounded-full bg-olive/5 blur-3xl" />
          <div className="absolute bottom-1/4 right-[-10%] w-80 h-80 rounded-full bg-terracotta/5 blur-3xl" />
        </section>

        {/* Room Search, Filters & Listing Catalog (HomeContainer Client component) */}
        <HomeContainer initialRooms={initialRooms} />

        {/* Customer Consultation Form Section */}
        <section id="dang-ky-tu-van" className="w-full py-20 bg-gradient-to-b from-background to-white border-t border-border-olive/50 px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Description (Left side) */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl font-black text-foreground leading-tight">
                Vẫn chưa tìm được <br />
                căn phòng ưng ý?
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-md mx-auto lg:mx-0">
                Hãy cung cấp nhu cầu của bạn (địa điểm mong muốn, ngân sách, số người ở, yêu cầu đặc biệt như máy giặt, ban công...). 
                Đội ngũ tư vấn viên của Uni Living sẽ chủ động liên hệ gửi danh sách các phòng trống khớp 100% với nhu cầu của bạn hoàn toàn miễn phí.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-6 pt-4 text-xs font-semibold text-olive">
                <div className="flex items-center justify-center lg:justify-start gap-2 bg-white rounded-full px-4 py-2 border border-border-olive/50">
                  <span className="h-2 w-2 rounded-full bg-terracotta" />
                  <span>Dịch vụ miễn phí 100%</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-2 bg-white rounded-full px-4 py-2 border border-border-olive/50">
                  <span className="h-2 w-2 rounded-full bg-olive" />
                  <span>Phản hồi trong 15 phút</span>
                </div>
              </div>
            </div>

            {/* Lead Form (Right side) */}
            <div className="lg:col-span-6 w-full">
              <LeadForm />
            </div>
          </div>
        </section>
      </main>

      {/* Page Footer */}
      <Footer />
    </div>
  );
}
