"use client";

import React from "react";

interface PetCompanionProps {
  className?: string;
  size?: number;
}

export function PetCompanionIllustration({ className = "h-28 w-28 sm:h-48 sm:w-48" }: PetCompanionProps) {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 220 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xl animate-[pet-bob_3.5s_ease-in-out_infinite]"
      >
        <defs>
          <linearGradient id="boxGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F5A327" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id="boxRimGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>
          <linearGradient id="furGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F6A238" />
            <stop offset="100%" stopColor="#E27D16" />
          </linearGradient>
          <filter id="softGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodOpacity="0.35" />
          </filter>
        </defs>

        <style>
          {`
            @keyframes pet-bob {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-6px); }
            }
            @keyframes ear-wiggle-l {
              0%, 100% { transform: rotate(0deg); }
              25% { transform: rotate(-3deg); }
              75% { transform: rotate(2deg); }
            }
            @keyframes ear-wiggle-r {
              0%, 100% { transform: rotate(0deg); }
              25% { transform: rotate(3deg); }
              75% { transform: rotate(-2deg); }
            }
          `}
        </style>

        {/* Ambient shadow underneath */}
        <ellipse cx="110" cy="205" rx="65" ry="10" fill="#1C1022" opacity="0.3" filter="blur(4px)" />

        {/* Corgi Behind Rim */}
        <g id="corgi-head-group">
          {/* Left Ear */}
          <path
            d="M 68 85 C 50 62 42 22 55 18 C 72 14 88 56 94 76 Z"
            fill="url(#furGrad)"
            stroke="#1E1328"
            strokeWidth="3.5"
            strokeLinejoin="round"
            style={{ transformOrigin: "68px 85px", animation: "ear-wiggle-l 4s ease-in-out infinite" }}
          />
          {/* Left Inner Ear */}
          <path
            d="M 66 76 C 54 58 48 30 57 26 C 68 23 79 54 84 70 Z"
            fill="#FFA69E"
            opacity="0.9"
          />

          {/* Right Ear */}
          <path
            d="M 152 85 C 170 62 178 22 165 18 C 148 14 132 56 126 76 Z"
            fill="url(#furGrad)"
            stroke="#1E1328"
            strokeWidth="3.5"
            strokeLinejoin="round"
            style={{ transformOrigin: "152px 85px", animation: "ear-wiggle-r 4s ease-in-out infinite" }}
          />
          {/* Right Inner Ear */}
          <path
            d="M 154 76 C 166 58 172 30 163 26 C 152 23 141 54 136 70 Z"
            fill="#FFA69E"
            opacity="0.9"
          />

          {/* Head Shape */}
          <ellipse cx="110" cy="80" rx="46" ry="40" fill="url(#furGrad)" stroke="#1E1328" strokeWidth="3.5" />

          {/* White Chest / Neck */}
          <path
            d="M 85 102 C 85 120 135 120 135 102 C 145 92 148 80 148 80 C 148 80 130 92 110 92 C 90 92 72 80 72 80 C 72 80 75 92 85 102 Z"
            fill="#FFFFFF"
          />

          {/* White Blaze on Forehead */}
          <path
            d="M 104 46 C 104 46 102 62 94 74 C 90 80 94 92 110 92 C 126 92 130 80 126 74 C 118 62 116 46 116 46 Z"
            fill="#FFFFFF"
            stroke="#1E1328"
            strokeWidth="1.5"
          />

          {/* Cheeks blush */}
          <ellipse cx="78" cy="84" rx="7" ry="4.5" fill="#F472B6" opacity="0.45" />
          <ellipse cx="142" cy="84" rx="7" ry="4.5" fill="#F472B6" opacity="0.45" />

          {/* Left Eye */}
          <ellipse cx="88" cy="74" rx="5.5" ry="6.5" fill="#1E1328" />
          <circle cx="86" cy="71" r="2.2" fill="#FFFFFF" />
          <circle cx="89.5" cy="75.5" r="1.1" fill="#FFFFFF" />

          {/* Right Eye */}
          <ellipse cx="132" cy="74" rx="5.5" ry="6.5" fill="#1E1328" />
          <circle cx="130" cy="71" r="2.2" fill="#FFFFFF" />
          <circle cx="133.5" cy="75.5" r="1.1" fill="#FFFFFF" />

          {/* Cute Nose */}
          <ellipse cx="110" cy="81" rx="6.5" ry="4.5" fill="#1E1328" />
          <ellipse cx="109" cy="79.5" rx="2" ry="1.2" fill="#FFFFFF" opacity="0.7" />

          {/* Mouth & Tongue */}
          <path
            d="M 104 85 Q 110 88 116 85"
            stroke="#1E1328"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Happy Tongue */}
          <path
            d="M 106 87 C 106 96 114 96 114 87 Z"
            fill="#EF4444"
            stroke="#1E1328"
            strokeWidth="2"
          />
        </g>

        {/* Care Box Body */}
        <g id="box-group">
          {/* Main Box */}
          <rect
            x="48"
            y="114"
            width="124"
            height="86"
            rx="12"
            fill="url(#boxGrad)"
            stroke="#1E1328"
            strokeWidth="4"
          />

          {/* Front Rim / Top Lip */}
          <rect
            x="40"
            y="104"
            width="140"
            height="20"
            rx="7"
            fill="url(#boxRimGrad)"
            stroke="#1E1328"
            strokeWidth="4"
          />

          {/* Box Highlight Stripe */}
          <rect x="52" y="128" width="6" height="66" rx="3" fill="#FFFFFF" opacity="0.25" />

          {/* Bone Badge Backing */}
          <rect x="76" y="142" width="68" height="34" rx="8" fill="#1E1328" opacity="0.15" />

          {/* Bone Graphic Centered on Box */}
          <g transform="translate(110, 158) scale(0.9)">
            {/* Bone Shaft */}
            <rect x="-20" y="-5" width="40" height="10" rx="3" fill="#FFFFFF" stroke="#1E1328" strokeWidth="2.5" />
            {/* Left Knobs */}
            <circle cx="-20" cy="-6" r="6" fill="#FFFFFF" stroke="#1E1328" strokeWidth="2.5" />
            <circle cx="-20" cy="6" r="6" fill="#FFFFFF" stroke="#1E1328" strokeWidth="2.5" />
            {/* Right Knobs */}
            <circle cx="20" cy="-6" r="6" fill="#FFFFFF" stroke="#1E1328" strokeWidth="2.5" />
            <circle cx="20" cy="6" r="6" fill="#FFFFFF" stroke="#1E1328" strokeWidth="2.5" />
            {/* Center overlap fill cleanups */}
            <rect x="-18" y="-4" width="36" height="8" rx="2" fill="#FFFFFF" />
            <circle cx="-19" cy="-5" r="4.5" fill="#FFFFFF" />
            <circle cx="-19" cy="5" r="4.5" fill="#FFFFFF" />
            <circle cx="19" cy="-5" r="4.5" fill="#FFFFFF" />
            <circle cx="19" cy="5" r="4.5" fill="#FFFFFF" />
          </g>

          {/* Left Paw over Rim */}
          <ellipse cx="76" cy="112" rx="12" ry="9" fill="#FFFFFF" stroke="#1E1328" strokeWidth="3" />
          <path d="M 72 112 L 72 117 M 76 112 L 76 118 M 80 112 L 80 117" stroke="#1E1328" strokeWidth="2" strokeLinecap="round" />

          {/* Right Paw over Rim */}
          <ellipse cx="144" cy="112" rx="12" ry="9" fill="#FFFFFF" stroke="#1E1328" strokeWidth="3" />
          <path d="M 140 112 L 140 117 M 144 112 L 144 118 M 148 112 L 148 117" stroke="#1E1328" strokeWidth="2" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}
