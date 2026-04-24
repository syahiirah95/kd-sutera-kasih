export function AppLogo() {
  return (
    <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-primary via-accent to-secondary shadow-[0_12px_30px_rgba(212,155,106,0.35)]">
      <BrandButterflyMark className="size-6" />
    </div>
  );
}

export function BrandButterflyMark({
  className = "hidden size-5 shrink-0 drop-shadow-[0_5px_10px_rgba(184,111,41,0.24)] sm:block",
}: Readonly<{
  className?: string;
}>) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 32 24"
    >
      <path
        d="M15.4 12.5C11.2 7.2 5.1 3.1 2.6 5.4C0.2 7.6 2.8 15.8 8.1 17.3C11.2 18.1 13.8 15.8 15.4 12.5Z"
        fill="url(#brandButterflyLeft)"
      />
      <path
        d="M16.8 12.4C21.8 7.2 28.1 4.3 30 6.9C31.8 9.4 27.4 17.1 22 17.2C19 17.3 17.4 15.3 16.8 12.4Z"
        fill="url(#brandButterflyRight)"
      />
      <path
        d="M15.7 10.3C15.1 7.5 15.8 5 17 3.7"
        stroke="#8d542d"
        strokeLinecap="round"
        strokeWidth="1.4"
      />
      <path
        d="M16.5 10.5C17.5 8 19.4 6.3 21.1 5.7"
        stroke="#8d542d"
        strokeLinecap="round"
        strokeWidth="1.4"
      />
      <path
        d="M15.6 10.7C15.3 13.9 15.7 17.1 16.7 20.2"
        stroke="#5f3f2f"
        strokeLinecap="round"
        strokeWidth="1.6"
      />
      <defs>
        <linearGradient id="brandButterflyLeft" x1="2" x2="16" y1="5" y2="18" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff0c9" />
          <stop offset="0.5" stopColor="#dca453" />
          <stop offset="1" stopColor="#b9712f" />
        </linearGradient>
        <linearGradient id="brandButterflyRight" x1="16" x2="31" y1="5" y2="18" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f0c46c" />
          <stop offset="0.48" stopColor="#dca453" />
          <stop offset="1" stopColor="#8d542d" />
        </linearGradient>
      </defs>
    </svg>
  );
}
