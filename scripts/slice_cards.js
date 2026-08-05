import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Find spritesheet file in public/ or src/assets/images/
function findSpritesheet() {
  const candidates = [
    'public/card_spritesheet.png',
    'public/card_spritesheet.jpg',
    'public/sprite.png',
    'public/spritesheet.png',
    'src/assets/images/card_spritesheet.png',
    'src/assets/images/card_spritesheet.jpg',
    'src/assets/images/sprite.png',
    'src/assets/images/spritesheet.png',
  ];

  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }

  // Search directory for any png or jpg with 'sprite' or 'card' in name
  const publicFiles = fs.readdirSync('public').filter(f => f.endsWith('.png') || f.endsWith('.jpg'));
  for (const f of publicFiles) {
    if (f.includes('sprite') || f.includes('board') || f.includes('card')) {
      return path.join('public', f);
    }
  }

  return null;
}

async function sliceCards() {
  const file = findSpritesheet();
  if (!file) {
    console.log('No spritesheet file found yet. Please place card_spritesheet.png in public/');
    return;
  }

  console.log(`Found spritesheet: ${file}`);
  const metadata = await sharp(file).metadata();
  const W = metadata.width;
  const H = metadata.height;
  console.log(`Image dimensions: ${W}x${H}`);

  const outputDir = path.join(process.cwd(), 'public', 'cards');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Weapons Grid: 9 columns, 6 rows on Left side
  // Left box bounds: x = ~2.3% to ~49.0%, y = ~10.2% to ~95.8%
  const weaponBoxX = Math.round(W * 0.023);
  const weaponBoxY = Math.round(H * 0.102);
  const weaponBoxW = Math.round(W * 0.467);
  const weaponBoxH = Math.round(H * 0.856);

  const weaponCols = 9;
  const weaponRows = 6;
  const wCardW = Math.floor(weaponBoxW / weaponCols);
  const wCardH = Math.floor(weaponBoxH / weaponRows);

  let wCount = 1;
  for (let r = 0; r < weaponRows; r++) {
    for (let c = 0; c < weaponCols; c++) {
      const left = weaponBoxX + c * wCardW;
      const top = weaponBoxY + r * wCardH;
      const outPath = path.join(outputDir, `w${wCount}.png`);
      
      await sharp(file)
        .extract({ left, top, width: wCardW, height: wCardH })
        .toFile(outPath);
      wCount++;
    }
  }
  console.log(`Successfully sliced ${wCount - 1} weapon cards to public/cards/`);

  // Evidence Grid: 9 columns, 6 rows on Right side
  // Right box bounds: x = ~51.0% to ~97.7%, y = ~10.2% to ~95.8%
  const evidenceBoxX = Math.round(W * 0.510);
  const evidenceBoxY = Math.round(H * 0.102);
  const evidenceBoxW = Math.round(W * 0.467);
  const evidenceBoxH = Math.round(H * 0.856);

  const evidenceCols = 9;
  const evidenceRows = 6;
  const eCardW = Math.floor(evidenceBoxW / evidenceCols);
  const eCardH = Math.floor(evidenceBoxH / evidenceRows);

  let eCount = 1;
  for (let r = 0; r < evidenceRows; r++) {
    for (let c = 0; c < evidenceCols; c++) {
      const left = evidenceBoxX + c * eCardW;
      const top = evidenceBoxY + r * eCardH;
      const outPath = path.join(outputDir, `e${eCount}.png`);

      await sharp(file)
        .extract({ left, top, width: eCardW, height: eCardH })
        .toFile(outPath);
      eCount++;
    }
  }
  console.log(`Successfully sliced ${eCount - 1} evidence cards to public/cards/`);
}

sliceCards().catch(console.error);
