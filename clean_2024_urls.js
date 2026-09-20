import fs from 'fs';
import path from 'path';

const data = JSON.parse(fs.readFileSync('gallery_2024_2025_urls.json', 'utf8'));
const cleanData = {};

for (const cat in data) {
  const urls = data[cat];
  const fullResMap = new Map();

  for (const url of urls) {
    const cleanUrl = url.split('?')[0];
    // Strip WordPress thumbnail dimensions like -1920x1440.jpg, -600x600.jpg, -150x150.jpg, -300x300.jpg
    const origUrl = cleanUrl.replace(/-\d+x\d+(\.(?:jpg|jpeg|png|webp))$/i, '$1');
    const filename = path.basename(origUrl);

    if (!fullResMap.has(filename)) {
      fullResMap.set(filename, origUrl);
    }
  }

  cleanData[cat] = Array.from(fullResMap.values());
}

fs.writeFileSync('gallery_2024_2025_urls_clean.json', JSON.stringify(cleanData, null, 2));

let total = 0;
for (const cat in cleanData) {
  total += cleanData[cat].length;
  console.log(cat + ':', cleanData[cat].length);
}
console.log('CLEAN UNIQUE FULL-RES TOTAL:', total);
