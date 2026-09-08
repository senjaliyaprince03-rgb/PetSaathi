import sharp from "sharp";
import fs from "fs";
import path from "path";

const dir = path.join(process.cwd(), "public/images");
const files = fs.readdirSync(dir).filter(f => f.endsWith(".png") || f.endsWith(".jpg"));

for (const file of files) {
  const filePath = path.join(dir, file);
  const stats = fs.statSync(filePath);
  if (stats.size > 500 * 1024) { // larger than 500KB
    console.log(`Optimizing ${file} (${(stats.size / 1024 / 1024).toFixed(2)} MB)...`);
    const ext = path.extname(file);
    const name = path.basename(file, ext);
    const outPath = path.join(dir, `${name}.webp`);
    await sharp(filePath)
      .webp({ quality: 80, effort: 6 })
      .toFile(outPath);
    console.log(` -> Created ${name}.webp`);
  }
}
