import React, { useState } from 'react';
import { AvatarState } from '../types/todo';
import { AvatarRenderer } from './AvatarRenderer';
import { AVAILABLE_TITLES } from '../utils/gameEngine';
import { X, Sparkles, Check, Shuffle, Crown, User } from 'lucide-react';
import { sounds } from '../utils/audio';

interface AvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  avatar: AvatarState;
  onSaveAvatar: (newAvatar: AvatarState) => void;
}

const SKIN_OPTIONS = [
  { label: 'Porcelain', value: '#FFDBAC' },
  { label: 'Warm Sand', value: '#F1C27D' },
  { label: 'Golden Tan', value: '#E0AC69' },
  { label: 'Deep Caramel', value: '#8D5524' },
  { label: 'Soft Peach', value: '#FFE0BD' },
  { label: 'Rich Espresso', value: '#523315' },
];

const HAIR_STYLE_OPTIONS = [
  { label: 'Short Crop', value: 'short' },
  { label: 'Long Waves', value: 'long' },
  { label: 'Spiky', value: 'spiky' },
  { label: 'Top Bun', value: 'bun' },
  { label: 'Wavy Flow', value: 'wavy' },
  { label: 'Cute Bob', value: 'bob' },
];

const HAIR_COLOR_OPTIONS = [
  { label: 'Dark Chocolate', value: '#4A3728' },
  { label: 'Golden Blonde', value: '#E6C280' },
  { label: 'Auburn Red', value: '#D63031' },
  { label: 'Turquoise Cyan', value: '#00CEC9' },
  { label: 'Pastel Lavender', value: '#A29BFE' },
  { label: 'Midnight Black', value: '#2D3436' },
];

const OUTFIT_COLOR_OPTIONS = [
  { label: 'Royal Purple', value: '#6C5CE7' },
  { label: 'Coral Pink', value: '#FF7675' },
  { label: 'Mint Teal', value: '#55E6C1' },
  { label: 'Sunflower Yellow', value: '#FDCB6E' },
  { label: 'Sky Blue', value: '#74B9FF' },
  { label: 'Matcha Green', value: '#81ECEC' },
];

const ACCESSORY_OPTIONS = [
  { label: 'None', value: 'none', icon: '❌' },
  { label: 'Glasses', value: 'glasses', icon: '👓' },
  { label: 'Straw Hat', value: 'hat', icon: '👒' },
  { label: 'Flower', value: 'flower', icon: '🌸' },
  { label: 'Cat Ears', value: 'catEars', icon: '🐱' },
];

