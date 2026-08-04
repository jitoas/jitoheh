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

interface CardData {
  id: string;
  name: string;
  category: string;
  tags: string[];
}

// Generates an item-specific SVG vector path for each card
function getItemSvgGraphic(id: string, name: string, category: string): string {
  const isWeapon = category === 'weapon';
  const cleanId = id.toLowerCase();

  // WEAPONS (w1 - w99)
  if (cleanId === 'w1' || name.includes('سيانيد')) {
    // Cyanide Poison Flask
    return `
      <g stroke="#f0abfc" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="M180 180 h40 v30 l30 50 v80 a20 20 0 0 1 -20 20 h-60 a20 20 0 0 1 -20 -20 v-80 l30 -50 z" fill="#581c87" fill-opacity="0.6"/>
        <line x1="170" y1="180" x2="230" y2="180" stroke-width="5"/>
        <path d="M190 280 h20 M200 270 v20" stroke="#f0abfc" stroke-width="2.5"/>
        <circle cx="200" cy="310" r="12" fill="#c026d3" fill-opacity="0.8"/>
        <circle cx="185" cy="325" r="6" fill="#f0abfc"/>
        <circle cx="215" cy="325" r="6" fill="#f0abfc"/>
      </g>`;
  }

  if (cleanId === 'w2' || name.includes('مشرط')) {
    // Scalpel
    return `
      <g stroke="#38bdf8" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="M130 330 L220 240 L270 190 Q290 170 280 150 Q260 140 240 160 L190 210 L130 330" fill="#0284c7" fill-opacity="0.4"/>
        <line x1="130" y1="330" x2="110" y2="350" stroke-width="6"/>
        <line x1="160" y1="300" x2="210" y2="250" stroke="#bae6fd" stroke-width="2"/>
      </g>`;
  }

  if (cleanId === 'w3' || name.includes('مسدس')) {
    // Revolver
    return `
      <g stroke="#f87171" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="M120 200 h130 v25 h-130 z" fill="#7f1d1d" fill-opacity="0.6"/>
        <rect x="210" y="225" width="45" height="35" rx="4" fill="#991b1b"/>
        <path d="M235 260 L200 340 a12 12 0 0 1 -15 5 L160 330 L195 260 z" fill="#450a0a"/>
        <path d="M180 225 v25 h30" />
        <circle cx="195" cy="237" r="6" stroke="#f87171"/>
        <line x1="110" y1="195" x2="110" y2="210" stroke-width="5"/>
      </g>`;
  }

  if (cleanId === 'w4' || name.includes('كباشة')) {
    // Brass Knuckles
    return `
      <g stroke="#fbbf24" stroke-width="3" fill="#78350f" fill-opacity="0.5" stroke-linecap="round">
        <rect x="140" y="270" width="120" height="30" rx="8"/>
        <circle cx="155" cy="225" r="16" fill="#18181b"/>
        <circle cx="185" cy="220" r="16" fill="#18181b"/>
        <circle cx="215" cy="220" r="16" fill="#18181b"/>
        <circle cx="245" cy="225" r="16" fill="#18181b"/>
      </g>`;
  }

  if (cleanId === 'w5' || name.includes('فأس')) {
    // Axe
    return `
      <g stroke="#38bdf8" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <line x1="140" y1="360" x2="250" y2="150" stroke="#78350f" stroke-width="12"/>
        <path d="M220 180 Q270 140 280 190 Q250 220 210 200 z" fill="#0284c7" fill-opacity="0.7"/>
      </g>`;
  }

  if (cleanId === 'w6' || name.includes('سلك')) {
    // Wire Garrote
    return `
      <g stroke="#f97316" stroke-width="3" fill="none" stroke-linecap="round">
        <rect x="120" y="160" width="15" height="50" rx="4" fill="#7c2d12"/>
        <rect x="265" y="320" width="15" height="50" rx="4" fill="#7c2d12"/>
        <path d="M135 185 Q 280 200 160 300 T 265 345" stroke="#fed7aa" stroke-width="2.5" stroke-dasharray="6 2"/>
      </g>`;
  }

  if (cleanId === 'w7' || name.includes('سكين')) {
    // Hunting Knife
    return `
      <g stroke="#38bdf8" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="M140 330 L200 250 L270 170 Q290 180 250 220 L190 290 L140 330" fill="#0369a1" fill-opacity="0.5"/>
        <rect x="110" y="320" width="40" height="25" rx="4" fill="#1e293b" transform="rotate(-40 130 330)"/>
      </g>`;
  }

  if (cleanId === 'w8' || name.includes('زرنيخ')) {
    // Arsenic Powder Jar
    return `
      <g stroke="#f0abfc" stroke-width="3" fill="none">
        <rect x="160" y="200" width="80" height="120" rx="12" fill="#581c87" fill-opacity="0.5"/>
        <rect x="175" y="180" width="50" height="20" rx="4" fill="#a855f7"/>
        <text x="200" y="260" fill="#f0abfc" font-size="28" font-weight="bold" text-anchor="middle">As</text>
      </g>`;
  }

  if (cleanId === 'w9' || name.includes('سهم')) {
    // Arrow
    return `
      <g stroke="#38bdf8" stroke-width="3" fill="none" stroke-linecap="round">
        <line x1="120" y1="360" x2="270" y2="170" stroke="#a1a1aa" stroke-width="4"/>
        <path d="M270 170 L285 155 L260 160 z" fill="#38bdf8"/>
        <path d="M120 360 L105 375 M125 355 L110 370" stroke="#ef4444" stroke-width="3"/>
      </g>`;
  }

  if (cleanId === 'w10' || name.includes('ساطور')) {
    // Meat Cleaver
    return `
      <g stroke="#38bdf8" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <rect x="180" y="160" width="90" height="130" rx="4" fill="#0f172a" fill-opacity="0.8"/>
        <circle cx="245" cy="185" r="6" fill="#38bdf8"/>
        <rect x="120" y="260" width="70" height="20" rx="4" fill="#78350f" transform="rotate(-25 150 270)"/>
      </g>`;
  }

  if (cleanId === 'w11' || name.includes('قوس')) {
    // Bow
    return `
      <g stroke="#f97316" stroke-width="3" fill="none" stroke-linecap="round">
        <path d="M150 150 Q 250 250 150 350" stroke="#7c2d12" stroke-width="8"/>
        <line x1="150" y1="150" x2="150" y2="350" stroke="#fed7aa" stroke-width="2"/>
      </g>`;
  }

  if (cleanId === 'w12' || name.includes('شمعدان')) {
    // Candlestick
    return `
      <g stroke="#fbbf24" stroke-width="3" fill="none" stroke-linecap="round">
        <path d="M160 340 h80 M200 340 v-100 M160 240 h80 M160 240 v-30 M240 240 v-30 M200 240 v-40" fill="none"/>
        <circle cx="160" cy="200" r="5" fill="#ef4444"/>
        <circle cx="200" cy="190" r="5" fill="#ef4444"/>
        <circle cx="240" cy="200" r="5" fill="#ef4444"/>
      </g>`;
  }

  if (cleanId === 'w13' || name.includes('زجاج')) {
    // Broken Glass Bottle
    return `
      <g stroke="#38bdf8" stroke-width="3" fill="none" stroke-linecap="round">
        <path d="M180 180 h40 v40 L250 270 L230 340 L170 340 L150 270 L180 220 z" fill="#0284c7" fill-opacity="0.4"/>
        <line x1="180" y1="280" x2="220" y2="330" stroke="#ef4444"/>
      </g>`;
  }

  if (cleanId === 'w14' || name.includes('كلوروفورم')) {
    // Chloroform Bottle & Rag
    return `
      <g stroke="#f0abfc" stroke-width="3" fill="none">
        <rect x="150" y="210" width="60" height="100" rx="8" fill="#581c87" fill-opacity="0.6"/>
        <rect x="165" y="190" width="30" height="20" rx="2" fill="#c026d3"/>
        <path d="M220 280 Q250 260 270 290 T230 330 z" fill="#e4e4e7" fill-opacity="0.7" stroke="#a1a1aa"/>
      </g>`;
  }

  if (cleanId === 'w15' || name.includes('صاعق')) {
    // Taser Stun Gun
    return `
      <g stroke="#ef4444" stroke-width="3" fill="none" stroke-linecap="round">
        <rect x="150" y="200" width="100" height="50" rx="6" fill="#450a0a"/>
        <line x1="150" y1="215" x2="130" y2="215" stroke-width="4"/>
        <line x1="150" y1="235" x2="130" y2="235" stroke-width="4"/>
        <path d="M125 210 L135 225 L125 240" stroke="#fef08a" stroke-width="2"/>
        <rect x="200" y="250" width="35" height="70" rx="4" fill="#18181b"/>
      </g>`;
  }

  if (cleanId === 'w16' || name.includes('أنبوب')) {
    // Iron Pipe
    return `
      <g stroke="#94a3b8" stroke-width="4" fill="none" stroke-linecap="round">
        <line x1="130" y1="330" x2="270" y2="190" stroke="#334155" stroke-width="22"/>
        <line x1="130" y1="330" x2="270" y2="190" stroke="#cbd5e1" stroke-width="12"/>
        <circle cx="270" cy="190" r="11" fill="#64748b"/>
      </g>`;
  }

  if (cleanId === 'w17' || name.includes('شفرة')) {
    // Razor Blade
    return `
      <g stroke="#38bdf8" stroke-width="3" fill="#0f172a" fill-opacity="0.8" stroke-linecap="round">
        <rect x="140" y="210" width="120" height="70" rx="6"/>
        <rect x="160" y="235" width="80" height="20" rx="10" fill="#0284c7" fill-opacity="0.5"/>
        <circle cx="150" cy="245" r="5" fill="#38bdf8"/>
        <circle cx="250" cy="245" r="5" fill="#38bdf8"/>
      </g>`;
  }

  if (cleanId === 'w19' || name.includes('مطرقة')) {
    // Hammer
    return `
      <g stroke="#f59e0b" stroke-width="3" fill="none" stroke-linecap="round">
        <rect x="180" y="180" width="70" height="35" rx="4" fill="#78350f"/>
        <line x1="215" y1="215" x2="215" y2="350" stroke="#d97706" stroke-width="14"/>
      </g>`;
  }

  if (cleanId === 'w20' || name.includes('سم')) {
    // Poison Skull Bottle
    return `
      <g stroke="#a855f7" stroke-width="3" fill="none">
        <path d="M170 200 h60 v30 l20 40 v60 a15 15 0 0 1 -15 15 h-70 a15 15 0 0 1 -15 -15 v-60 l20 -40 z" fill="#3b0764" fill-opacity="0.7"/>
        <circle cx="200" cy="280" r="12" stroke="#f0abfc"/>
        <circle cx="195" cy="278" r="3" fill="#f0abfc"/>
        <circle cx="205" cy="278" r="3" fill="#f0abfc"/>
      </g>`;
  }

  if (cleanId === 'w36' || name.includes('حقنة')) {
    // Syringe
    return `
      <g stroke="#38bdf8" stroke-width="3" fill="none" stroke-linecap="round">
        <rect x="185" y="190" width="30" height="100" rx="4" fill="#0284c7" fill-opacity="0.3"/>
        <line x1="200" y1="290" x2="200" y2="340" stroke="#bae6fd" stroke-width="2"/>
        <line x1="200" y1="190" x2="200" y2="150" stroke="#38bdf8" stroke-width="6"/>
        <line x1="180" y1="150" x2="220" y2="150" stroke-width="4"/>
      </g>`;
  }

  // EVIDENCE (e1 - e57)
  if (cleanId === 'e1' || name.includes('دم')) {
    // Blood Drop / Spatter
    return `
      <g stroke="#ef4444" stroke-width="3" fill="#881337" fill-opacity="0.8">
        <path d="M200 170 Q240 250 240 280 A40 40 0 0 1 160 280 Q160 250 200 170 z"/>
        <circle cx="250" cy="210" r="8" fill="#9f1239"/>
        <circle cx="145" cy="240" r="12" fill="#9f1239"/>
        <circle cx="230" cy="310" r="6" fill="#9f1239"/>
      </g>`;
  }

  if (cleanId === 'e2' || name.includes('بصمة')) {
    // Fingerprint
    return `
      <g stroke="#f43f5e" stroke-width="3" fill="none" stroke-linecap="round">
        <ellipse cx="200" cy="250" rx="15" ry="25"/>
        <ellipse cx="200" cy="250" rx="30" ry="45"/>
        <ellipse cx="200" cy="250" rx="45" ry="65"/>
        <ellipse cx="200" cy="250" rx="60" ry="85"/>
      </g>`;
  }

  if (cleanId === 'e3' || name.includes('ساعة')) {
    // Pocket Watch
    return `
      <g stroke="#fbbf24" stroke-width="3" fill="none">
        <circle cx="200" cy="260" r="55" fill="#78350f" fill-opacity="0.4"/>
        <circle cx="200" cy="260" r="45" fill="#18181b"/>
        <line x1="200" y1="260" x2="200" y2="230" stroke="#fef08a" stroke-width="3"/>
        <line x1="200" y1="260" x2="225" y2="260" stroke="#fef08a" stroke-width="2"/>
        <circle cx="200" cy="195" r="10" stroke="#fbbf24"/>
      </g>`;
  }

  if (cleanId === 'e5' || name.includes('خاتم')) {
    // Signet Ring
    return `
      <g stroke="#fbbf24" stroke-width="4" fill="none">
        <ellipse cx="200" cy="270" rx="45" ry="25"/>
        <rect x="180" y="210" width="40" height="30" rx="6" fill="#d97706" stroke="#fef08a"/>
        <path d="M190 225 L210 225 M200 218 L200 232" stroke="#451a03" stroke-width="3"/>
      </g>`;
  }

  if (cleanId === 'e7' || name.includes('رسالة')) {
    // Letter with Wax Seal
    return `
      <g stroke="#d6d3d1" stroke-width="3" fill="#1c1917">
        <rect x="130" y="200" width="140" height="90" rx="6"/>
        <path d="M130 200 L200 250 L270 200" fill="none" stroke="#a8a29e"/>
        <circle cx="200" cy="250" r="16" fill="#991b1b" stroke="#ef4444"/>
      </g>`;
  }

  if (cleanId === 'e8' || name.includes('أثر') || name.includes('قدم')) {
    // Footprint
    return `
      <g stroke="#a16207" fill="#451a03" fill-opacity="0.7">
        <ellipse cx="200" cy="230" rx="35" ry="50"/>
        <ellipse cx="200" cy="300" rx="25" ry="20"/>
        <circle cx="170" cy="165" r="8"/>
        <circle cx="188" cy="160" r="8"/>
        <circle cx="206" cy="160" r="8"/>
        <circle cx="224" cy="165" r="8"/>
      </g>`;
  }

  if (cleanId === 'e14' || name.includes('مفتاح')) {
    // Skeleton Key
    return `
      <g stroke="#fbbf24" stroke-width="4" fill="none">
        <circle cx="160" cy="220" r="25" stroke="#fef08a"/>
        <line x1="180" y1="235" x2="260" y2="300" stroke="#d97706" stroke-width="6"/>
        <path d="M240 280 L255 265 M250 290 L265 275" stroke="#fef08a" stroke-width="4"/>
      </g>`;
  }

  if (cleanId === 'e19' || name.includes('صورة')) {
    // Polaroid Crime Photo
    return `
      <g stroke="#e2e8f0" stroke-width="3" fill="#020617">
        <rect x="140" y="180" width="120" height="140" rx="4" fill="#f8fafc"/>
        <rect x="150" y="190" width="100" height="90" fill="#0f172a"/>
        <circle cx="200" cy="230" r="20" fill="#ef4444" fill-opacity="0.6"/>
      </g>`;
  }

  if (cleanId === 'e34' || name.includes('محفظة')) {
    // Leather Wallet
    return `
      <g stroke="#f97316" stroke-width="3" fill="#451a03">
        <rect x="130" y="200" width="140" height="90" rx="10"/>
        <path d="M230 230 h40 v30 h-40 z" fill="#78350f" stroke="#fed7aa"/>
        <circle cx="250" cy="245" r="4" fill="#fef08a"/>
      </g>`;
  }

  // GENERAL DETERMINISTIC GENERIC NOIR ICON (For all other cards to guarantee complete unique shapes)
  const seed = cleanId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue = (seed * 37) % 360;

  if (isWeapon) {
    return `
      <g stroke="#38bdf8" stroke-width="3" fill="none" stroke-linecap="round">
        <polygon points="200,160 260,280 140,280" fill="#0284c7" fill-opacity="0.4" transform="rotate(${seed % 45} 200 230)"/>
        <circle cx="200" cy="230" r="45" stroke="${primaryColorForSeed(seed)}" stroke-width="3" stroke-dasharray="8 4"/>
        <line x1="160" y1="230" x2="240" y2="230" stroke="#f8fafc" stroke-width="4"/>
        <line x1="200" y1="190" x2="200" y2="270" stroke="#f8fafc" stroke-width="4"/>
      </g>`;
  } else {
    return `
      <g stroke="#f59e0b" stroke-width="3" fill="none" stroke-linecap="round">
        <rect x="150" y="180" width="100" height="100" rx="16" fill="#78350f" fill-opacity="0.3" transform="rotate(${seed % 30} 200 230)"/>
        <circle cx="200" cy="230" r="35" stroke="#fef08a" stroke-width="3"/>
        <path d="M180 230 Q200 200 220 230 T240 230" stroke="${primaryColorForSeed(seed)}" stroke-width="3"/>
      </g>`;
  }
}

