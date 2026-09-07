import sharp from "sharp";
import fs from "fs";

async function buildAllLogos() {
  // 1. Get high-res colored mascot mark trimmed cleanly
  const mark = await sharp("public/images/petsaathi-logo-mark-colored.png")
    .trim()
    .resize(160, 160, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  // 2. Get authentic stylized wordmark trimmed and scaled cleanly
  const wordmark = await sharp("public/images/petsaathi-logo-wordmark.png")
    .trim()
    .resize(340, 90, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  // 3. Compose Light Horizontal Logo (Width: 540, Height: 160)
  const lightBuffer = await sharp({
    create: {
      width: 540,
      height: 160,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
    .composite([
      { input: mark, left: 10, top: 0 },
      { input: wordmark, left: 180, top: 35 }
    ])
    .png({ compressionLevel: 9 })
    .toBuffer();

  await sharp(lightBuffer).toFile("public/images/petsaathi-logo-horizontal-brand.png");
  await sharp(lightBuffer).toFile("public/logo-header.png");
  await sharp(lightBuffer).toFile("public/logo.png");

  // 4. Inverted Wordmark for Dark Backgrounds
  // Recolor the wordmark pixels to bright white & coral
  const { data: wmRaw, info: wmInfo } = await sharp(wordmark)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < wmRaw.length; i += wmInfo.channels) {
    const alpha = wmRaw[i + 3];
    if (alpha < 30) continue;
    const r = wmRaw[i];
    const g = wmRaw[i + 1];
    const b = wmRaw[i + 2];
    const lum = (r + g + b) / 3;
    if (lum < 150) {
      // Dark text -> white
      wmRaw[i] = 255;
      wmRaw[i + 1] = 255;
      wmRaw[i + 2] = 255;
    }
  }

  const invertedWordmark = await sharp(wmRaw, {
    raw: { width: wmInfo.width, height: wmInfo.height, channels: wmInfo.channels }
  })
    .png()
    .toBuffer();

  const darkBuffer = await sharp({
    create: {
      width: 540,
      height: 160,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
    .composite([
      { input: mark, left: 10, top: 0 },
      { input: invertedWordmark, left: 180, top: 35 }
    ])
    .png({ compressionLevel: 9 })
    .toBuffer();

  await sharp(darkBuffer).toFile("public/images/petsaathi-logo-horizontal-inverted.png");

  console.log("Successfully rebuilt authentic high-DPI PetSaathi brand logos!");
}

buildAllLogos().catch(console.error);


