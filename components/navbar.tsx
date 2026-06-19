"use server";

import Link from "next/link";

export default async function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-olive bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-olive text-white shadow-sm transition-all group-hover:scale-105">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5-3.93l-5.83-2.12a3 3 0 0 0-2.086 0L2.75 7.636M17.25 9.75V21"
              />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-wider text-olive">
            UNI LIVING
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link
            href="/"
            className="text-foreground hover:text-olive transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-olive hover:after:w-full after:transition-all"
          >
            Trang chủ
          </Link>
          <a
            href="#danh-sach-phong"
            className="text-foreground hover:text-olive transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-olive hover:after:w-full after:transition-all"
          >
            Danh sách phòng
          </a>
          <a
            href="#dang-ky-tu-van"
            className="text-foreground hover:text-olive transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-olive hover:after:w-full after:transition-all"
          >
            Đăng ký tư vấn
          </a>
          <Link
            href="/admin"
            className="flex items-center gap-1.5 rounded-full bg-olive/10 px-4 py-1.5 text-xs text-olive font-semibold hover:bg-olive hover:text-white transition-all"
          >
            Quản trị
          </Link>
        </nav>
      </div>
    </header>
  );
}