function primaryColorForSeed(seed: number): string {
  const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4'];
  return colors[seed % colors.length];
}

function getCardStyle(card: CardData) {
  const isWeapon = card.category === 'weapon';
  const idNum = parseInt(card.id.replace(/[^\d]/g, ''), 10) || 1;

  let primaryColor = '#eab308'; // Amber default
  let glowColor = '#ca8a04';

  if (card.tags.includes('poison') || card.tags.includes('chemical')) {
    primaryColor = '#c026d3'; // Poison purple
    glowColor = '#701a75';
  } else if (card.tags.includes('gunshot') || card.tags.includes('fire') || card.tags.includes('heat') || card.tags.includes('burn')) {
    primaryColor = '#ef4444'; // Red flare
    glowColor = '#991b1b';
  } else if (card.tags.includes('sharp') || card.tags.includes('metal')) {
    primaryColor = '#38bdf8'; // Steel blue
    glowColor = '#0369a1';
  } else if (card.tags.includes('strangulation') || card.tags.includes('fiber') || card.tags.includes('leather')) {
    primaryColor = '#f97316'; // Orange brown leather
    glowColor = '#9a3412';
  } else if (card.tags.includes('gold') || card.tags.includes('personal_item')) {
    primaryColor = '#fbbf24'; // Warm gold
    glowColor = '#b45309';
  } else if (card.tags.includes('paper') || card.tags.includes('text')) {
    primaryColor = '#e7e5e4'; // Vintage paper
    glowColor = '#57534e';
  } else if (card.tags.includes('fingerprint') || card.tags.includes('bleeding')) {
    primaryColor = '#f43f5e'; // Forensics red
    glowColor = '#9f1239';
  }

  return { isWeapon, idNum, primaryColor, glowColor };
}

