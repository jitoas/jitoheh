import crimeWeaponArt from '../assets/images/crime_weapon_art_1785742988879.jpg';
import crimeEvidenceArt from '../assets/images/crime_evidence_art_1785743002100.jpg';
import crimePoisonArt from '../assets/images/crime_poison_art_1785743012153.jpg';
import crimeDossierArt from '../assets/images/crime_dossier_art_1785743022427.jpg';

import noirBladeArt from '../assets/images/noir_weapon_blade_1785747901749.jpg';
import noirGunArt from '../assets/images/noir_weapon_gun_1785747919508.jpg';
import noirBluntArt from '../assets/images/noir_weapon_blunt_1785747933608.jpg';
import noirStrangleArt from '../assets/images/noir_weapon_strangle_1785747944872.jpg';
import noirForensicsArt from '../assets/images/noir_evidence_forensics_1785747956838.jpg';
import noirPersonalArt from '../assets/images/noir_evidence_personal_1785747972603.jpg';
import noirDocumentsArt from '../assets/images/noir_evidence_documents_1785747986068.jpg';
import noirClothingArt from '../assets/images/noir_evidence_clothing_1785748009542.jpg';

export const AI_GENERATED_HERO_ART = {
  weapon: crimeWeaponArt,
  evidence: crimeEvidenceArt,
  poison: crimePoisonArt,
  dossier: crimeDossierArt,
};

// High resolution dark noir realistic crime scene evidence photography mapping
const WEAPON_IMAGES: Record<string, string> = {
  // Knives & Blades
  knife: noirBladeArt,
  blade: noirBladeArt,
  cleaver: noirBladeArt,
  axe: noirBladeArt,
  scissors: noirBladeArt,
  razor: noirBladeArt,
  
  // Firearms & Bullets
  gun: noirGunArt,
  revolver: noirGunArt,
  bullet: noirGunArt,

  // Poisons & Chemicals
  poison: crimePoisonArt,
  chemical: crimePoisonArt,
  syringe: crimePoisonArt,
  vial: crimePoisonArt,
  acid: crimePoisonArt,

  // Blunt & Impact Weapons
  hammer: noirBluntArt,
  crowbar: noirBluntArt,
  bat: noirBluntArt,
  pipe: noirBluntArt,
  candlestick: noirBluntArt,

  // Ropes & Wires
  rope: noirStrangleArt,
  wire: noirStrangleArt,

  // Fire & Electricity
  fire: noirBluntArt,
  electric: noirStrangleArt,

  // Glass
  glass: noirBladeArt,

  // Default fallback
  default: crimeWeaponArt,
};

const EVIDENCE_IMAGES: Record<string, string> = {
  // Forensics
  fingerprint: noirForensicsArt,
  blood: noirForensicsArt,
  footprint: crimeDossierArt,
  hair: noirForensicsArt,
  soil: noirForensicsArt,

  // Personal Items & Valuables
  watch: noirPersonalArt,
  ring: noirPersonalArt,
  wallet: noirPersonalArt,
  key: noirPersonalArt,
  glove: noirClothingArt,
  glasses: noirPersonalArt,
  coin: noirPersonalArt,

  // Documents & Notes
  paper: noirDocumentsArt,
  photo: noirDocumentsArt,
  receipt: noirDocumentsArt,

  // Medical & Bottles
  medicine: crimePoisonArt,
  cup: noirPersonalArt,

  // Default fallback
  default: crimeEvidenceArt,
};

