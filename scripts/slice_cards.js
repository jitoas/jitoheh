import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function sliceCards() {
  const file = 'public/card_spritesheet.jpg';
  
  if (!fs.existsSync(file)) {
    throw new Error(`Source image file not found at ${file}`);
  }

  console.log(`Using source image: ${file}`);
  const metadata = await sharp(file).metadata();
  const W = metadata.width;
  const H = metadata.height;
  console.log(`Source image dimensions: ${W}x${H}`);

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
        .png({ quality: 90 })
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
        .png({ quality: 90 })
        .toFile(outPath);
      eCount++;
    }
  }
  console.log(`Successfully sliced ${eCount - 1} evidence cards to public/cards/`);
}

sliceCards().catch(err => {
  console.error('Error slicing cards:', err);
  process.exit(1);
});

