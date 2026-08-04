import { Card, ClueFolder } from '../types';

export type { ClueFolder };

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Fixed Cause of Death pool (Always present, 6 options picked randomly out of 15 per match)
export const CAUSE_OF_DEATH_OPTIONS: string[] = [
  'صدمة حادة (Severe Trauma)',
  'خنق (Strangulation)',
  'تسمم (Poisoning)',
  'نزيف حاد (Heavy Blood Loss)',
  'طعن (Stabbing)',
  'إصابة بطلق ناري (Gunshot Wound)',
  'حرق (Burning)',
  'صعق كهربائي (Electrocution)',
  'غرق (Drowning)',
  'اختناق (Suffocation)',
  'كسر في الجمجمة (Skull Fracture)',
  'نزيف داخلي (Internal Bleeding)',
  'حادث مركبة (Vehicle Accident)',
  'سقوط من ارتفاع (Fall From Height)',
  'إصابة دهس أو سحق (Crushing Injury)',
];

// Pool of other clue categories that are randomized between matches
export const OTHER_CATEGORY_POOL: Array<{ name: string; category: string; options: [string, string, string, string, string, string] }> = [
  {
    name: 'موقع الجريمة',
    category: 'الموقع',
    options: ['داخلي', 'خارجي', 'منزل', 'مستشفى', 'مدرسة', 'موقع بناء'],
  },
  {
    name: 'العنصر الرئيسي',
    category: 'المادة',
    options: ['معدن', 'زجاج', 'خشب', 'كيميائي', 'سائل', 'ألياف'],
  },
  {
    name: 'مواصفات الأداة',
    category: 'الخاصية',
    options: ['ثقيل', 'حاد', 'قابل للكسر', 'صامت', 'مرن', 'خفيف'],
  },
  {
    name: 'الصلة الاجتماعية',
    category: 'العلاقة',
    options: ['صديق', 'عائلة', 'زميل عمل', 'جار', 'غريب', 'شريك'],
  },
  {
    name: 'أثر جنائي',
    category: 'الأثر',
    options: ['بصمة', 'غبار / تربة', 'ماء', 'حيوان', 'نبات', 'مسحوق'],
  },
  {
    name: 'حالة الجثة',
    category: 'الحالة',
    options: ['متيبسة', 'باردة', 'مكبلة', 'ملطخة بالدماء', 'مسمومة', 'محترقة'],
  },
  {
    name: 'دافع الجريمة',
    category: 'الدافع',
    options: ['انتقام', 'طمع / مال', 'غيرة', 'تغطية سر', 'خلاف شخصي', 'حقد'],
  },
  {
    name: 'حالة الطقس',
    category: 'الطقس',
    options: ['مطر غزير', 'ضباب كثيف', 'عاصفة', 'حر شديد', 'برد قارص', 'سماء صافية'],
  },
  {
    name: 'توقيت الجريمة',
    category: 'التوقيت',
    options: ['منتصف الليل', 'الفجر', 'الظهيرة', 'المساء', 'وقت متأخر', 'الصباح الباكر'],
  },
  {
    name: 'مكان اكتشاف الدليل',
    category: 'مكان الاكتشاف',
    options: ['غرفة النوم', 'الحديقة', 'تحت السرير', 'في السيارة', 'المكتب', 'قرب النافذة'],
  },
];

export function generateClueFolders(): ClueFolder[] {
  // 1. Cause of Death folder (Permanently fixed category title, 6 random options out of 8 per match)
  const shuffledCauses = shuffle([...CAUSE_OF_DEATH_OPTIONS]).slice(0, 6) as [string, string, string, string, string, string];
  const causeOfDeathFolder: ClueFolder = {
    id: 1,
    name: 'Cause of Death',
    category: 'Cause of Death',
    options: shuffledCauses,
  };

  // 2. Select 5 random categories from OTHER_CATEGORY_POOL for slots 0, 2, 3, 4, 5
  const shuffledPool = shuffle([...OTHER_CATEGORY_POOL]);
  const chosen = shuffledPool.slice(0, 5);

  return [
    { ...chosen[0], id: 0 },
    causeOfDeathFolder,
    { ...chosen[1], id: 2 },
    { ...chosen[2], id: 3 },
    { ...chosen[3], id: 4 },
    { ...chosen[4], id: 5 },
  ];
}

