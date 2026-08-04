import React from "react";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function Logo({ className = "", showText = true, size = "md" }: LogoProps) {
  const pixelSizes = {
    sm: "h-9 w-9",
    md: "h-14 w-14",
    lg: "h-28 w-28"
  };

  return (
    <div className={`flex items-center gap-3.5 select-none group ${className}`}>
      {/* Sleek SVG emblem with orange sunset glow ring, runway vector, and jet silhouette */}
      <div className={`relative ${pixelSizes[size]} shrink-0 flex items-center justify-center`}>
        <div className="absolute inset-0 bg-[#ea580c]/15 rounded-full blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full relative z-10 drop-shadow-md transition-transform duration-300 group-hover:scale-105"
        >
          {/* Subtle Outer Instrument Compass Circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke="#ea580c"
            strokeWidth="1.5"
            strokeDasharray="4 6"
            className="opacity-30"
          />

          {/* Glowing Sunset Circle */}
          <circle cx="100" cy="98" r="62" fill="url(#sun-gradient)" />
          
          <defs>
            <linearGradient id="sun-gradient" x1="100" y1="36" x2="100" y2="160" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f97316" />
              <stop offset="1" stopColor="#ea580c" />
            </linearGradient>
            <linearGradient id="runway-grad" x1="100" y1="100" x2="100" y2="160" gradientUnits="userSpaceOnUse">
              <stop stopColor="#090d16" />
              <stop offset="1" stopColor="#020617" />
            </linearGradient>
          </defs>

          {/* Runway perspective leading into horizon */}
          <path
            d="M 100,102 L 160,160 L 40,160 Z"
            fill="url(#runway-grad)"
          />

          {/* Runway dash markings */}
          <line x1="100" y1="106" x2="100" y2="114" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
          <line x1="100" y1="120" x2="100" y2="132" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" opacity="0.9" />
          <line x1="100" y1="139" x2="100" y2="155" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.9" />

          {/* Control Tower Silhouette */}
          <path
            d="M 64,135 V 96 H 59 L 57,90 H 73 L 71,96 H 66 V 135 Z"
            fill="#090d16"
          />
          <line x1="65" y1="90" x2="65" y2="80" stroke="#ea580c" strokeWidth="1.5" />
          <rect x="59.5" y="91.5" width="11" height="3" rx="0.5" fill="#38bdf8" opacity="0.9" />

          {/* Dynamic Flight Arch */}
          <path
            d="M 15,120 C 10,75 40,30 95,20 C 140,12 178,35 185,60"
            stroke="#ffffff"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Modern Jet / Airplane Silhouette in flight */}
          <g transform="translate(144, 52) rotate(-16)">
            {/* Main Wings */}
            <path
              d="M -48,-3 L 36,-1 L 32,4 L -42,3 Z"
              fill="#ffffff"
              stroke="#090d16"
              strokeWidth="2"
            />
            {/* Fuselage */}
            <path
              d="M -22,-9 C -10,-8 12,-3 32,1 C 36,2 38,6 26,7 C 12,8 -15,6 -26,1 C -30,-3 -30,-7 -22,-9 Z"
              fill="#090d16"
            />
            {/* Tail */}
            <path d="M -23,-5 L -31,-15 L -26,-17 L -16,-7 Z" fill="#090d16" />
            <path d="M -26,-1 L -34,5 L -29,7 L -21,1 Z" fill="#ffffff" />
            {/* Nose Cone Accent */}
            <ellipse cx="32" cy="2" rx="2.5" ry="6" fill="#ea580c" />
          </g>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span className="font-display font-extrabold text-[12px] sm:text-[15px] tracking-widest text-[#ea580c] uppercase">
              LUCHTVAART CENTRUM
            </span>
          </div>
          <span className="font-display font-black text-[16px] sm:text-[22px] tracking-tight text-white uppercase mt-0.5">
            ORANJESTAD
          </span>
          <span className="font-mono text-[8px] sm:text-[9.5px] tracking-widest text-slate-400 font-semibold uppercase mt-1">
            VLIEGSCHOOL • INTRANET • ORANJESTAD
          </span>
        </div>
      )}
    </div>
  );
}

