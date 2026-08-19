import sharp from "sharp";

const input = "output/report_screenshots/06-membership.png";
const output = "output/report_screenshots/06-membership-tight.png";

const image = sharp(input);
const meta = await image.metadata();

const height = Math.min(meta.height ?? 0, 1600);
if (!height || !meta.width) {
  throw new Error("Could not read screenshot dimensions.");
}

await image.extract({ left: 0, top: 0, width: meta.width, height }).toFile(output);
console.log(`Wrote ${output} (${meta.width}x${height})`);
