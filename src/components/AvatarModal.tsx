import React, { useState } from 'react';
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
  { label: 'Straw Hat (Luffy Ref) 👒', value: 'straw_hat' },
  { label: 'Pirate Captain Bicorne 🏴‍☠️', value: 'pirate_bicorne' },
  { label: 'Wizard Hat 🧙', value: 'wizard_hat' },
  { label: 'Royal Crown 👑', value: 'crown' },
  { label: 'Headphones 🎧', value: 'headphones' },
  { label: 'Viking Helm 🪖', value: 'viking' },
  { label: 'Bunny Ears 🐰', value: 'bunny_ears' },
  { label: 'None', value: 'none' },
];

const FACE_ITEMS = [
  { label: 'Zoro Eye Scar / Eyepatch 👁️', value: 'zoro_eyepatch' },
  { label: 'Pirate Bandana 🏴‍☠️', value: 'bandana' },
  { label: 'Anime Sparkle Eyes ✨', value: 'anime_eyes' },
  { label: 'Wayfarer Glasses 👓', value: 'glasses' },
  { label: 'Cyber Goggles 🥽', value: 'goggles' },
  { label: 'Monocle 🧐', value: 'monocle' },
  { label: 'Surgical Mask 😷', value: 'mask' },
  { label: 'None', value: 'none' },
];

const HAIR_STYLES = [
  { label: 'Emperor Red Flow (Shanks) 🔴', value: 'shanks_flow' },
  { label: 'Spiky Anime ⚡', value: 'spiky' },
  { label: 'Short Crop ✂️', value: 'short' },
  { label: 'Long Flow 🌊', value: 'long' },
  { label: 'Top Bun 🍡', value: 'bun' },
  { label: 'Afro Cloud ☁️', value: 'afro' },
];

const OUTFIT_OPTIONS = [
  { label: 'Pirate Captain Robe 🏴‍☠️', value: 'pirate_captain' },
  { label: 'Knight Armor 🛡️', value: 'armor' },
  { label: 'Cozy Hoodie 🧥', value: 'hoodie' },
  { label: 'Cyberpunk Suit ⚡', value: 'cyberpunk' },
  { label: 'Royal Cape Fit 👑', value: 'royal' },
];

const FOOTWEAR_OPTIONS = [
  { label: 'Straw Sandals (Luffy Ref) 🩴', value: 'sandals' },
  { label: 'Pirate Leather Boots 👢', value: 'pirate_boots' },
  { label: 'Combat Boots 🥾', value: 'boots' },
  { label: 'High Sneakers 👟', value: 'sneakers' },
  { label: 'Barefoot 🦶', value: 'barefoot' },
];

const BACK_ITEMS = [
  { label: '3 Katanas (Zoro Ref) ⚔️', value: 'zoro_3swords' },
  { label: 'Black Blade Yoru (Mihawk Ref) 🗡️', value: 'mihawk_yoru' },
  { label: 'Angel Wings 🪽', value: 'angel_wings' },
  { label: 'Demon Wings 🦇', value: 'demon_wings' },
  { label: 'Aegis Shield 🛡️', value: 'shield' },
  { label: 'Companion Cat 🐱', value: 'pet_cat' },
  { label: 'Royal Cape 🦸', value: 'cape' },
  { label: 'None ❌', value: 'none' },
];

const COLOR_PALETTE = ['#D63031', '#6C5CE7', '#FF7675', '#55E6C1', '#FDCB6E', '#74B9FF', '#2D3436', '#E17055', '#4834D4'];

