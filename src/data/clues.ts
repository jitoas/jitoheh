import { Card } from '../types';

export interface ClueFolder {
  id: number;
  name: string;
  category: string;
  options: [string, string, string, string, string, string]; // 3 left, 3 right
}

export const INVESTIGATION_FOLDERS: ClueFolder[] = [
  {
    id: 0,
    name: 'موقع الجريمة',
    category: 'الموقع',
    options: ['داخلي', 'خارجي', 'منزل', 'مستشفى', 'مدرسة', 'موقع بناء'],
  },
  {
    id: 1,
    name: 'سبب الوفاة',
    category: 'السبب',
    options: ['تسمم', 'خنق', 'طعن', 'إطلاق نار', 'صدمة قوة حادة', 'حرق'],
  },
  {
    id: 2,
    name: 'العنصر الرئيسي',
    category: 'المادة',
    options: ['معدن', 'زجاج', 'خشب', 'كيميائي', 'سائل', 'ألياف'],
  },
  {
    id: 3,
    name: 'مواصفات الأداة',
    category: 'الخاصية',
    options: ['ثقيل', 'حاد', 'قابل للكسر', 'صامت', 'مرن', 'خفيف'],
  },
  {
    id: 4,
    name: 'الصلة الاجتماعية',
    category: 'العلاقة',
    options: ['صديق', 'عائلة', 'زميل عمل', 'جار', 'غريب', 'شريك'],
  },
  {
    id: 5,
    name: 'أثر جنائي',
    category: 'الأثر',
    options: ['بصمة', 'غبار / تربة', 'ماء', 'حيوان', 'نبات', 'مسحوق'],
  },
];

const TAG_MAP: Record<string, string[]> = {
  // Folder 0: Location
  'داخلي': ['house', 'hospital', 'school', 'kitchen', 'office'],
  'خارجي': ['outdoor', 'construction', 'crime_scene'],
  'منزل': ['house', 'kitchen'],
  'مستشفى': ['hospital', 'medicine'],
  'مدرسة': ['school', 'office'],
  'موقع بناء': ['construction'],

  // Folder 1: Cause of Death
  'تسمم': ['poison', 'chemical', 'medicine'],
  'خنق': ['strangulation', 'silent'],
  'طعن': ['sharp', 'bleeding'],
  'إطلاق نار': ['gunshot', 'noise'],
  'صدمة قوة حادة': ['blunt', 'heavy'],
  'حرق': ['burn', 'fire', 'heat'],

  // Folder 2: Material
  'معدن': ['metal', 'silver', 'gold'],
  'زجاج': ['glass', 'fragile'],
  'خشب': ['wood'],
  'كيميائي': ['chemical'],
  'سائل': ['liquid'],
  'ألياف': ['fiber', 'leather'],

  // Folder 3: Characteristic
  'ثقيل': ['heavy'],
  'حاد': ['sharp'],
  'قابل للكسر': ['fragile', 'glass'],
  'صامت': ['silent'],
  'مرن': ['flexible', 'fiber'],
  'خفيف': ['small', 'paper'],

  // Folder 4: Social Relationship
  'صديق': ['personal_item', 'friend'],
  'عائلة': ['house', 'family', 'personal_item'],
  'زميل عمل': ['office', 'hospital', 'school', 'coworker'],
  'جار': ['house', 'neighbor'],
  'غريب': ['outdoor', 'stranger', 'darkness'],
  'شريك': ['personal_item', 'gold', 'partner'],

  // Folder 5: Forensic Trace
  'بصمة': ['fingerprint', 'crime_scene'],
  'غبار / تربة': ['soil', 'dust', 'construction'],
  'ماء': ['water', 'liquid'],
  'حيوان': ['animal'],
  'نبات': ['plant'],
  'مسحوق': ['powder', 'chemical'],
};

// Helper to evaluate how many cards in play match a given clue option
export function getClueMatchesCount(clueTagOrName: string, cardsInPlay: Card[]): number {
  const clueNorm = clueTagOrName.trim();
  const targetTags = TAG_MAP[clueNorm] || [clueNorm.toLowerCase()];

  return cardsInPlay.filter((card) => {
    return card.tags.some((tag) => {
      const tagNorm = tag.toLowerCase().trim();
      return targetTags.some((t) => tagNorm.includes(t) || t.includes(tagNorm));
    });
  }).length;
}

// Helper to get duration for a specific slot/folder timer
export function getSlotTimerDuration(
  settings: { clueReleaseSpeed?: string; customClueTimeSeconds?: number; slotTimers?: Record<number, number> },
  folderIndex: number
): number {
  if (folderIndex === 0 || folderIndex === 1) return 0; // Slots 1 & 2 are always unlocked

  if (settings.slotTimers && settings.slotTimers[folderIndex] !== undefined) {
    return settings.slotTimers[folderIndex];
  }

  if (settings.clueReleaseSpeed === 'fast') {
    const defaults: Record<number, number> = { 2: 15, 3: 30, 4: 45, 5: 60 };
    return defaults[folderIndex] ?? 30;
  }
  if (settings.clueReleaseSpeed === 'slow') {
    const defaults: Record<number, number> = { 2: 60, 3: 120, 4: 180, 5: 240 };
    return defaults[folderIndex] ?? 120;
  }
  if (settings.clueReleaseSpeed === 'custom' && settings.customClueTimeSeconds) {
    const multiplier = folderIndex - 1;
    return settings.customClueTimeSeconds * multiplier;
  }

  const normalDefaults: Record<number, number> = { 2: 30, 3: 60, 4: 90, 5: 120 };
  return normalDefaults[folderIndex] ?? 30;
}

