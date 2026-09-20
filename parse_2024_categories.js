import fs from 'fs';

const html = fs.readFileSync('gallery_2024_2025.html', 'utf8');

// Filter valid titles: must be inside h1/h2/h3 tags and not be pure numbers or filenames
const titleRegex = /<h[1-3][^>]*>(.*?)<\/h[1-3]>/gi;
const imgRegex = /https:\/\/www\.pallottihillmukkam\.org\/wp-content\/uploads\/[^\s"'<>]+\.(?:jpg|jpeg|png|webp)/gi;

const headings = [];
let match;
while ((match = titleRegex.exec(html)) !== null) {
  let text = match[1].replace(/<[^>]+>/g, '').trim().replace(/&amp;/g, '&').replace(/&#8217;/g, "'").replace(/&#8211;/g, "-");
  
  // Ignore noise titles
  if (
    text &&
    text.length > 2 &&
    !text.toLowerCase().includes('gallery 2024') &&
    !text.toLowerCase().includes('copyright') &&
    !text.toLowerCase().includes('menu') &&
    !/^\d+$/.test(text) &&
    !/^\d+_\d+/.test(text) &&
    !text.includes('_n')
  ) {
    headings.push({ index: match.index, text });
  }
}

const categoryMap = {};

for (let i = 0; i < headings.length; i++) {
  const current = headings[i];
  const next = headings[i + 1];
  const slice = html.substring(current.index, next ? next.index : html.length);
  const imgs = [...slice.matchAll(imgRegex)].map(m => m[0]);
  const uniqueImgs = [...new Set(imgs)].filter(url => !url.includes('logo') && !url.includes('favicon'));
  if (uniqueImgs.length > 0) {
    categoryMap[current.text] = uniqueImgs;
  }
}

console.log('Clean 2024-2025 categories count:', Object.keys(categoryMap).length);
console.log('Categories list:\n', Object.keys(categoryMap).join('\n'));

fs.writeFileSync('gallery_2024_2025_urls.json', JSON.stringify(categoryMap, null, 2));
