import sharp from "sharp";

const sourcePath = "public/images/petsaathi-logo-horizontal.png";
const outputPath = "public/images/petsaathi-logo-horizontal-brand.png";

const { data, info } = await sharp(sourcePath)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

for (let index = 0; index < data.length; index += info.channels) {
  const alpha = data[index + 3];
  if (alpha === 0) continue;

  const red = data[index];
  const green = data[index + 1];
  const blue = data[index + 2];
  const luminance = (red + green + blue) / 3;
  const isNeutral = Math.max(red, green, blue) - Math.min(red, green, blue) < 8;

  if (isNeutral && alpha < 180 && luminance >= 35 && luminance <= 115) {
    // Preserve the original soft fill opacity while moving pet accents into brand indigo.
    data[index] = 91;
    data[index + 1] = 61;
    data[index + 2] = 122;
    continue;
  }

  if (luminance < 105) {
    // Keep all line art and lettering crisp in the site's dark plum ink.
    data[index] = 48;
    data[index + 1] = 32;
    data[index + 2] = 48;
  }
}

await sharp(data, {
  raw: {
    width: info.width,
    height: info.height,
    channels: info.channels
  }
})
  .png({ compressionLevel: 9 })
  .toFile(outputPath);

const mark = await sharp(outputPath)
  .extract({ left: 0, top: 0, width: 160, height: 160 })
  .resize(404, 404, { fit: "contain" })
  .png()
  .toBuffer();

const favicon = sharp({
  create: {
    width: 512,
    height: 512,
    channels: 4,
    background: "#fffdf8"
  }
})
  .composite([{ input: mark, left: 54, top: 54 }])
  .png({ compressionLevel: 9 })
  .toBuffer();

await Promise.all([
  sharp(await favicon).toFile("src/app/icon.png"),
  sharp(await favicon).resize(192, 192).toFile("public/icons/petsaathi-favicon-v2.png"),
  sharp(await favicon).toFile("public/icons/petsaathi-app-icon-v2.png")
]);

console.log(`Created ${outputPath} and refreshed the dog-and-cat favicon family`);
