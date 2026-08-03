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
    if (nameLower.includes('سيانيد') || nameLower.includes('سم') || nameLower.includes('زرنيخ') || nameLower.includes('ريسين') || nameLower.includes('استركنين') || tags.includes('poison')) {
      return WEAPON_IMAGES.poison;
    }
    if (nameLower.includes('حقنة') || tags.includes('syringe')) {
      return WEAPON_IMAGES.syringe;
    }
    if (nameLower.includes('مشرط') || nameLower.includes('سكين') || nameLower.includes('ساطور') || nameLower.includes('شفرة') || nameLower.includes('خنجر') || nameLower.includes('مقص') || tags.includes('sharp')) {
      return WEAPON_IMAGES.knife;
    }
    if (nameLower.includes('مسدس') || nameLower.includes('رصاص') || nameLower.includes('قوس') || tags.includes('gunshot')) {
      return WEAPON_IMAGES.revolver;
    }
    if (nameLower.includes('فأس') || nameLower.includes('بلطة') || nameLower.includes('منشار')) {
      return WEAPON_IMAGES.axe;
    }
    if (nameLower.includes('مطرقة') || nameLower.includes('عتلة') || nameLower.includes('أنبوب') || nameLower.includes('مضرب') || nameLower.includes('قبضة')) {
      return WEAPON_IMAGES.crowbar;
    }
    if (nameLower.includes('سلك') || nameLower.includes('حبل') || nameLower.includes('خيط') || nameLower.includes('حزام') || tags.includes('strangulation')) {
      return WEAPON_IMAGES.rope;
    }
    if (nameLower.includes('زجاج') || nameLower.includes('إبريق') || tags.includes('glass')) {
      return WEAPON_IMAGES.glass;
    }
    if (nameLower.includes('حرق') || nameLower.includes('لهب') || nameLower.includes('شعلة') || tags.includes('fire')) {
      return WEAPON_IMAGES.fire;
    }
    return WEAPON_IMAGES.default;
  } else {
    if (nameLower.includes('بصمة') || tags.includes('fingerprint')) {
      return EVIDENCE_IMAGES.fingerprint;
    }
    if (nameLower.includes('دم') || nameLower.includes('عينة') || tags.includes('bleeding')) {
      return EVIDENCE_IMAGES.blood;
    }
    if (nameLower.includes('أثر') || nameLower.includes('كعب') || nameLower.includes('قدم') || nameLower.includes('طين') || tags.includes('soil')) {
      return EVIDENCE_IMAGES.footprint;
    }
    if (nameLower.includes('ساعة') || tags.includes('time_of_death')) {
      return EVIDENCE_IMAGES.watch;
    }
    if (nameLower.includes('خاتم') || nameLower.includes('زر') || nameLower.includes('عملة') || nameLower.includes('ولاعة') || tags.includes('gold')) {
      return EVIDENCE_IMAGES.ring;
    }
    if (nameLower.includes('محفظة') || nameLower.includes('إيصال') || tags.includes('money')) {
      return EVIDENCE_IMAGES.wallet;
    }
    if (nameLower.includes('مفتاح') || tags.includes('key')) {
      return EVIDENCE_IMAGES.key;
    }
    if (nameLower.includes('قفاز') || nameLower.includes('شريط') || nameLower.includes('قماش') || tags.includes('fiber')) {
      return EVIDENCE_IMAGES.glove;
    }
    if (nameLower.includes('رسالة') || nameLower.includes('صورة') || nameLower.includes('دفتر') || nameLower.includes('جريدة') || tags.includes('paper')) {
      return EVIDENCE_IMAGES.paper;
    }
    if (nameLower.includes('دواء') || nameLower.includes('عبوة') || nameLower.includes('قطارة') || tags.includes('medicine')) {
      return EVIDENCE_IMAGES.medicine;
    }
    return EVIDENCE_IMAGES.default;
  }
}
