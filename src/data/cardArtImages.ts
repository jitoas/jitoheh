import crimeWeaponArt from '../assets/images/crime_weapon_art_1785742988879.jpg';
import noirWeaponGun from '../assets/images/noir_weapon_gun_1785747919508.jpg';
import noirWeaponBlade from '../assets/images/noir_weapon_blade_1785747901749.jpg';
import noirWeaponBlunt from '../assets/images/noir_weapon_blunt_1785747933608.jpg';
import noirWeaponStrangle from '../assets/images/noir_weapon_strangle_1785747944872.jpg';
import noirWeaponFire from '../assets/images/noir_weapon_fire_1785837051469.jpg';
import crimePoisonArt from '../assets/images/crime_poison_art_1785743012153.jpg';

import crimeEvidenceArt from '../assets/images/crime_evidence_art_1785743002100.jpg';
import noirEvidenceForensics from '../assets/images/noir_evidence_forensics_1785747956838.jpg';
import noirEvidencePersonal from '../assets/images/noir_evidence_personal_1785747972603.jpg';
import noirEvidenceDocuments from '../assets/images/noir_evidence_documents_1785747986068.jpg';
import noirEvidenceClothing from '../assets/images/noir_evidence_clothing_1785748009542.jpg';
import noirEvidenceOutdoor from '../assets/images/noir_evidence_outdoor_1785837067067.jpg';
import crimeDossierArt from '../assets/images/crime_dossier_art_1785743022427.jpg';

export const AI_GENERATED_HERO_ART = {
  weapon: crimeWeaponArt,
  evidence: crimeEvidenceArt,
  poison: crimePoisonArt,
  dossier: crimeDossierArt,
};

interface CardData {
  id: string;
  name: string;
  category: string;
  tags: string[];
}

export function getCardImageUrl(card: CardData): string {
  if (card.id) {
    if (card.id.startsWith('w') || card.id.startsWith('e')) {
      return `/cards/${card.id}.png`;
    }
  }

  const isWeapon = card.category === 'weapon' || (card.id && card.id.startsWith('w'));
  const tags = card.tags || [];
  const name = card.name || '';

  if (isWeapon) {
    if (
      tags.includes('poison') ||
      tags.includes('chemical') ||
      name.includes('سم') ||
      name.includes('سيانيد') ||
      name.includes('زرنيخ') ||
      name.includes('استركنين') ||
      name.includes('ريسين') ||
      name.includes('كلوروفورم')
    ) {
      return crimePoisonArt;
    }
    if (tags.includes('gunshot') || name.includes('مسدس') || name.includes('مدفع')) {
      return noirWeaponGun;
    }
    if (
      tags.includes('sharp') ||
      tags.includes('bleeding') ||
      name.includes('سكين') ||
      name.includes('مشرط') ||
      name.includes('ساطور') ||
      name.includes('فأس') ||
      name.includes('سيف') ||
      name.includes('شفرة') ||
      name.includes('خنجر')
    ) {
      return noirWeaponBlade;
    }
    if (
      tags.includes('strangulation') ||
      tags.includes('fiber') ||
      name.includes('سلك') ||
      name.includes('جاروت') ||
      name.includes('حزام') ||
      name.includes('طوق')
    ) {
      return noirWeaponStrangle;
    }
    if (
      tags.includes('fire') ||
      tags.includes('heat') ||
      tags.includes('burn') ||
      tags.includes('electric') ||
      name.includes('مولوتوف') ||
      name.includes('مشعل') ||
      name.includes('صاعق') ||
      name.includes('ليزر')
    ) {
      return noirWeaponFire;
    }
    if (
      tags.includes('blunt') ||
      tags.includes('heavy') ||
      name.includes('مطرقة') ||
      name.includes('أنبوب') ||
      name.includes('عتلة') ||
      name.includes('كباشة') ||
      name.includes('حجر')
    ) {
      return noirWeaponBlunt;
    }
    return crimeWeaponArt;
  } else {
    // EVIDENCE
    if (
      tags.includes('fingerprint') ||
      tags.includes('bleeding') ||
      tags.includes('medicine') ||
      tags.includes('hospital') ||
      tags.includes('chemical') ||
      name.includes('دم') ||
      name.includes('بصمة') ||
      name.includes('دواء') ||
      name.includes('حبوب')
    ) {
      return noirEvidenceForensics;
    }
    if (
      tags.includes('paper') ||
      tags.includes('text') ||
      name.includes('رسالة') ||
      name.includes('صورة') ||
      name.includes('دفتر') ||
      name.includes('طابع') ||
      name.includes('إيصال') ||
      name.includes('تذكرة') ||
      name.includes('جريدة')
    ) {
      return noirEvidenceDocuments;
    }
    if (
      tags.includes('clothing') ||
      tags.includes('leather') ||
      name.includes('قفاز') ||
      name.includes('صوف') ||
      name.includes('زر') ||
      name.includes('كعب') ||
      name.includes('حزام')
    ) {
      return noirEvidenceClothing;
    }
    if (
      tags.includes('gold') ||
      tags.includes('personal_item') ||
      tags.includes('metal') ||
      name.includes('ساعة') ||
      name.includes('خاتم') ||
      name.includes('مفتاح') ||
      name.includes('عملة') ||
      name.includes('محفظة') ||
      name.includes('ولاعة')
    ) {
      return noirEvidencePersonal;
    }
    if (
      tags.includes('outdoor') ||
      tags.includes('soil') ||
      tags.includes('organic') ||
      tags.includes('plant') ||
      name.includes('أثر') ||
      name.includes('طين') ||
      name.includes('تربة')
    ) {
      return noirEvidenceOutdoor;
    }
    return crimeEvidenceArt;
  }
}
