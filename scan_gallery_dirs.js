import fs from 'fs';
import path from 'path';

function getCategoryFiles(yearFolder) {
  const dirPath = path.join('public', 'images', yearFolder);
  if (!fs.existsSync(dirPath)) return {};
  
  const categories = fs.readdirSync(dirPath, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  const result = {};
  for (const cat of categories) {
    const catPath = path.join(dirPath, cat);
    const files = fs.readdirSync(catPath)
      .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
    result[cat] = files;
  }
  return result;
}

const cats2025 = getCategoryFiles('gallery-2025-26');
const cats2024 = getCategoryFiles('gallery-2024-25');

console.log('2025-26 categories on disk:', Object.keys(cats2025).length);
console.log('2024-25 categories on disk:', Object.keys(cats2024).length);

fs.writeFileSync('gallery_scanned.json', JSON.stringify({ '2025-26': cats2025, '2024-25': cats2024 }, null, 2));
