import React from 'react';
import { AvatarState } from '../types/todo';

interface AvatarRendererProps {
  avatar: AvatarState;
  size?: number; // size in px
  className?: string;
  animate?: boolean;
}

export const AvatarRenderer: React.FC<AvatarRendererProps> = ({
  avatar,
  size = 120,
  className = '',
  animate = true,
}) => {
  const { skinColor, hairStyle, hairColor, outfitColor, accessory } = avatar;

  return (
    <div
      className={`relative inline-block transition-transform duration-300 ${
        animate ? 'hover:scale-105 hover:animate-wobble' : ''
      } ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-md select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Aura / Circle */}
        <circle cx="50" cy="50" r="48" fill="#FDFBF7" stroke="#1E293B" strokeWidth="4" />

        {/* Outfit / Shoulders */}
        <path
          d="M 22 92 C 22 72, 35 68, 50 68 C 65 68, 78 72, 78 92 Z"
          fill={outfitColor}
          stroke="#1E293B"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Collar Detail */}
        <path
          d="M 42 68 L 50 76 L 58 68"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Neck */}
        <rect
          x="44"
          y="56"
          width="12"
          height="14"
          rx="4"
          fill={skinColor}
          stroke="#1E293B"
          strokeWidth="3"
        />

        {/* Head Base */}
        <rect
          x="28"
          y="22"
          width="44"
          height="40"
          rx="18"
          fill={skinColor}
          stroke="#1E293B"
          strokeWidth="3.5"
        />

        {/* Ears */}
        <circle cx="27" cy="42" r="5.5" fill={skinColor} stroke="#1E293B" strokeWidth="3" />
        <circle cx="73" cy="42" r="5.5" fill={skinColor} stroke="#1E293B" strokeWidth="3" />

        {/* Blush Cheeks */}
        <ellipse cx="36" cy="46" rx="4.5" ry="2.5" fill="#FF7675" opacity="0.6" />
        <ellipse cx="64" cy="46" rx="4.5" ry="2.5" fill="#FF7675" opacity="0.6" />

        {/* Eyes (Cheerful Anime style) */}
        <ellipse cx="38" cy="39" rx="3.5" ry="4" fill="#1E293B" />
        <ellipse cx="62" cy="39" rx="3.5" ry="4" fill="#1E293B" />
        {/* Eye highlights */}
        <circle cx="39.5" cy="37.5" r="1.2" fill="#FFFFFF" />
        <circle cx="63.5" cy="37.5" r="1.2" fill="#FFFFFF" />

        {/* Happy Smile */}
        <path
          d="M 44 48 Q 50 53 56 48"
          fill="none"
          stroke="#1E293B"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Hair Styles */}
        {hairStyle === 'short' && (
          <path
            d="M 27 34 C 25 18, 38 12, 50 12 C 62 12, 75 18, 73 34 C 68 24, 60 22, 50 24 C 40 22, 32 24, 27 34 Z"
            fill={hairColor}
            stroke="#1E293B"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
        )}

        {hairStyle === 'long' && (
          <g>
            <path
              d="M 24 35 C 24 55, 26 68, 30 72 C 32 50, 30 35, 27 25 C 38 12, 62 12, 73 25 C 70 35, 68 50, 70 72 C 74 68, 76 55, 76 35 Z"
              fill={hairColor}
              stroke="#1E293B"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            <path
              d="M 27 28 C 36 20, 64 20, 73 28 C 66 22, 56 24, 50 26 C 44 24, 34 22, 27 28 Z"
              fill={hairColor}
              stroke="#1E293B"
              strokeWidth="3"
            />
          </g>
        )}

        {hairStyle === 'spiky' && (
          <path
            d="M 26 34 L 28 20 L 37 24 L 43 12 L 50 20 L 57 12 L 63 24 L 72 20 L 74 34 Q 50 20 26 34 Z"
            fill={hairColor}
            stroke="#1E293B"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
        )}

        {hairStyle === 'bun' && (
          <g>
            <circle cx="50" cy="11" r="10" fill={hairColor} stroke="#1E293B" strokeWidth="3.5" />
            <path
              d="M 27 32 C 26 22, 36 18, 50 18 C 64 18, 74 22, 73 32 C 65 24, 57 26, 50 27 C 43 26, 35 24, 27 32 Z"
              fill={hairColor}
              stroke="#1E293B"
              strokeWidth="3.5"
            />
          </g>
        )}

        {hairStyle === 'wavy' && (
          <path
            d="M 25 36 C 22 25, 30 14, 50 14 C 70 14, 78 25, 75 36 C 72 44, 76 56, 73 64 Q 69 52, 70 34 C 62 26, 38 26, 30 34 Q 31 52, 27 64 C 24 56, 28 44, 25 36 Z"
            fill={hairColor}
            stroke="#1E293B"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
        )}

        {hairStyle === 'bob' && (
          <path
            d="M 24 32 C 24 45, 27 52, 31 54 L 31 38 C 36 24, 64 24, 69 38 L 69 54 C 73 52, 76 45, 76 32 C 73 18, 60 14, 50 14 C 40 14, 27 18, 24 32 Z"
            fill={hairColor}
            stroke="#1E293B"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
        )}

        {/* Accessories */}
        {accessory === 'glasses' && (
          <g>
            {/* Glasses frame left & right */}
            <rect
              x="30"
              y="33"
              width="16"
              height="12"
              rx="4"
              fill="rgba(255,255,255,0.4)"
              stroke="#1E293B"
              strokeWidth="3"
            />
            <rect
              x="54"
              y="33"
              width="16"
              height="12"
              rx="4"
              fill="rgba(255,255,255,0.4)"
              stroke="#1E293B"
              strokeWidth="3"
            />
            {/* Glasses bridge */}
            <line x1="46" y1="39" x2="54" y2="39" stroke="#1E293B" strokeWidth="3" />
            <line x1="26" y1="38" x2="30" y2="38" stroke="#1E293B" strokeWidth="3" />
            <line x1="70" y1="38" x2="74" y2="38" stroke="#1E293B" strokeWidth="3" />
          </g>
        )}

        {accessory === 'hat' && (
          <g>
            {/* Straw Hat Brim */}
            <ellipse cx="50" cy="22" rx="34" ry="7" fill="#FDCB6E" stroke="#1E293B" strokeWidth="3.5" />
            {/* Hat Dome */}
            <path
              d="M 32 21 C 32 10, 40 6, 50 6 C 60 6, 68 10, 68 21 Z"
              fill="#FFEAA7"
              stroke="#1E293B"
              strokeWidth="3.5"
            />
            {/* Ribbon */}
            <path d="M 32 19 Q 50 23 68 19 L 68 22 Q 50 26 32 22 Z" fill="#FF7675" />
          </g>
        )}

        {accessory === 'flower' && (
          <g transform="translate(62, 18)">
            {/* Petals */}
            <circle cx="0" cy="-6" r="4" fill="#FF7675" stroke="#1E293B" strokeWidth="1.5" />
            <circle cx="6" cy="0" r="4" fill="#FF7675" stroke="#1E293B" strokeWidth="1.5" />
            <circle cx="0" cy="6" r="4" fill="#FF7675" stroke="#1E293B" strokeWidth="1.5" />
            <circle cx="-6" cy="0" r="4" fill="#FF7675" stroke="#1E293B" strokeWidth="1.5" />
            {/* Center */}
            <circle cx="0" cy="0" r="3.5" fill="#FFEAA7" stroke="#1E293B" strokeWidth="1.5" />
          </g>
        )}

        {accessory === 'catEars' && (
          <g>
            {/* Left Ear */}
            <path
              d="M 28 26 L 22 10 L 36 18 Z"
              fill={hairColor}
              stroke="#1E293B"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <path d="M 27 23 L 24 13 L 33 18 Z" fill="#FF7675" />
            {/* Right Ear */}
            <path
              d="M 72 26 L 78 10 L 64 18 Z"
              fill={hairColor}
              stroke="#1E293B"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <path d="M 73 23 L 76 13 L 67 18 Z" fill="#FF7675" />
          </g>
        )}
      </svg>
    </div>
  );
};
