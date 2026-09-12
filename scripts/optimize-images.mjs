import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const inputDir = path.resolve('images');
const outputDir = path.join(inputDir, 'optimized');
const supported = new Set(['.jpg', '.jpeg', '.png', '.webp']);

await fs.mkdir(outputDir, { recursive: true });
const files = await fs.readdir(inputDir, { withFileTypes: true });

for (const file of files) {
  if (!file.isFile() || !supported.has(path.extname(file.name).toLowerCase())) continue;

  const source = path.join(inputDir, file.name);
  const target = path.join(outputDir, `${path.parse(file.name).name}.webp`);
  const isAvatar = file.name === 'IMG_20260407_143323.jpg';
  const maxWidth = isAvatar ? 900 : 1600;

  await sharp(source)
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality: isAvatar ? 78 : 82, effort: 4 })
    .toFile(target);

  const { size } = await fs.stat(target);
  console.log(`${file.name} -> optimized/${path.basename(target)} (${Math.round(size / 1024)} KB)`);
}
