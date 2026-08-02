import { PlayerProfile } from '../types';

const PROFILE_KEY = 'detective_clue_player_profile';

export function getSavedProfile(): PlayerProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.name && parsed.avatar) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to read saved profile:', err);
  }

  // Generate clean default avatar and name
  const randomNum = Math.floor(100 + Math.random() * 900);
  const defaultProfile: PlayerProfile = {
    id: `p_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: `المحقق #${randomNum}`,
    avatar: 'det_1',
  };
  saveProfile(defaultProfile);
  return defaultProfile;
}

export function saveProfile(profile: PlayerProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.warn('Failed to save profile locally:', err);
  }
}
