import fs from 'fs';

const html = fs.readFileSync('gallery_2024_2025.html', 'utf8');

// Match gallery container blocks or headings
// Let's inspect elements with class or data attributes
const blockRegex = /<div[^>]*class="[^"]*elementor-widget-container[^"]*"[^>]*>([\s\S]*?)<\/div>/gi;

// Also look for image URLs
const imgRegex = /https:\/\/www\.pallottihillmukkam\.org\/wp-content\/uploads\/[^\s"'<>]+\.(?:jpg|jpeg|png|webp)/gi;
const matches = [...html.matchAll(imgRegex)].map(m => m[0]);
const uniqueUrls = [...new Set(matches)];

console.log('Total unique image URLs:', uniqueUrls.length);

// Extract headings
const catRegex = /<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi;
const headings = [];
let m;
while ((m = catRegex.exec(html)) !== null) {
  const text = m[1].replace(/<[^>]+>/g, '').trim();
  if (text && text.length > 2 && !text.includes('Copyright') && !text.includes('Menu')) {
    headings.push(text);
  }
}
console.log('Headings found:', headings);
