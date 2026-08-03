import crimeWeaponArt from '../assets/images/crime_weapon_art_1785742988879.jpg';
import crimeEvidenceArt from '../assets/images/crime_evidence_art_1785743002100.jpg';
import crimePoisonArt from '../assets/images/crime_poison_art_1785743012153.jpg';
import crimeDossierArt from '../assets/images/crime_dossier_art_1785743022427.jpg';

export const AI_GENERATED_HERO_ART = {
  weapon: crimeWeaponArt,
  evidence: crimeEvidenceArt,
  poison: crimePoisonArt,
  dossier: crimeDossierArt,
};

// High resolution dark noir realistic crime scene evidence photography mapping
const WEAPON_IMAGES: Record<string, string> = {
  // Knives & Blades
  knife: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=600&q=80',
  blade: 'https://images.unsplash.com/photo-1589256469067-ea99122bbec9?auto=format&fit=crop&w=600&q=80',
  cleaver: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=600&q=80',
  axe: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=600&q=80',
  scissors: 'https://images.unsplash.com/photo-1503792501406-2c40da09e1e2?auto=format&fit=crop&w=600&q=80',
  razor: 'https://images.unsplash.com/photo-1503792501406-2c40da09e1e2?auto=format&fit=crop&w=600&q=80',
  
  // Firearms & Bullets
  gun: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?auto=format&fit=crop&w=600&q=80',
  revolver: 'https://images.unsplash.com/photo-1584281722572-8820c7490214?auto=format&fit=crop&w=600&q=80',
  bullet: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=600&q=80',

  // Poisons & Chemicals
  poison: crimePoisonArt,
  chemical: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=600&q=80',
  syringe: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
  vial: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=600&q=80',
  acid: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=600&q=80',

  // Blunt & Impact Weapons
  hammer: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=600&q=80',
  crowbar: crimeDossierArt,
  bat: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=600&q=80',
  pipe: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80',
  candlestick: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',

  // Ropes & Wires
  rope: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
  wire: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',

  // Fire & Electricity
  fire: 'https://images.unsplash.com/photo-1508873696983-2df515122519?auto=format&fit=crop&w=600&q=80',
  electric: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',

  // Glass
  glass: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',

  // Default fallback
  default: crimeWeaponArt,
};

const EVIDENCE_IMAGES: Record<string, string> = {
  // Forensics
  fingerprint: crimeEvidenceArt,
  blood: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
  footprint: crimeDossierArt,
  hair: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
  soil: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',

  // Personal Items & Valuables
  watch: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
  ring: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80',
  wallet: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80',
  key: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=600&q=80',
  glove: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
  glasses: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80',
  coin: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80',

  // Documents & Notes
  paper: 'https://images.unsplash.com/photo-1583521214690-73421a1829a9?auto=format&fit=crop&w=600&q=80',
  photo: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80',
  receipt: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',

  // Medical & Bottles
  medicine: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=600&q=80',
  cup: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',

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
