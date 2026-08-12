import React from 'react';
import { AvatarState } from '../types/todo';

interface FullBodyAvatarRendererProps {
  avatar: AvatarState;
  size?: number; // height in px
  className?: string;
  animate?: boolean;
}

export const FullBodyAvatarRenderer: React.FC<FullBodyAvatarRendererProps> = ({
  avatar,
  size = 190,
  className = '',
  animate = true,
}) => {
  const {
    skinTone,
    hairStyle,
    hairColor,
    eyesStyle,
    headItem,
    faceItem,
    outfit,
    topColor,
    bottomStyle,
    bottomColor,
    footwear,
    backItem,
  } = avatar;

  return (
    <div
      className={`relative inline-block transition-transform duration-300 ${
        animate ? 'hover:scale-105 hover:animate-wobble' : ''
      } ${className}`}
      style={{ height: size, width: size * 0.7 }}
    >
      <svg
        viewBox="0 0 100 150"
        className="w-full h-full drop-shadow-md select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* BACK GEAR LAYER */}
        {backItem === 'zoro_3swords' && (
          <g>
            {/* 3 Katanas crossed on back */}
            <rect x="18" y="25" width="4" height="85" transform="rotate(-40 50 50)" fill="#CBD5E1" stroke="#1E293B" strokeWidth="2" />
            <rect x="18" y="25" width="4" height="85" transform="rotate(-30 50 50)" fill="#E17055" stroke="#1E293B" strokeWidth="2" />
            <rect x="18" y="25" width="4" height="85" transform="rotate(-20 50 50)" fill="#A29BFE" stroke="#1E293B" strokeWidth="2" />
            {/* Hilts */}
            <circle cx="75" cy="22" r="4" fill="#FDCB6E" stroke="#1E293B" strokeWidth="1.5" />
            <circle cx="70" cy="16" r="4" fill="#D63031" stroke="#1E293B" strokeWidth="1.5" />
            <circle cx="64" cy="11" r="4" fill="#6C5CE7" stroke="#1E293B" strokeWidth="1.5" />
          </g>
        )}

        {backItem === 'mihawk_yoru' && (
          <g>
            {/* Black Blade Yoru Cross Sword */}
            <rect x="46" y="-5" width="8" height="110" transform="rotate(25 50 50)" fill="#2D3436" stroke="#1E293B" strokeWidth="2" />
            <rect x="20" y="30" width="50" height="8" transform="rotate(25 50 50)" fill="#FDCB6E" stroke="#1E293B" strokeWidth="2" />
            {/* Green Gem in Hilt */}
            <circle cx="58" cy="22" r="4" fill="#55E6C1" stroke="#1E293B" strokeWidth="1.5" />
          </g>
        )}

        {backItem === 'angel_wings' && (
          <g>
            <path d="M 35 60 C 10 30, 5 65, 30 80 Z" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.5" />
            <path d="M 65 60 C 90 30, 95 65, 70 80 Z" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.5" />
          </g>
        )}

        {backItem === 'demon_wings' && (
          <g>
            <path d="M 35 60 L 5 35 L 18 65 L 5 80 L 30 75 Z" fill="#D63031" stroke="#1E293B" strokeWidth="2.5" />
            <path d="M 65 60 L 95 35 L 82 65 L 95 80 L 70 75 Z" fill="#D63031" stroke="#1E293B" strokeWidth="2.5" />
          </g>
        )}

        {backItem === 'shield' && (
          <g transform="translate(68, 65)">
            <path d="M 0 0 L 16 0 L 16 16 C 16 26, 8 30, 8 30 C 8 30, 0 26, 0 16 Z" fill="#E17055" stroke="#1E293B" strokeWidth="2" />
            <circle cx="8" cy="12" r="3" fill="#FDCB6E" />
          </g>
        )}

        {backItem === 'pet_cat' && (
          <g transform="translate(10, 95)">
            <ellipse cx="10" cy="12" rx="8" ry="6" fill="#FDCB6E" stroke="#1E293B" strokeWidth="2" />
            <circle cx="10" cy="5" r="5" fill="#FDCB6E" stroke="#1E293B" strokeWidth="2" />
            <path d="M 6 2 L 8 6 L 5 6 Z" fill="#E17055" stroke="#1E293B" strokeWidth="1" />
            <path d="M 14 2 L 12 6 L 15 6 Z" fill="#E17055" stroke="#1E293B" strokeWidth="1" />
          </g>
        )}

        {backItem === 'cape' && (
          <path d="M 28 58 L 72 58 L 78 125 L 22 125 Z" fill="#D63031" stroke="#1E293B" strokeWidth="2.5" />
        )}

        {/* LEGS & BOTTOMS */}
        {bottomStyle === 'pants' && (
          <g>
            <rect x="36" y="94" width="11" height="34" rx="3" fill={bottomColor} stroke="#1E293B" strokeWidth="2.5" />
            <rect x="53" y="94" width="11" height="34" rx="3" fill={bottomColor} stroke="#1E293B" strokeWidth="2.5" />
          </g>
        )}

        {bottomStyle === 'shorts' && (
          <g>
            <rect x="37" y="94" width="9" height="32" rx="3" fill={skinTone} stroke="#1E293B" strokeWidth="2" />
            <rect x="54" y="94" width="9" height="32" rx="3" fill={skinTone} stroke="#1E293B" strokeWidth="2" />
            <rect x="35" y="94" width="13" height="18" rx="2" fill={bottomColor} stroke="#1E293B" strokeWidth="2.5" />
            <rect x="52" y="94" width="13" height="18" rx="2" fill={bottomColor} stroke="#1E293B" strokeWidth="2.5" />
            {/* White Fur Trim on Luffy's Denim Shorts */}
            <rect x="34" y="110" width="15" height="3" fill="#FFFFFF" />
            <rect x="51" y="110" width="15" height="3" fill="#FFFFFF" />
          </g>
        )}

        {bottomStyle === 'skirt' && (
          <g>
            <rect x="37" y="94" width="9" height="32" rx="3" fill={skinTone} stroke="#1E293B" strokeWidth="2" />
            <rect x="54" y="94" width="9" height="32" rx="3" fill={skinTone} stroke="#1E293B" strokeWidth="2" />
            <path d="M 32 94 L 68 94 L 73 110 L 27 110 Z" fill={bottomColor} stroke="#1E293B" strokeWidth="2.5" />
          </g>
        )}

        {bottomStyle === 'greaves' && (
          <g>
            <rect x="35" y="94" width="12" height="32" rx="2" fill="#94A3B8" stroke="#1E293B" strokeWidth="2.5" />
            <rect x="53" y="94" width="12" height="32" rx="2" fill="#94A3B8" stroke="#1E293B" strokeWidth="2.5" />
          </g>
        )}

        {/* FOOTWEAR */}
        {footwear === 'sandals' && (
          <g>
            {/* Luffy Straw Sandals */}
            <rect x="34" y="128" width="12" height="5" fill="#FDCB6E" stroke="#1E293B" strokeWidth="2" />
            <rect x="54" y="128" width="12" height="5" fill="#FDCB6E" stroke="#1E293B" strokeWidth="2" />
            <path d="M 36 128 L 40 124 L 44 128" stroke="#D63031" strokeWidth="2" fill="none" />
            <path d="M 56 128 L 60 124 L 64 128" stroke="#D63031" strokeWidth="2" fill="none" />
          </g>
        )}

        {footwear === 'pirate_boots' && (
          <g>
            <path d="M 33 120 L 47 120 L 49 135 L 31 135 Z" fill="#2D3436" stroke="#1E293B" strokeWidth="2" />
            <path d="M 53 120 L 67 120 L 69 135 L 51 135 Z" fill="#2D3436" stroke="#1E293B" strokeWidth="2" />
            <rect x="32" y="120" width="16" height="4" fill="#FDCB6E" />
            <rect x="52" y="120" width="16" height="4" fill="#FDCB6E" />
          </g>
        )}

        {footwear === 'boots' && (
          <g>
            <rect x="33" y="122" width="14" height="14" rx="3" fill="#55E6C1" stroke="#1E293B" strokeWidth="2" />
            <rect x="53" y="122" width="14" height="14" rx="3" fill="#55E6C1" stroke="#1E293B" strokeWidth="2" />
          </g>
        )}

        {footwear === 'sneakers' && (
          <g>
            <rect x="33" y="124" width="14" height="12" rx="3" fill="#74B9FF" stroke="#1E293B" strokeWidth="2" />
            <rect x="53" y="124" width="14" height="12" rx="3" fill="#74B9FF" stroke="#1E293B" strokeWidth="2" />
            <rect x="33" y="132" width="14" height="4" fill="#FFFFFF" />
            <rect x="53" y="132" width="14" height="4" fill="#FFFFFF" />
          </g>
        )}

        {/* TORSO OUTFIT */}
        <rect x="23" y="60" width="10" height="32" rx="4" fill={skinTone} stroke="#1E293B" strokeWidth="2" />
        <rect x="67" y="60" width="10" height="32" rx="4" fill={skinTone} stroke="#1E293B" strokeWidth="2" />

        <path
          d="M 30 56 C 30 52, 70 52, 70 56 L 72 94 L 28 94 Z"
          fill={topColor}
          stroke="#1E293B"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {outfit === 'pirate_captain' && (
          <g>
            {/* Red Pirate Vest open chest */}
            <path d="M 40 56 L 36 94 L 46 94 L 50 70 L 54 94 L 64 94 L 60 56 Z" fill="#D63031" stroke="#1E293B" strokeWidth="2" />
            {/* Yellow Waist Sash */}
            <rect x="28" y="86" width="44" height="8" fill="#FDCB6E" stroke="#1E293B" strokeWidth="2" />
          </g>
        )}

        {outfit === 'armor' && (
          <g>
            <circle cx="28" cy="58" r="7" fill="#CBD5E1" stroke="#1E293B" strokeWidth="2" />
            <circle cx="72" cy="58" r="7" fill="#CBD5E1" stroke="#1E293B" strokeWidth="2" />
            <rect x="38" y="64" width="24" height="20" fill="#94A3B8" stroke="#1E293B" strokeWidth="2" />
          </g>
        )}

        {outfit === 'hoodie' && (
          <path d="M 40 56 L 50 68 L 60 56" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
        )}

        {outfit === 'cyberpunk' && (
          <g>
            <line x1="32" y1="62" x2="68" y2="62" stroke="#55E6C1" strokeWidth="3" />
            <line x1="32" y1="78" x2="68" y2="78" stroke="#FF7675" strokeWidth="3" />
          </g>
        )}

        {outfit === 'royal' && (
          <path d="M 32 56 L 50 78 L 68 56 Z" fill="#FDCB6E" stroke="#1E293B" strokeWidth="2" />
        )}

        {/* HEAD & FACE */}
        <rect x="44" y="46" width="12" height="12" rx="3" fill={skinTone} stroke="#1E293B" strokeWidth="2" />
        <rect x="30" y="20" width="40" height="34" rx="14" fill={skinTone} stroke="#1E293B" strokeWidth="2.5" />

        <circle cx="28" cy="37" r="4.5" fill={skinTone} stroke="#1E293B" strokeWidth="2" />
        <circle cx="72" cy="37" r="4.5" fill={skinTone} stroke="#1E293B" strokeWidth="2" />

        <ellipse cx="37" cy="40" rx="3.5" ry="2" fill="#FF7675" opacity="0.6" />
        <ellipse cx="63" cy="40" rx="3.5" ry="2" fill="#FF7675" opacity="0.6" />

        {/* EYES & FACE ITEMS */}
        {(eyesStyle === 'cute_sparkle' || faceItem === 'anime_eyes') && (
          <g>
            <ellipse cx="39" cy="34" rx="3" ry="4" fill="#1E293B" />
            <ellipse cx="61" cy="34" rx="3" ry="4" fill="#1E293B" />
            <circle cx="40" cy="32.5" r="1" fill="#FFFFFF" />
            <circle cx="62" cy="32.5" r="1" fill="#FFFFFF" />
          </g>
        )}

        {eyesStyle === 'normal' && faceItem === 'none' && (
          <g>
            <circle cx="39" cy="34" r="2.5" fill="#1E293B" />
            <circle cx="61" cy="34" r="2.5" fill="#1E293B" />
          </g>
        )}

        {faceItem === 'zoro_eyepatch' && (
          <g>
            {/* Open Right Eye */}
            <ellipse cx="39" cy="34" rx="3" ry="4" fill="#1E293B" />
            <circle cx="40" cy="32.5" r="1" fill="#FFFFFF" />
            {/* Zoro Eye Scar + Black Eyepatch */}
            <line x1="56" y1="26" x2="66" y2="42" stroke="#1E293B" strokeWidth="2.5" />
            <rect x="54" y="29" width="13" height="11" rx="2" fill="#2D3436" stroke="#1E293B" strokeWidth="2" />
          </g>
        )}

        {faceItem === 'bandana' && (
          <g>
            <rect x="28" y="20" width="44" height="8" fill="#2D3436" stroke="#1E293B" strokeWidth="2" />
            <path d="M 28 24 L 20 32 L 25 32 Z" fill="#2D3436" />
          </g>
        )}

        {faceItem === 'glasses' && (
          <g>
            <rect x="32" y="29" width="13" height="10" rx="3" fill="rgba(255,255,255,0.4)" stroke="#1E293B" strokeWidth="2" />
            <rect x="55" y="29" width="13" height="10" rx="3" fill="rgba(255,255,255,0.4)" stroke="#1E293B" strokeWidth="2" />
            <line x1="45" y1="34" x2="55" y2="34" stroke="#1E293B" strokeWidth="2" />
          </g>
        )}

        {faceItem === 'goggles' && (
          <g>
            <rect x="30" y="28" width="16" height="12" rx="4" fill="#55E6C1" stroke="#1E293B" strokeWidth="2" />
            <rect x="54" y="28" width="16" height="12" rx="4" fill="#55E6C1" stroke="#1E293B" strokeWidth="2" />
            <line x1="46" y1="34" x2="54" y2="34" stroke="#1E293B" strokeWidth="3" />
          </g>
        )}

        {faceItem === 'monocle' && (
          <g>
            <circle cx="39" cy="34" r="2.5" fill="#1E293B" />
            <circle cx="61" cy="34" r="5" fill="rgba(255,255,255,0.4)" stroke="#FDCB6E" strokeWidth="2" />
            <line x1="61" y1="39" x2="65" y2="48" stroke="#FDCB6E" strokeWidth="1.5" />
          </g>
        )}

        {faceItem === 'mask' && (
          <rect x="32" y="38" width="36" height="14" rx="4" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
        )}

        <path d="M 45 43 Q 50 47 55 43" fill="none" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />

        {/* HAIRSTYLES */}
        {hairStyle === 'shanks_flow' && (
          <g>
            {/* Shanks Red Emperor Hair */}
            <path
              d="M 26 30 C 20 48, 22 62, 28 66 C 34 48, 30 30, 27 18 C 38 10, 62 10, 73 18 C 70 30, 66 48, 72 66 C 78 62, 80 48, 74 30 Z"
              fill={hairColor}
              stroke="#1E293B"
              strokeWidth="2.5"
            />
          </g>
        )}

        {hairStyle === 'spiky' && (
          <path
            d="M 28 30 L 30 18 L 38 22 L 44 12 L 50 18 L 56 12 L 62 22 L 70 18 L 72 30 Q 50 20 28 30 Z"
            fill={hairColor}
            stroke="#1E293B"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        )}

        {hairStyle === 'short' && (
          <path
            d="M 28 30 C 26 18, 38 14, 50 14 C 62 14, 74 18, 72 30 C 66 22, 58 21, 50 22 C 42 21, 34 22, 28 30 Z"
            fill={hairColor}
            stroke="#1E293B"
            strokeWidth="2.5"
          />
        )}

        {hairStyle === 'long' && (
          <path
            d="M 26 32 C 24 49, 26 62, 29 66 C 32 49, 29 32, 27 22 C 38 12, 62 12, 73 22 C 71 32, 68 49, 71 66 C 74 62, 76 49, 74 32 Z"
            fill={hairColor}
            stroke="#1E293B"
            strokeWidth="2.5"
          />
        )}

        {hairStyle === 'bun' && (
          <g>
            <circle cx="50" cy="12" r="8" fill={hairColor} stroke="#1E293B" strokeWidth="2.5" />
            <path d="M 28 29 C 27 20, 36 16, 50 16 C 64 16, 73 20, 72 29 Z" fill={hairColor} stroke="#1E293B" strokeWidth="2.5" />
          </g>
        )}

        {hairStyle === 'afro' && (
          <circle cx="50" cy="24" r="22" fill={hairColor} stroke="#1E293B" strokeWidth="2.5" />
        )}

        {/* HEAD GEAR ITEMS */}
        {headItem === 'straw_hat' && (
          <g>
            {/* Luffy Classic Straw Hat */}
            <ellipse cx="50" cy="22" rx="36" ry="8" fill="#FDCB6E" stroke="#1E293B" strokeWidth="2.5" />
            <path d="M 32 21 C 32 10, 40 6, 50 6 C 60 6, 68 10, 68 21 Z" fill="#FFEAA7" stroke="#1E293B" strokeWidth="2.5" />
            {/* Red Ribbon */}
            <path d="M 32 20 C 32 16, 40 14, 50 14 C 60 14, 68 16, 68 20 Z" fill="#D63031" stroke="#1E293B" strokeWidth="1.5" />
          </g>
        )}

        {headItem === 'pirate_bicorne' && (
          <g>
            {/* Captain's Pirate Bicorne */}
            <path d="M 15 22 C 30 5, 70 5, 85 22 L 72 24 C 60 18, 40 18, 28 24 Z" fill="#2D3436" stroke="#1E293B" strokeWidth="2.5" />
            <circle cx="50" cy="14" r="3" fill="#FFFFFF" />
          </g>
        )}

        {headItem === 'wizard_hat' && (
          <g>
            <path d="M 20 24 L 80 24 L 50 -4 Z" fill="#4834D4" stroke="#1E293B" strokeWidth="2.5" />
            <ellipse cx="50" cy="24" rx="32" ry="5" fill="#6C5CE7" stroke="#1E293B" strokeWidth="2.5" />
            <circle cx="50" cy="-4" r="3" fill="#FDCB6E" />
          </g>
        )}

        {headItem === 'crown' && (
          <polygon points="30,24 35,10 42,20 50,6 58,20 65,10 70,24" fill="#FDCB6E" stroke="#1E293B" strokeWidth="2.5" />
        )}

        {headItem === 'headphones' && (
          <g>
            <path d="M 26 34 C 26 12, 74 12, 74 34" fill="none" stroke="#FF7675" strokeWidth="4" />
            <rect x="23" y="28" width="7" height="14" rx="3" fill="#1E293B" />
            <rect x="70" y="28" width="7" height="14" rx="3" fill="#1E293B" />
          </g>
        )}

        {headItem === 'viking' && (
          <g>
            <path d="M 28 24 L 72 24 L 50 10 Z" fill="#94A3B8" stroke="#1E293B" strokeWidth="2.5" />
            <path d="M 28 24 Q 18 10 22 4" fill="none" stroke="#FFFFFF" strokeWidth="3" />
            <path d="M 72 24 Q 82 10 78 4" fill="none" stroke="#FFFFFF" strokeWidth="3" />
          </g>
        )}

        {headItem === 'bunny_ears' && (
          <g>
            <ellipse cx="38" cy="4" rx="5" ry="14" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
            <ellipse cx="62" cy="4" rx="5" ry="14" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
            <ellipse cx="38" cy="4" rx="2.5" ry="9" fill="#FF7675" />
            <ellipse cx="62" cy="4" rx="2.5" ry="9" fill="#FF7675" />
          </g>
        )}
      </svg>
    </div>
  );
};