export const AvatarModal: React.FC<AvatarModalProps> = ({
  isOpen,
  onClose,
  avatar,
  onSaveAvatar,
}) => {
  const [draft, setDraft] = useState<AvatarState>(avatar);
  const [activeTab, setActiveTab] = useState<'title' | 'head' | 'face' | 'hair' | 'outfit' | 'footwear' | 'back'>('title');

  if (!isOpen) return null;

  const handleRandomize = () => {
    sounds.playPop();
    const randomHead = HEAD_ITEMS[Math.floor(Math.random() * HEAD_ITEMS.length)].value;
    const randomFace = FACE_ITEMS[Math.floor(Math.random() * FACE_ITEMS.length)].value;
    const randomHair = HAIR_STYLES[Math.floor(Math.random() * HAIR_STYLES.length)].value;
    const randomHairColor = COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)];
    const randomOutfit = OUTFIT_OPTIONS[Math.floor(Math.random() * OUTFIT_OPTIONS.length)].value;
    const randomTopColor = COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)];
    const randomBack = BACK_ITEMS[Math.floor(Math.random() * BACK_ITEMS.length)].value;

    setDraft((prev) => ({
      ...prev,
      headItem: randomHead,
      faceItem: randomFace,
      hairStyle: randomHair,
      hairColor: randomHairColor,
      outfit: randomOutfit,
      topColor: randomTopColor,
      backItem: randomBack,
    }));
  };

  const handleSave = () => {
    sounds.playPop();
    onSaveAvatar(draft);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-pop-in">
      <div className="card-cozy w-full max-w-xl overflow-hidden flex flex-col max-h-[92vh] bg-[#FAF6EE] dark:bg-slate-900 text-slate-800 dark:text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-amber-100 dark:bg-slate-800 border-b-4 border-slate-800 dark:border-indigo-500/40">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-500 fill-amber-300" />
            <h2 className="text-xl font-black">Pirate Wardrobe Studio</h2>
          </div>
          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-amber-200 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-[#FAF6EE] dark:bg-slate-950">
          {/* Live Preview Card */}
          <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-900 border-4 border-slate-800 dark:border-indigo-500/40 rounded-2xl shadow-chunky relative">
            <FullBodyAvatarRenderer avatar={draft} size={190} animate={true} />
            <div className="mt-2 text-center">
              <span className="bg-amber-300 dark:bg-indigo-600 text-slate-900 dark:text-white border border-slate-800 dark:border-indigo-400 text-xs font-black px-3 py-0.5 rounded-lg inline-block shadow-chunky-sm">
                🏴‍☠️ {draft.equippedTitle}
              </span>
            </div>
            <button
              onClick={handleRandomize}
              className="mt-3 btn-tactile-sm bg-amber-200 dark:bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5"
            >
              <Shuffle className="w-3.5 h-3.5" /> Randomize Outfit
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-1.5 border-b-4 border-slate-800 dark:border-indigo-500/40 pb-2 overflow-x-auto">
            {(['title', 'head', 'face', 'hair', 'outfit', 'footwear', 'back'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  sounds.playPop();
                  setActiveTab(tab);
                }}
                className={`px-3 py-1.5 text-xs font-bold capitalize rounded-xl transition-all border-2 border-slate-800 dark:border-slate-700 flex-shrink-0 ${
                  activeTab === tab
                    ? 'bg-amber-300 dark:bg-indigo-600 text-slate-900 dark:text-white shadow-chunky-sm translate-y-[-2px]'
                    : 'bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {tab === 'title' && '👑 Title'}
                {tab === 'head' && '👒 Head'}
                {tab === 'face' && '👁️ Face'}
                {tab === 'hair' && '💇 Hair'}
                {tab === 'outfit' && '👕 Outfit'}
                {tab === 'footwear' && '🩴 Shoes'}
                {tab === 'back' && '⚔️ Back Gear'}
              </button>
            ))}
          </div>

          {/* Tab Options */}
          <div className="space-y-4">
            {/* TITLE TAB */}
            {activeTab === 'title' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide mb-2 flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5 text-amber-500" /> Equip Guild Title
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {AVAILABLE_TITLES.map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        sounds.playPop();
                        setDraft({ ...draft, equippedTitle: t });
                      }}
                      className={`p-2.5 rounded-xl text-xs font-bold border-2 border-slate-800 transition-all ${
                        draft.equippedTitle === t
                          ? 'bg-amber-300 dark:bg-indigo-600 text-slate-900 dark:text-white shadow-chunky-sm'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      🏴‍☠️ {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* HEAD TAB */}
            {activeTab === 'head' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide mb-2">
                  Head Items & Pirate Hats
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {HEAD_ITEMS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        sounds.playPop();
                        setDraft({ ...draft, headItem: opt.value });
                      }}
                      className={`p-2.5 rounded-xl text-xs font-bold border-2 border-slate-800 transition-all ${
                        draft.headItem === opt.value
                          ? 'bg-indigo-500 text-white shadow-chunky-sm'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* FACE TAB */}
            {activeTab === 'face' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide mb-2">
                  Facial Eyewear & Scars
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {FACE_ITEMS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        sounds.playPop();
                        setDraft({ ...draft, faceItem: opt.value });
                      }}
                      className={`p-2.5 rounded-xl text-xs font-bold border-2 border-slate-800 transition-all ${
                        draft.faceItem === opt.value
                          ? 'bg-emerald-400 text-slate-900 shadow-chunky-sm'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* HAIR TAB */}
            {activeTab === 'hair' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide mb-2">
                    Hairstyle
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {HAIR_STYLES.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          sounds.playPop();
                          setDraft({ ...draft, hairStyle: opt.value });
                        }}
                        className={`p-2 rounded-xl text-xs font-bold border-2 border-slate-800 transition-all ${
                          draft.hairStyle === opt.value
                            ? 'bg-indigo-500 text-white shadow-chunky-sm'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide mb-2">
                    Hair Color Palette
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {COLOR_PALETTE.map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          sounds.playPop();
                          setDraft({ ...draft, hairColor: c });
                        }}
                        className="w-8 h-8 rounded-full border-2 border-slate-800 shadow-chunky-sm hover:scale-110 transition-transform"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* OUTFIT TAB */}
            {activeTab === 'outfit' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide mb-2">
                    Torso Outfit
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {OUTFIT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          sounds.playPop();
                          setDraft({ ...draft, outfit: opt.value });
                        }}
                        className={`p-2.5 rounded-xl text-xs font-bold border-2 border-slate-800 transition-all ${
                          draft.outfit === opt.value
                            ? 'bg-indigo-500 text-white shadow-chunky-sm'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide mb-2">
                    Top Color
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {COLOR_PALETTE.map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          sounds.playPop();
                          setDraft({ ...draft, topColor: c });
                        }}
                        className="w-8 h-8 rounded-full border-2 border-slate-800 shadow-chunky-sm hover:scale-110 transition-transform"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* FOOTWEAR TAB */}
            {activeTab === 'footwear' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide mb-2">
                  Footwear & Sandals
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {FOOTWEAR_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        sounds.playPop();
                        setDraft({ ...draft, footwear: opt.value });
                      }}
                      className={`p-2.5 rounded-xl text-xs font-bold border-2 border-slate-800 transition-all ${
                        draft.footwear === opt.value
                          ? 'bg-rose-400 text-slate-900 shadow-chunky-sm'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* BACK TAB */}
            {activeTab === 'back' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide mb-2">
                  Back Equipment & Katanas
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {BACK_ITEMS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        sounds.playPop();
                        setDraft({ ...draft, backItem: opt.value });
                      }}
                      className={`p-3 rounded-xl text-xs font-bold border-2 border-slate-800 flex items-center gap-2 transition-all ${
                        draft.backItem === opt.value
                          ? 'bg-emerald-300 text-slate-900 shadow-chunky-sm'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-amber-100 dark:bg-slate-800 border-t-4 border-slate-800 dark:border-indigo-500/40 flex items-center justify-between">
          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="btn-tactile bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 text-sm font-bold"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn-tactile bg-emerald-400 hover:bg-emerald-500 text-slate-900 font-bold px-6 py-2 text-sm flex items-center gap-2"
          >
            <Check className="w-4 h-4" /> Save Pirate Avatar
          </button>
        </div>
      </div>
    </div>
  );
};