export function getCardImageUrl(card: CardData): string {
  const { isWeapon, idNum, primaryColor, glowColor } = getCardStyle(card);
  const tagNumber = isWeapon ? `W-${idNum.toString().padStart(2, '0')}` : `E-${idNum.toString().padStart(2, '0')}`;
  
  const itemIconSvg = getItemSvgGraphic(card.id, card.name, card.category);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 560" width="100%" height="100%">
    <defs>
      <radialGradient id="spotlight_${card.id}" cx="50%" cy="42%" r="60%">
        <stop offset="0%" stop-color="${glowColor}" stop-opacity="0.6"/>
        <stop offset="65%" stop-color="#09090b" stop-opacity="0.95"/>
        <stop offset="100%" stop-color="#020203" stop-opacity="1"/>
      </radialGradient>
      <filter id="dropShadow_${card.id}" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="10" stdDeviation="8" flood-color="#000000" flood-opacity="0.95"/>
      </filter>
    </defs>

    <rect width="400" height="560" fill="#020203"/>
    <rect width="400" height="560" fill="url(#spotlight_${card.id})"/>

    <!-- Outer Noir Grid Border -->
    <rect x="16" y="16" width="368" height="528" rx="16" fill="none" stroke="${primaryColor}" stroke-opacity="0.3" stroke-width="1.5" stroke-dasharray="6 4"/>

    <!-- Evidence Tag (Top Left) -->
    <g transform="translate(32, 32)">
      <rect width="100" height="26" rx="6" fill="#18181b" stroke="${primaryColor}" stroke-width="1" stroke-opacity="0.7"/>
      <text x="50" y="17" fill="${primaryColor}" font-family="monospace" font-size="12" font-weight="900" text-anchor="middle" letter-spacing="1">
        #${tagNumber}
      </text>
    </g>

    <!-- Category Watermark (Top Right) -->
    <g transform="translate(250, 32)">
      <rect width="118" height="26" rx="6" fill="#09090b" stroke="#3f3f46" stroke-width="1"/>
      <text x="59" y="17" fill="#a1a1aa" font-family="sans-serif" font-size="10" font-weight="700" text-anchor="middle">
        ${isWeapon ? 'CRIME WEAPON' : 'CRIME EVIDENCE'}
      </text>
    </g>

    <!-- Center Spotlight Target Circles -->
    <circle cx="200" cy="240" r="115" fill="none" stroke="${primaryColor}" stroke-opacity="0.12" stroke-width="2"/>
    <circle cx="200" cy="240" r="135" fill="none" stroke="${primaryColor}" stroke-opacity="0.06" stroke-width="1" stroke-dasharray="4 4"/>

    <!-- Center Item Vector Artwork -->
    <g filter="url(#dropShadow_${card.id})">
      ${itemIconSvg}
    </g>

    <!-- Bottom Arabic Name Plate -->
    <g transform="translate(30, 465)">
      <rect width="340" height="55" rx="10" fill="#09090b" fill-opacity="0.92" stroke="${primaryColor}" stroke-opacity="0.6" stroke-width="1.2"/>
      <text x="170" y="35" fill="#f4f4f5" font-family="'Cairo', 'Segoe UI', sans-serif" font-size="21" font-weight="900" text-anchor="middle">
        ${card.name}
      </text>
    </g>

    <!-- Stamped Badge Overlay -->
    <g transform="translate(265, 435) rotate(-10)">
      <rect width="100" height="20" rx="4" fill="none" stroke="#ef4444" stroke-width="1.2" stroke-opacity="0.5"/>
      <text x="50" y="14" fill="#ef4444" fill-opacity="0.6" font-family="monospace" font-size="8" font-weight="800" text-anchor="middle" letter-spacing="1">
        NOIR DOSSIER
      </text>
    </g>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
