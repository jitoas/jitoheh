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
    name: 'سبب الإصابة',
    category: 'السبب',
    options: ['نزيف', 'خنق', 'حرق', 'أداة حادة', 'سم', 'صعق كهربائي'],
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
    options: ['ثقيل', 'حاد', 'قابل للكسر', 'دواء', 'ذهب', 'صامت'],
  },
  {
    id: 4,
    name: 'الصلة الاجتماعية',
    category: 'العلاقة',
    options: ['غرض شخصي', 'نص / رسالة', 'مال', 'ملابس', 'طعام', 'مركبة'],
  },
  {
    id: 5,
    name: 'أثر جنائي',
    category: 'الأثر',
    options: ['بصمة', 'غبار / تربة', 'ماء', 'حيوان', 'نبات', 'مسحوق'],
  },
];

// Helper to evaluate how many cards in play match a given clue option
export function getClueMatchesCount(clueTagOrName: string, cardsInPlay: Card[]): number {
  const normalized = clueTagOrName.toLowerCase().trim();
  return cardsInPlay.filter((card) => {
    return card.tags.some((tag) => {
      const tagNorm = tag.toLowerCase().trim();
      return tagNorm.includes(normalized) || normalized.includes(tagNorm) || tagNorm === normalized;
    });
  }).length;
}