export const INVESTIGATION_FOLDERS: ClueFolder[] = generateClueFolders();

const TAG_MAP: Record<string, string[]> = {
  // Folder 1: Cause of Death (Always present - 15 generic medical causes)
  'صدمة حادة (Severe Trauma)': ['blunt', 'heavy'],
  'صدمة قوة حادة (Blunt Force Trauma)': ['blunt', 'heavy'],
  'صدمة حادة': ['blunt', 'heavy'],
  'صدمة قوة حادة': ['blunt', 'heavy'],
  'Severe Trauma': ['blunt', 'heavy'],
  'Blunt Force Trauma': ['blunt', 'heavy'],

  'خنق (Strangulation)': ['strangulation', 'silent', 'fiber'],
  'خنق': ['strangulation', 'silent', 'fiber'],
  'Strangulation': ['strangulation', 'silent', 'fiber'],

  'تسمم (Poisoning)': ['poison', 'chemical', 'medicine'],
  'تسمم': ['poison', 'chemical', 'medicine'],
  'Poisoning': ['poison', 'chemical', 'medicine'],

  'نزيف حاد (Heavy Blood Loss)': ['bleeding', 'sharp'],
  'نزيف حاد': ['bleeding', 'sharp'],
  'Heavy Blood Loss': ['bleeding', 'sharp'],

  'طعن (Stabbing)': ['sharp', 'bleeding'],
  'طعن': ['sharp', 'bleeding'],
  'Stabbing': ['sharp', 'bleeding'],

  'إصابة بطلق ناري (Gunshot Wound)': ['gunshot', 'noise', 'metal'],
  'إطلاق نار (Gunshot)': ['gunshot', 'noise', 'metal'],
  'إطلاق نار': ['gunshot', 'noise', 'metal'],
  'إصابة بطلق ناري': ['gunshot', 'noise', 'metal'],
  'Gunshot Wound': ['gunshot', 'noise', 'metal'],
  'Gunshot': ['gunshot', 'noise', 'metal'],

  'حرق (Burning)': ['burn', 'fire', 'heat'],
  'حرق': ['burn', 'fire', 'heat'],
  'Burning': ['burn', 'fire', 'heat'],

  'صعق كهربائي (Electrocution)': ['electric', 'electrocution', 'heat'],
  'صعق كهربائي': ['electric', 'electrocution', 'heat'],
  'Electrocution': ['electric', 'electrocution', 'heat'],

  'غرق (Drowning)': ['drowning', 'water', 'liquid'],
  'غرق': ['drowning', 'water', 'liquid'],
  'Drowning': ['drowning', 'water', 'liquid'],

  'اختناق (Suffocation)': ['strangulation', 'silent', 'gas', 'plastic'],
  'اختناق': ['strangulation', 'silent', 'gas', 'plastic'],
  'Suffocation': ['strangulation', 'silent', 'gas', 'plastic'],

  'كسر في الجمجمة (Skull Fracture)': ['heavy', 'blunt', 'stone'],
  'كسر في الجمجمة': ['heavy', 'blunt', 'stone'],
  'Skull Fracture': ['heavy', 'blunt', 'stone'],

  'نزيف داخلي (Internal Bleeding)': ['heavy', 'blunt'],
  'نزيف داخلي': ['heavy', 'blunt'],
  'Internal Bleeding': ['heavy', 'blunt'],

  'حادث مركبة (Vehicle Accident)': ['metal', 'heavy', 'construction'],
  'حادث مركبة': ['metal', 'heavy', 'construction'],
  'Vehicle Accident': ['metal', 'heavy', 'construction'],

  'سقوط من ارتفاع (Fall From Height)': ['heavy', 'outdoor', 'construction'],
  'سقوط من ارتفاع': ['heavy', 'outdoor', 'construction'],
  'Fall From Height': ['heavy', 'outdoor', 'construction'],

  'إصابة دهس أو سحق (Crushing Injury)': ['heavy', 'blunt', 'metal'],
  'إصابة دهس أو سحق': ['heavy', 'blunt', 'metal'],
  'Crushing Injury': ['heavy', 'blunt', 'metal'],

  // Location
  'داخلي': ['house', 'hospital', 'school', 'kitchen', 'office'],
  'خارجي': ['outdoor', 'construction', 'crime_scene'],
  'منزل': ['house', 'kitchen'],
  'مستشفى': ['hospital', 'medicine'],
  'مدرسة': ['school', 'office'],
  'موقع بناء': ['construction'],

  // Material
  'معدن': ['metal', 'silver', 'gold'],
  'زجاج': ['glass', 'fragile'],
  'خشب': ['wood'],
  'كيميائي': ['chemical'],
  'سائل': ['liquid'],
  'ألياف': ['fiber', 'leather'],

  // Characteristic
  'ثقيل': ['heavy'],
  'حاد': ['sharp'],
  'قابل للكسر': ['fragile', 'glass'],
  'صامت': ['silent'],
  'مرن': ['flexible', 'fiber'],
  'خفيف': ['small', 'paper'],

  // Social Relationship
  'صديق': ['personal_item', 'friend'],
  'عائلة': ['house', 'family', 'personal_item'],
  'زميل عمل': ['office', 'hospital', 'school', 'coworker'],
  'جار': ['house', 'neighbor'],
  'غريب': ['outdoor', 'stranger', 'darkness'],
  'شريك': ['personal_item', 'gold', 'partner'],

  // Forensic Trace
  'بصمة': ['fingerprint', 'crime_scene'],
  'غبار / تربة': ['soil', 'dust', 'construction'],
  'ماء': ['water', 'liquid'],
  'حيوان': ['animal'],
  'نبات': ['plant'],
  'مسحوق': ['powder', 'chemical'],

  // State of Body
  'متيبسة': ['heavy', 'silent'],
  'باردة': ['liquid', 'water'],
  'مكبلة': ['fiber', 'strangulation'],
  'ملطخة بالدماء': ['bleeding', 'sharp'],
  'مسمومة': ['poison', 'chemical'],
  'محترقة': ['burn', 'fire'],

  // Motive
  'انتقام': ['sharp', 'bleeding'],
  'طمع / مال': ['gold', 'personal_item'],
  'غيرة': ['personal_item', 'friend'],
  'تغطية سر': ['silent', 'darkness'],
  'خلاف شخصي': ['coworker', 'neighbor'],
  'حقد': ['poison', 'sharp'],

  // Weather Condition
  'مطر غزير': ['water', 'liquid', 'outdoor'],
  'ضباب كثيف': ['darkness', 'outdoor', 'silent'],
  'عاصفة': ['outdoor', 'noise'],
  'حر شديد': ['fire', 'heat', 'burn'],
  'برد قارص': ['cold', 'water'],
  'سماء صافية': ['outdoor'],

  // Time of Crime
  'منتصف الليل': ['darkness', 'night', 'silent'],
  'الفجر': ['outdoor', 'silent'],
  'الظهيرة': ['outdoor', 'noise'],
  'المساء': ['darkness', 'house'],
  'وقت متأخر': ['darkness', 'night'],
  'الصباح الباكر': ['outdoor'],

  // Discovery Location
  'غرفة النوم': ['house', 'personal_item'],
  'الحديقة': ['outdoor', 'plant'],
  'تحت السرير': ['house', 'dust'],
  'في السيارة': ['metal', 'construction'],
  'المكتب': ['office', 'school'],
  'قرب النافذة': ['glass', 'fragile'],
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