export function getCardImageUrl(card: { id: string; name: string; category: string; tags: string[] }): string {
  const nameLower = card.name.toLowerCase();
  const tags = card.tags.map((t) => t.toLowerCase());

  if (card.category === 'weapon') {
    // 1. Poisons, Gases, Chemicals, & Potions
    if (
      nameLower.includes('سيانيد') ||
      nameLower.includes('سم') ||
      nameLower.includes('زرنيخ') ||
      nameLower.includes('ريسين') ||
      nameLower.includes('استركنين') ||
      nameLower.includes('كلوروفورم') ||
      nameLower.includes('حمض') ||
      nameLower.includes('غاز') ||
      nameLower.includes('ست الحسن') ||
      nameLower.includes('مذيب') ||
      nameLower.includes('كلور') ||
      nameLower.includes('نبيذ') ||
      nameLower.includes('أكسجين') ||
      nameLower.includes('نيتروجين') ||
      tags.includes('poison') ||
      tags.includes('chemical')
    ) {
      return WEAPON_IMAGES.poison;
    }

    // 2. Firearms, Explosives, Pyrotechnics, & Ranged Projectiles
    if (
      nameLower.includes('مسدس') ||
      nameLower.includes('رصاص') ||
      nameLower.includes('مدفع') ||
      nameLower.includes('مفجر') ||
      nameLower.includes('مولوتوف') ||
      nameLower.includes('إشارة') ||
      nameLower.includes('ليزر') ||
      nameLower.includes('صاعق') ||
      tags.includes('gunshot') ||
      tags.includes('electric')
    ) {
      return WEAPON_IMAGES.revolver;
    }

    // 3. Strangulation, Ropes, Cables, & Wires
    if (
      nameLower.includes('سلك') ||
      nameLower.includes('أسلاك') ||
      nameLower.includes('حبل') ||
      nameLower.includes('خيط') ||
      nameLower.includes('حزام') ||
      nameLower.includes('نايلون') ||
      nameLower.includes('جاروت') ||
      nameLower.includes('طوق') ||
      tags.includes('strangulation')
    ) {
      return WEAPON_IMAGES.rope;
    }

    // 4. Edged Weapons, Blades, Knives, & Sharp Metal
    if (
      nameLower.includes('مشرط') ||
      nameLower.includes('سكين') ||
      nameLower.includes('ساطور') ||
      nameLower.includes('شفرة') ||
      nameLower.includes('خنجر') ||
      nameLower.includes('ستاليتو') ||
      nameLower.includes('سيف') ||
      nameLower.includes('فأس') ||
      nameLower.includes('بلطة') ||
      nameLower.includes('منشار') ||
      nameLower.includes('مقص') ||
      nameLower.includes('سهم') ||
      nameLower.includes('قوس') ||
      nameLower.includes('حربة') ||
      nameLower.includes('رمح') ||
      nameLower.includes('توماهوك') ||
      nameLower.includes('أزميل') ||
      nameLower.includes('شورينا') ||
      nameLower.includes('خطاف') ||
      nameLower.includes('منجل') ||
      nameLower.includes('موس') ||
      nameLower.includes('مبرد') ||
      nameLower.includes('شائك') ||
      nameLower.includes('فخ') ||
      nameLower.includes('مسامير') ||
      nameLower.includes('كاشط') ||
      nameLower.includes('ملقط') ||
      nameLower.includes('قرن') ||
      nameLower.includes('إبرة') ||
      tags.includes('sharp')
    ) {
      return WEAPON_IMAGES.knife;
    }

    // 5. Blunt Instruments, Impact Tools, & Heavy Objects
    if (
      nameLower.includes('مطرقة') ||
      nameLower.includes('عتلة') ||
      nameLower.includes('أنبوب') ||
      nameLower.includes('مضرب') ||
      nameLower.includes('كباشة') ||
      nameLower.includes('شمعدان') ||
      nameLower.includes('مقلاة') ||
      nameLower.includes('كأس') ||
      nameLower.includes('قضيب') ||
      nameLower.includes('سندان') ||
      nameLower.includes('مجرفة') ||
      nameLower.includes('مهدامة') ||
      nameLower.includes('عكاز') ||
      nameLower.includes('حجر') ||
      nameLower.includes('سلسلة') ||
      nameLower.includes('إبريق') ||
      nameLower.includes('هاون') ||
      nameLower.includes('طفاية') ||
      nameLower.includes('أثقال') ||
      nameLower.includes('كسارة') ||
      nameLower.includes('قفل') ||
      nameLower.includes('رخام') ||
      nameLower.includes('مرجل') ||
      nameLower.includes('تمثال') ||
      nameLower.includes('مزولة') ||
      tags.includes('blunt') ||
      tags.includes('heavy')
    ) {
      return WEAPON_IMAGES.hammer;
    }

    // Default Fallback
    return WEAPON_IMAGES.default;
  } else {
    // EVIDENCE CATEGORY

    // 1. Forensics, Biological, & Crime Scene Traces
    if (
      nameLower.includes('بصمة') ||
      nameLower.includes('دم') ||
      nameLower.includes('أثر') ||
      nameLower.includes('شعر') ||
      nameLower.includes('طين') ||
      nameLower.includes('تربة') ||
      nameLower.includes('صلصال') ||
      nameLower.includes('كعب') ||
      nameLower.includes('طلاء') ||
      nameLower.includes('ريشة') ||
      tags.includes('fingerprint') ||
      tags.includes('bleeding') ||
      tags.includes('soil')
    ) {
      return EVIDENCE_IMAGES.fingerprint;
    }

    // 2. Medical Evidence, Vials, & Droppers
    if (
      nameLower.includes('دواء') ||
      nameLower.includes('قطارة') ||
      nameLower.includes('أمبولة') ||
      nameLower.includes('سدادة') ||
      nameLower.includes('حبوب') ||
      tags.includes('medicine')
    ) {
      return EVIDENCE_IMAGES.medicine;
    }

    // 3. Documents, Letters, Receipts, & Paper Items
    if (
      nameLower.includes('رسالة') ||
      nameLower.includes('صورة') ||
      nameLower.includes('دفتر') ||
      nameLower.includes('جريدة') ||
      nameLower.includes('إيصال') ||
      nameLower.includes('تذكرة') ||
      nameLower.includes('طابع') ||
      nameLower.includes('ختم') ||
      nameLower.includes('نشاف') ||
      nameLower.includes('غلاف') ||
      nameLower.includes('فاصل') ||
      nameLower.includes('كبريت') ||
      tags.includes('paper') ||
      tags.includes('text')
    ) {
      return EVIDENCE_IMAGES.paper;
    }

    // 4. Fabrics, Gloves, Accessories, & Wearing Apparel
    if (
      nameLower.includes('قفاز') ||
      nameLower.includes('شريط') ||
      nameLower.includes('صوف') ||
      nameLower.includes('كيس') ||
      nameLower.includes('بكرة') ||
      nameLower.includes('شمع') ||
      nameLower.includes('منديل') ||
      tags.includes('fiber') ||
      tags.includes('clothing')
    ) {
      return EVIDENCE_IMAGES.glove;
    }

    // 5. Personal Effects, Jewelry, Valuables, & Pocket Items
    if (
      nameLower.includes('ساعة') ||
      nameLower.includes('خاتم') ||
      nameLower.includes('مفتاح') ||
      nameLower.includes('عملة') ||
      nameLower.includes('نقود') ||
      nameLower.includes('محفظة') ||
      nameLower.includes('فنجان') ||
      nameLower.includes('ولاعة') ||
      nameLower.includes('شفاه') ||
      nameLower.includes('ملعقة') ||
      nameLower.includes('زر أكمام') ||
      nameLower.includes('حلقة') ||
      nameLower.includes('زر') ||
      nameLower.includes('عطر') ||
      nameLower.includes('مرآة') ||
      nameLower.includes('عدسة') ||
      nameLower.includes('كشتبان') ||
      nameLower.includes('سيجار') ||
      nameLower.includes('ريموت') ||
      tags.includes('personal_item') ||
      tags.includes('gold') ||
      tags.includes('time_of_death')
    ) {
      return EVIDENCE_IMAGES.watch;
    }

    return EVIDENCE_IMAGES.default;
  }
}
