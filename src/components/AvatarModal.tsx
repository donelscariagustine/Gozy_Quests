import React, { useState, useRef } from 'react';
import { AvatarState } from '../types/todo';
import { FullBodyAvatarRenderer } from './FullBodyAvatarRenderer';
import { AVAILABLE_TITLES } from '../utils/gameEngine';
import { X, Sparkles, Check, Shuffle, Crown } from 'lucide-react';
import { sounds } from '../utils/audio';

interface AvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  avatar: AvatarState;
  onSaveAvatar: (newAvatar: AvatarState) => void;
}

const HEAD_ITEMS = [
  { label: 'Straw Hat (Luffy Ref) 👒', id: 'straw_hat' },
  { label: 'Pirate Captain Bicorne 🏴‍☠️', id: 'pirate_bicorne' },
  { label: 'Wizard Hat 🧙', id: 'wizard_hat' },
  { label: 'Royal Crown 👑', id: 'crown' },
  { label: 'Headphones 🎧', id: 'headphones' },
  { label: 'Viking Helm 🪖', id: 'viking' },
  { label: 'Bunny Ears 🐰', id: 'bunny_ears' },
  { label: 'None ❌', id: 'none' },
];

const FACE_ITEMS = [
  { label: 'Zoro Eye Scar / Eyepatch 👁️', id: 'zoro_eyepatch' },
  { label: 'Pirate Bandana 🏴‍☠️', id: 'bandana' },
  { label: 'Anime Sparkle Eyes ✨', id: 'anime_eyes' },
  { label: 'Wayfarer Glasses 👓', id: 'glasses' },
  { label: 'Cyber Goggles 🥽', id: 'goggles' },
  { label: 'Monocle 🧐', id: 'monocle' },
  { label: 'Surgical Mask 😷', id: 'mask' },
  { label: 'None ❌', id: 'none' },
];

const HAIR_STYLES = [
  { label: 'Samurai Topknot 🗡️', id: 'samurai_bun' },
  { label: 'Spiky Manga ⚡', id: 'spiky' },
  { label: 'Short Crop ✂️', id: 'short' },
  { label: 'Long Flow 🌊', id: 'long' },
  { label: 'Top Bun 🍡', id: 'bun' },
  { label: 'Clean Shaved 🧑‍🦲', id: 'bald' },
];

const OUTFIT_OPTIONS = [
  { label: 'Pirate Captain Robe 🏴‍☠️', id: 'pirate_captain' },
  { label: 'Knight Armor 🛡️', id: 'armor' },
  { label: 'Cozy Hoodie 🧥', id: 'hoodie' },
  { label: 'Cyberpunk Suit ⚡', id: 'cyberpunk' },
  { label: 'Royal Cape Fit 👑', id: 'royal' },
];

const FOOTWEAR_OPTIONS = [
  { label: 'Straw Sandals (Luffy Ref) 🩴', id: 'straw_sandals' },
  { label: 'Pirate Leather Boots 👢', id: 'pirate_boots' },
  { label: 'Shadow High-Tops 👟', id: 'shadow_sneakers' },
  { label: 'Knight Greaves 🥾', id: 'boots' },
];

const BACK_ITEMS = [
  { label: '3 Katanas (Zoro Ref) ⚔️', id: 'zoro_3swords' },
  { label: 'Black Blade Yoru (Mihawk Ref) 🗡️', id: 'mihawk_yoru' },
  { label: 'Shadow Demon Wings 🦇', id: 'demon_wings' },
  { label: 'Angel Wings 🪽', id: 'angel_wings' },
  { label: 'Aegis Shield 🛡️', id: 'shield' },
  { label: 'Emperor Dark Cape 🦸', id: 'cape' },
  { label: 'None ❌', id: 'none' },
];

const COLOR_PALETTE = ['#D63031', '#6C5CE7', '#FF7675', '#55E6C1', '#FDCB6E', '#74B9FF', '#2D3436', '#E17055', '#4834D4'];

interface DraggableSelectorProps<T> {
  title: string;
  items: { id: T; label: string }[];
  selectedId: T;
  onSelect: (id: T) => void;
}

