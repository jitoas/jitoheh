import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function sliceAllCards() {
  const sourcePath = path.join(process.cwd(), 'src', 'assets', 'images', 'card_spritesheet_1786021836602.jpg');
  
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Original source image not found at ${sourcePath}`);
  }

  console.log(`Loading original source image: ${sourcePath}`);
  const img = sharp(sourcePath);
  const meta = await img.metadata();
  console.log(`Source dimensions: ${meta.width}x${meta.height}`);

  const publicCardsDir = path.join(process.cwd(), 'public', 'cards');
  const distCardsDir = path.join(process.cwd(), 'dist', 'cards');

  fs.mkdirSync(publicCardsDir, { recursive: true });
  fs.mkdirSync(distCardsDir, { recursive: true });

  // Grid coordinates for 9 cols x 5 rows
  const cardW = 58;
  const cardH = 82;

  // Left corkboard (WEAPONS: 9 cols x 5 rows)
  const wStartX = 63;
  const wStartY = 152;
  const wColStep = 67.5;
  const wRowStep = 87;

  let wIndex = 1;
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 9; c++) {
      const left = Math.round(wStartX + c * wColStep);
      const top = Math.round(wStartY + r * wRowStep);
      const fileName = `w${wIndex}.png`;
      const pubPath = path.join(publicCardsDir, fileName);
      const distPath = path.join(distCardsDir, fileName);

      await img.clone()
        .extract({ left, top, width: cardW, height: cardH })
        .png({ quality: 95 })
        .toFile(pubPath);

      fs.copyFileSync(pubPath, distPath);
      wIndex++;
    }
  }
  console.log(`Sliced and verified ${wIndex - 1} weapon cards (w1-w45)`);

  // Right corkboard (EVIDENCE: 9 cols x 5 rows)
  const eStartX = 711;
  const eStartY = 152;
  const eColStep = 67.5;
  const eRowStep = 87;

  let eIndex = 1;
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 9; c++) {
      const left = Math.round(eStartX + c * eColStep);
      const top = Math.round(eStartY + r * eRowStep);
      const fileName = `e${eIndex}.png`;
      const pubPath = path.join(publicCardsDir, fileName);
      const distPath = path.join(distCardsDir, fileName);

      await img.clone()
        .extract({ left, top, width: cardW, height: cardH })
        .png({ quality: 95 })
        .toFile(pubPath);

      fs.copyFileSync(pubPath, distPath);
      eIndex++;
    }
  }
  console.log(`Sliced and verified ${eIndex - 1} evidence cards (e1-e45)`);
}

sliceAllCards().catch(err => {
  console.error('Slicing failed:', err);
  process.exit(1);
});
