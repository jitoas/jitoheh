import React, { useState } from 'react';
import { PlayerProfile } from '../types';
import { DETECTIVE_AVATARS } from './CardArt';
import { User, Check, Camera } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: PlayerProfile;
  onSave: (profile: PlayerProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSave,
}) => {
  const [name, setName] = useState(currentProfile.name);
  const [avatar, setAvatar] = useState(currentProfile.avatar);
  const [customAvatarUrl, setCustomAvatarUrl] = useState<string | null>(
    avatar.startsWith('data:') || avatar.startsWith('http') ? avatar : null
  );

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setCustomAvatarUrl(result);
        setAvatar(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      ...currentProfile,
      name: name.trim(),
      avatar,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-bold text-zinc-100 tracking-wide uppercase">
              الملف الشخصي للمحقق
            </h3>
          </div>
        </div>

        {/* Display Name Input */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
            اسم المحقق
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-zinc-100 placeholder-zinc-600 focus:border-amber-500 focus:outline-none font-mono"
            placeholder="أدخل اسم المحقق الخاص بك..."
          />
        </div>

        {/* Avatar Selection */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
            صورة المحقق رمزية
          </label>

          <div className="grid grid-cols-4 gap-3 mb-4">
            {DETECTIVE_AVATARS.map((preset) => {
              const isSelected = avatar === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => setAvatar(preset.id)}
                  className={`relative flex flex-col items-center p-2 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/30'
                      : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-md ${preset.bg}`}
                    style={{ border: `2px solid ${preset.color}` }}
                  >
                    {preset.name.charAt(0)}
                  </div>
                  <span className="text-[10px] text-zinc-400 mt-1 truncate max-w-full font-mono">
                    {preset.name.split(' ')[0]}
                  </span>
                  {isSelected && (
                    <div className="absolute top-1 right-1 bg-amber-500 text-black rounded-full p-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Custom Avatar Upload */}
          <div className="flex items-center gap-3 border border-dashed border-zinc-800 rounded-xl p-3 bg-zinc-900/30">
            {customAvatarUrl ? (
              <img
                src={customAvatarUrl}
                alt="Custom Avatar"
                className="w-10 h-10 rounded-full object-cover border border-amber-500"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500">
                <Camera className="w-5 h-5" />
              </div>
            )}
            <div className="flex-1">
              <span className="text-xs text-zinc-300 font-medium block">
                رفع صورة شخصية مخصصة
              </span>
              <span className="text-[10px] text-zinc-500 block">
                صورة بصيغة PNG أو JPG أو WebP
              </span>
            </div>
            <label className="cursor-pointer bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs px-3 py-1.5 rounded-lg border border-zinc-700 font-semibold transition-colors">
              استعراض
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-amber-500 hover:bg-amber-400 text-zinc-950 transition-colors shadow-lg shadow-amber-500/20"
          >
            حفظ الملف الشخصي
          </button>
        </div>
      </div>
    </div>
  );
};