export function DraggableSelector<T extends string>({
  title,
  items,
  selectedId,
  onSelect,
}: DraggableSelectorProps<T>) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Arrow Navigation Scroll Handler
  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-2 mb-5">
      {/* Category Header with Arrow Controls for Desktop */}
      <div className="flex items-center justify-between px-1">
        <label className="text-xs font-black uppercase text-indigo-400 tracking-wider">
          {title}
        </label>
        
        {/* Desktop Arrow Buttons */}
        <div className="hidden md:flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => handleScroll('left')}
            className="h-7 w-7 rounded-lg border-2 border-slate-700 bg-[#1e293b] text-slate-300 hover:bg-indigo-600 hover:text-white flex items-center justify-center text-xs font-bold transition-all cursor-pointer"
            title="Scroll Left"
          >
            ◄
          </button>
          <button
            type="button"
            onClick={() => handleScroll('right')}
            className="h-7 w-7 rounded-lg border-2 border-slate-700 bg-[#1e293b] text-slate-300 hover:bg-indigo-600 hover:text-white flex items-center justify-center text-xs font-bold transition-all cursor-pointer"
            title="Scroll Right"
          >
            ►
          </button>
        </div>
      </div>

      {/* DRAGGABLE & SCROLLABLE TRACK */}
      <div
        ref={scrollRef}
        className="flex gap-2.5 overflow-x-auto py-2 px-1 cursor-grab active:cursor-grabbing select-none scroll-smooth custom-desktop-scrollbar"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#4f46e5 #0f172a',
        }}
      >
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              sounds.playPop();
              onSelect(item.id);
            }}
            className={`shrink-0 rounded-2xl border-2 px-4 py-2.5 text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
              selectedId === item.id
                ? 'border-indigo-500 bg-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.5)] scale-105'
                : 'border-slate-800 bg-[#1e293b] text-slate-300 hover:bg-slate-700'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export const AvatarModal: React.FC<AvatarModalProps> = ({
  isOpen,
  onClose,
  avatar,
  onSaveAvatar,
}) => {
  const [draft, setDraft] = useState<AvatarState>(avatar);

  if (!isOpen) return null;

  const handleRandomize = () => {
    sounds.playPop();
    const randomHead = HEAD_ITEMS[Math.floor(Math.random() * HEAD_ITEMS.length)].id;
    const randomFace = FACE_ITEMS[Math.floor(Math.random() * FACE_ITEMS.length)].id;
    const randomHair = HAIR_STYLES[Math.floor(Math.random() * HAIR_STYLES.length)].id;
    const randomHairColor = COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)];
    const randomOutfit = OUTFIT_OPTIONS[Math.floor(Math.random() * OUTFIT_OPTIONS.length)].id;
    const randomTopColor = COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)];
    const randomFootwear = FOOTWEAR_OPTIONS[Math.floor(Math.random() * FOOTWEAR_OPTIONS.length)].id;
    const randomBack = BACK_ITEMS[Math.floor(Math.random() * BACK_ITEMS.length)].id;

    setDraft((prev) => ({
      ...prev,
      headItem: randomHead,
      faceItem: randomFace,
      hairStyle: randomHair,
      hairColor: randomHairColor,
      outfit: randomOutfit,
      topColor: randomTopColor,
      footwear: randomFootwear,
      backItem: randomBack,
    }));
  };

  const handleSave = () => {
    sounds.playLevelUp();
    onSaveAvatar(draft);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-pop-in">
      <div className="card-cozy w-full max-w-2xl p-6 bg-[#0f172a] text-slate-100 border-4 border-slate-800 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto relative">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-black text-white">Full-Body Hero Avatar Studio</h2>
          </div>
          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-6 h-6 stroke-[3]" />
          </button>
        </div>

        {/* Studio Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Avatar Preview Panel (Left Column) */}
          <div className="md:col-span-5 flex flex-col items-center justify-center rounded-3xl border-4 border-slate-800 bg-[#1e293b] p-6 text-center shadow-inner relative">
            <span className="absolute top-3 left-3 rounded-full border border-slate-700 bg-indigo-600 px-3 py-1 text-[10px] font-black uppercase text-white shadow-sm">
              Live Preview
            </span>

            <div className="my-4">
              <FullBodyAvatarRenderer avatar={draft} size={190} animate={true} />
            </div>

            <div className="mt-2 text-center space-y-1">
              <span className="inline-flex items-center gap-1 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-black text-amber-400">
                <Crown className="w-3.5 h-3.5" /> {draft.equippedTitle || 'Pirate King'}
              </span>
            </div>

            <button
              onClick={handleRandomize}
              className="mt-4 btn-tactile bg-amber-400 hover:bg-amber-500 text-slate-900 text-xs font-black px-4 py-2 flex items-center gap-1.5 cursor-pointer"
            >
              <Shuffle className="w-4 h-4" /> Randomize Fit
            </button>
          </div>

          {/* Controls Panel (Right Column) - Touch & Draggable Carousels with Desktop Arrow Controls */}
          <div className="md:col-span-7 space-y-4 max-h-[60vh] overflow-y-auto no-scrollbar pr-1">
            {/* Title Selector Track with Custom Title Scrollbar */}
            <div className="space-y-2 mb-5">
              <div className="flex items-center justify-between px-1">
                <label className="text-xs font-black uppercase text-amber-400 tracking-wider">
                  🏆 Equipped Title Badge
                </label>
              </div>
              <div
                className="flex gap-2.5 overflow-x-auto py-2.5 px-1 select-none scroll-smooth custom-title-scrollbar"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#4f46e5 #0f172a',
                }}
              >
                {AVAILABLE_TITLES.map((title) => (
                  <button
                    key={title}
                    type="button"
                    onClick={() => {
                      sounds.playPop();
                      setDraft((prev) => ({ ...prev, equippedTitle: title }));
                    }}
                    className={`shrink-0 rounded-2xl border-2 px-4 py-2 text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                      draft.equippedTitle === title
                        ? 'border-amber-400 bg-amber-400/20 text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.3)] scale-105'
                        : 'border-slate-800 bg-[#1e293b] text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    ✨ {title}
                  </button>
                ))}
              </div>
            </div>

            {/* Draggable Selector Carousels */}
            <DraggableSelector
              title="head gear"
              items={HEAD_ITEMS}
              selectedId={draft.headItem}
              onSelect={(id) => setDraft((prev) => ({ ...prev, headItem: id }))}
            />

            <DraggableSelector
              title="face gear"
              items={FACE_ITEMS}
              selectedId={draft.faceItem}
              onSelect={(id) => setDraft((prev) => ({ ...prev, faceItem: id }))}
            />

            <DraggableSelector
              title="hair style"
              items={HAIR_STYLES}
              selectedId={draft.hairStyle}
              onSelect={(id) => setDraft((prev) => ({ ...prev, hairStyle: id }))}
            />

            {/* Hair Color Palette Selector */}
            <div className="space-y-2 mb-5">
              <label className="text-xs font-black uppercase text-indigo-400 tracking-wider px-1">
                hair dye
              </label>
              <div className="flex items-center gap-2 overflow-x-auto custom-desktop-scrollbar py-2 px-1">
                {COLOR_PALETTE.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => {
                      sounds.playPop();
                      setDraft((prev) => ({ ...prev, hairColor: color }));
                    }}
                    className={`w-8 h-8 rounded-full border-2 border-slate-800 shrink-0 transition-transform cursor-pointer ${
                      draft.hairColor === color ? 'scale-125 ring-2 ring-white' : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <DraggableSelector
              title="top outfit"
              items={OUTFIT_OPTIONS}
              selectedId={draft.outfit}
              onSelect={(id) => setDraft((prev) => ({ ...prev, outfit: id }))}
            />

            {/* Top Color Palette Selector */}
            <div className="space-y-2 mb-5">
              <label className="text-xs font-black uppercase text-indigo-400 tracking-wider px-1">
                outfit dye
              </label>
              <div className="flex items-center gap-2 overflow-x-auto custom-desktop-scrollbar py-2 px-1">
                {COLOR_PALETTE.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => {
                      sounds.playPop();
                      setDraft((prev) => ({ ...prev, topColor: color }));
                    }}
                    className={`w-8 h-8 rounded-full border-2 border-slate-800 shrink-0 transition-transform cursor-pointer ${
                      draft.topColor === color ? 'scale-125 ring-2 ring-white' : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <DraggableSelector
              title="footwear / shoes"
              items={FOOTWEAR_OPTIONS}
              selectedId={draft.footwear}
              onSelect={(id) => setDraft((prev) => ({ ...prev, footwear: id }))}
            />

            <DraggableSelector
              title="back gear"
              items={BACK_ITEMS}
              selectedId={draft.backItem}
              onSelect={(id) => setDraft((prev) => ({ ...prev, backItem: id }))}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-slate-800">
          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl border-2 border-slate-800 bg-[#1e293b] text-slate-300 font-extrabold text-xs hover:bg-slate-700 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn-tactile bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs px-6 py-2.5 flex items-center gap-2 cursor-pointer shadow-[2px_2px_0px_0px_#020617]"
          >
            <Check className="w-4 h-4 stroke-[3]" /> Save Hero Gear
          </button>
        </div>
      </div>
    </div>
  );
};
