"use server";

export default async function Footer() {
  return (
    <footer className="border-t border-border-olive bg-white py-12 text-muted-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Brand */}
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

          {/* Contact Details */}
          <div className="text-center md:text-right">
            <p className="text-sm font-semibold text-foreground">
              Uni Living - Tư vấn & Cho thuê căn hộ, phòng trọ tại TP.HCM
            </p>
            <p className="mt-1 text-xs">
              Địa chỉ: Thành phố Hồ Chí Minh, Việt Nam
            </p>
            <p className="text-xs">
              Facebook:{" "}
              <a
                href="https://www.facebook.com/profile.php?id=61584780694519"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-olive underline transition-colors"
              >
                Uni Living Fanpage
              </a>
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-border-olive/50 pt-8 text-center text-xs">
          <p>
            &copy; {new Date().getFullYear()} Uni Living. All rights reserved.
            Thiết kế bám sát nhận diện &quot;Cozy Sage &amp; Terra Warmth&quot;.
          </p>
        </div>
      </div>
    </footer>
  );
}