export const AvatarModal: React.FC<AvatarModalProps> = ({
  isOpen,
  onClose,
  avatar,
  onSaveAvatar,
}) => {
  const [draft, setDraft] = useState<AvatarState>(avatar);
  const [activeTab, setActiveTab] = useState<'title' | 'hair' | 'skin' | 'outfit' | 'accessory'>('title');

  if (!isOpen) return null;

  const handleRandomize = () => {
    sounds.playPop();
    const randomSkin = SKIN_OPTIONS[Math.floor(Math.random() * SKIN_OPTIONS.length)].value;
    const randomStyle = HAIR_STYLE_OPTIONS[Math.floor(Math.random() * HAIR_STYLE_OPTIONS.length)].value;
    const randomHairColor = HAIR_COLOR_OPTIONS[Math.floor(Math.random() * HAIR_COLOR_OPTIONS.length)].value;
    const randomOutfit = OUTFIT_COLOR_OPTIONS[Math.floor(Math.random() * OUTFIT_COLOR_OPTIONS.length)].value;
    const randomAccessory = ACCESSORY_OPTIONS[Math.floor(Math.random() * ACCESSORY_OPTIONS.length)].value;

    setDraft((prev) => ({
      ...prev,
      skinColor: randomSkin,
      hairStyle: randomStyle,
      hairColor: randomHairColor,
      outfitColor: randomOutfit,
      accessory: randomAccessory,
    }));
  };

  const handleSave = () => {
    sounds.playPop();
    onSaveAvatar(draft);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-pop-in">
      <div className="card-cozy w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-amber-100 border-b-4 border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-500 fill-amber-300" />
            <h2 className="text-xl font-bold text-slate-800">Avatar Studio & Profile</h2>
          </div>
          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-amber-200 text-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Container */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-[#FAF6EE]">
          {/* Avatar Preview Card */}
          <div className="flex flex-col items-center justify-center p-6 bg-white border-4 border-slate-800 rounded-2xl shadow-chunky relative">
            <AvatarRenderer avatar={draft} size={130} animate={true} />
            <div className="mt-2 text-center">
              <h3 className="text-base font-black text-slate-900">{draft.userName}</h3>
              <span className="bg-amber-300 text-slate-900 border border-slate-800 text-xs font-extrabold px-2.5 py-0.5 rounded-lg inline-block mt-0.5">
                👑 {draft.equippedTitle}
              </span>
            </div>
            <button
              onClick={handleRandomize}
              className="mt-3 btn-tactile-sm bg-amber-200 px-3 py-1.5 text-xs font-bold text-slate-800 flex items-center gap-1.5"
            >
              <Shuffle className="w-3.5 h-3.5" /> Randomize Appearance
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-1.5 border-b-4 border-slate-800 pb-2 overflow-x-auto">
            {(['title', 'hair', 'skin', 'outfit', 'accessory'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  sounds.playPop();
                  setActiveTab(tab);
                }}
                className={`px-3 py-1.5 text-xs font-bold capitalize rounded-xl transition-all border-2 border-slate-800 ${
                  activeTab === tab
                    ? 'bg-amber-300 shadow-chunky-sm translate-y-[-2px]'
                    : 'bg-white hover:bg-amber-50 text-slate-600'
                }`}
              >
                {tab === 'title' && '👑 Profile & Title'}
                {tab === 'hair' && '💇 Hair'}
                {tab === 'skin' && '🎨 Skin'}
                {tab === 'outfit' && '👕 Clothes'}
                {tab === 'accessory' && '✨ Extra'}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-4">
            {/* TITLE & PROFILE TAB */}
            {activeTab === 'title' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-indigo-500" /> Adventurer Name
                  </label>
                  <input
                    type="text"
                    value={draft.userName}
                    onChange={(e) => setDraft({ ...draft, userName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border-3 border-slate-800 bg-white font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-amber-200"
                    maxLength={30}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5 text-amber-500" /> Equip RPG Title
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {AVAILABLE_TITLES.map((title) => (
                      <button
                        key={title}
                        onClick={() => {
                          sounds.playPop();
                          setDraft({ ...draft, equippedTitle: title });
                        }}
                        className={`p-2.5 rounded-xl text-xs font-bold border-2 border-slate-800 transition-all ${
                          draft.equippedTitle === title
                            ? 'bg-amber-300 text-slate-900 shadow-chunky-sm'
                            : 'bg-white hover:bg-amber-50 text-slate-700'
                        }`}
                      >
                        👑 {title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* HAIR TAB */}
            {activeTab === 'hair' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">
                    Hair Style
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {HAIR_STYLE_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          sounds.playPop();
                          setDraft({ ...draft, hairStyle: opt.value });
                        }}
                        className={`p-2 rounded-xl text-xs font-bold border-2 border-slate-800 transition-all ${
                          draft.hairStyle === opt.value
                            ? 'bg-indigo-400 text-white shadow-chunky-sm'
                            : 'bg-white hover:bg-indigo-50 text-slate-700'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">
                    Hair Color
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {HAIR_COLOR_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          sounds.playPop();
                          setDraft({ ...draft, hairColor: opt.value });
                        }}
                        className={`w-9 h-9 rounded-full border-3 border-slate-800 flex items-center justify-center transition-transform ${
                          draft.hairColor === opt.value ? 'scale-110 ring-4 ring-indigo-300' : 'hover:scale-105'
                        }`}
                        style={{ backgroundColor: opt.value }}
                        title={opt.label}
                      >
                        {draft.hairColor === opt.value && (
                          <Check className="w-5 h-5 text-white drop-shadow-md" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SKIN TAB */}
            {activeTab === 'skin' && (
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">
                  Skin Tone
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {SKIN_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        sounds.playPop();
                        setDraft({ ...draft, skinColor: opt.value });
                      }}
                      className={`p-2.5 rounded-xl text-xs font-bold border-2 border-slate-800 flex items-center gap-2 transition-all ${
                        draft.skinColor === opt.value
                          ? 'bg-amber-200 shadow-chunky-sm'
                          : 'bg-white hover:bg-amber-50'
                      }`}
                    >
                      <span
                        className="w-6 h-6 rounded-full border-2 border-slate-800"
                        style={{ backgroundColor: opt.value }}
                      />
                      <span className="text-slate-800">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* OUTFIT TAB */}
            {activeTab === 'outfit' && (
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">
                  Outfit Color
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {OUTFIT_COLOR_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        sounds.playPop();
                        setDraft({ ...draft, outfitColor: opt.value });
                      }}
                      className={`p-2.5 rounded-xl text-xs font-bold border-2 border-slate-800 flex items-center gap-2 transition-all ${
                        draft.outfitColor === opt.value
                          ? 'bg-slate-800 text-white shadow-chunky-sm'
                          : 'bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span
                        className="w-5 h-5 rounded-full border border-slate-800"
                        style={{ backgroundColor: opt.value }}
                      />
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ACCESSORY TAB */}
            {activeTab === 'accessory' && (
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">
                  Head Accessories
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {ACCESSORY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        sounds.playPop();
                        setDraft({ ...draft, accessory: opt.value });
                      }}
                      className={`p-3 rounded-xl text-xs font-bold border-2 border-slate-800 flex items-center gap-2 transition-all ${
                        draft.accessory === opt.value
                          ? 'bg-emerald-300 text-slate-900 shadow-chunky-sm'
                          : 'bg-white hover:bg-emerald-50 text-slate-700'
                      }`}
                    >
                      <span className="text-lg">{opt.icon}</span>
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-amber-100 border-t-4 border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="btn-tactile bg-white hover:bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn-tactile bg-emerald-400 hover:bg-emerald-500 px-6 py-2 text-sm font-bold text-slate-900 flex items-center gap-2"
          >
            <Check className="w-4 h-4" /> Save Profile & Title
          </button>
        </div>
      </div>
    </div>
  );
};
