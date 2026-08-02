import { RandomEvent } from '../types';

export const RANDOM_EVENT_TEMPLATES = [
  {
    id: 'ev_extra_clue',
    title: 'اكتشاف جنائي جديد',
    description: 'عثر المحققون على دليل إضافي في مسرح الجريمة!',
  },
  {
    id: 'ev_replace_clue',
    title: 'إعادة تحليل الأدلة',
    description: 'قام الطبيب الشرعي بتحديث أحد مجلدات أدلة مسرح الجريمة.',
  },
  {
    id: 'ev_remove_card',
    title: 'تلوث الأدلة الجنائية',
    description: 'تسبب تلوث المختبر في استبعاد عنصر عشوائي واحد من مخزون كل محقق.',
  },
  {
    id: 'ev_restore_votes',
    title: 'استعادة حق التصويت',
    description: 'ظهرت أدلة جديدة! يحصل جميع اللاعبين الذين صوتوا على محاولة تصويت إضافية.',
  },
  {
    id: 'ev_witness_whisper',
    title: 'بلاغ من مخبر مجهول',
    description: 'مخبر مجهول يترك تلميحاً غامضاً يتردد صداه عبر لوحة التحقيق الجنائي.',
  },
];

export function getRandomEvent(): RandomEvent {
  const index = Math.floor(Math.random() * RANDOM_EVENT_TEMPLATES.length);
  const template = RANDOM_EVENT_TEMPLATES[index];
  return {
    ...template,
    timestamp: Date.now(),
  };
}
