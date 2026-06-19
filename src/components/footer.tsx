"use server";

import { Phone, MapPin } from "lucide-react";

export default async function Footer() {
  return (
    <footer className="border-t border-border-olive bg-white py-12 text-muted-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand & Contact */}
          <div className="md:col-span-1 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-olive text-white shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5-3.93l-5.83-2.12a3 3 0 0 0-2.086 0L2.75 7.636M17.25 9.75V21"
                  />
                </svg>
              </div>
              <span className="text-lg font-bold tracking-wider text-olive">
                UNI LIVING
              </span>
            </div>

            {/* Doanh nghiệp & Mã số thuế */}
            <div className="text-xs flex flex-col gap-2 border-l-2 border-border-olive/50 pl-3">
              <p className="font-semibold text-foreground">CÔNG TY TNHH UNI LIVING</p>
              <p>Mã số thuế: <span className="font-mono text-foreground font-semibold">0319410674</span></p>
              <p>Đại diện: <span className="text-foreground">Nguyễn Thị Thanh Ngân</span></p>
              <p className="flex items-center gap-1.5">
                Tình trạng: 
                <span className="inline-flex items-center gap-1 rounded bg-green-50 px-1.5 py-0.5 text-[10px] font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                  Đang hoạt động
                </span>
              </p>
              <p className="text-muted-foreground/80 leading-relaxed">Trụ sở: 57 Cao Đức Lân, Phường Bình Trưng, TP.HCM</p>
            </div>

            <div className="flex flex-col gap-2.5 text-xs mt-2">
              <a
                href="tel:+84376361168"
                className="flex items-center gap-2 text-muted-foreground hover:text-olive transition-colors group"
              >
                <Phone className="h-4 w-4 text-olive/70 group-hover:text-olive transition-colors" />
                <span>Số điện thoại: <strong>+84 37 636 1168</strong></span>
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61584780694519"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-olive transition-colors group"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-olive/70 group-hover:text-olive transition-colors"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
                <span>Facebook: <span className="underline">Uni Living Fanpage</span></span>
              </a>
            </div>
          </div>

          {/* Offices List */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <h3 className="text-sm font-semibold tracking-wider text-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4 text-olive" />
              HỆ THỐNG VĂN PHÒNG
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl border border-border-olive/30 bg-muted/20 hover:border-olive/40 hover:bg-muted/30 transition-all">
                <span className="font-semibold text-foreground block mb-1">Chi nhánh 1</span>
                <p className="text-muted-foreground leading-relaxed">280B1 Lương Định Của, Bình Trưng, TP.HCM</p>
              </div>
              <div className="p-3.5 rounded-xl border border-border-olive/30 bg-muted/20 hover:border-olive/40 hover:bg-muted/30 transition-all">
                <span className="font-semibold text-foreground block mb-1">Chi nhánh 2</span>
                <p className="text-muted-foreground leading-relaxed">217/102/8 Bùi Đình Tuý, Phường 14, Bình Thạnh, TP.HCM</p>
              </div>
              <div className="p-3.5 rounded-xl border border-border-olive/30 bg-muted/20 hover:border-olive/40 hover:bg-muted/30 transition-all">
                <span className="font-semibold text-foreground block mb-1">Chi nhánh 3</span>
                <p className="text-muted-foreground leading-relaxed">191/8 Lê Văn Việt, Tăng Nhơn Phú, TP.HCM</p>
              </div>
              <div className="p-3.5 rounded-xl border border-border-olive/30 bg-muted/20 hover:border-olive/40 hover:bg-muted/30 transition-all">
                <span className="font-semibold text-foreground block mb-1">Chi nhánh 4</span>
                <p className="text-muted-foreground leading-relaxed">922/44 Cách Mạng Tháng Tám, Tân Sơn Nhất, TP.HCM</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border-olive/50 pt-8 text-center text-xs">
          <p>
            &copy; {new Date().getFullYear()} Uni Living. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
