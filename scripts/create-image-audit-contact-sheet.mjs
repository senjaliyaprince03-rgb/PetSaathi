import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const roots = ["public/images", "public/videos"];
const excluded = /logo|icon|favicon/i;
const files = (
  await Promise.all(
    roots.map(async (root) =>
      (await fs.readdir(root))
        .filter((name) => /\.(?:png|jpe?g|webp|avif)$/i.test(name) && !excluded.test(name))
        .map((name) => path.join(root, name))
    )
  )
).flat();

const cellWidth = 360;
const imageHeight = 220;
const labelHeight = 54;
const columns = 4;
const rows = Math.ceil(files.length / columns);
const canvas = sharp({
  create: {
    width: cellWidth * columns,
    height: (imageHeight + labelHeight) * rows,
    channels: 4,
    background: "#fffdf8"
  }
});

const composites = [];
for (const [index, file] of files.entries()) {
  const left = (index % columns) * cellWidth;
  const top = Math.floor(index / columns) * (imageHeight + labelHeight);
  const thumbnail = await sharp(file)
    .resize(cellWidth, imageHeight, { fit: "cover", position: "attention" })
    .png()
    .toBuffer();
  const label = path.basename(file);
  const safeLabel = label.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  const caption = Buffer.from(
    `<svg width="${cellWidth}" height="${labelHeight}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#302030"/>
      <text x="16" y="32" fill="#fffdf8" font-family="Arial, sans-serif" font-size="15">${safeLabel}</text>
    </svg>`
  );
  composites.push({ input: thumbnail, left, top });
  composites.push({ input: caption, left, top: top + imageHeight });
}

await canvas
  .composite(composites)
  .jpeg({ quality: 82, chromaSubsampling: "4:4:4" })
  .toFile("image-audit-contact-sheet.jpg");

console.log(`Created image-audit-contact-sheet.jpg with ${files.length} assets.`);
