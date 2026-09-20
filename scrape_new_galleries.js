import fs from 'fs';
import path from 'path';

const years = [
  { slug: '2026-27', folder: 'gallery-2026-27', url: 'https://www.pallottihillmukkam.org/gallery-2026-2027/' },
  { slug: '2023-24', folder: 'gallery-2023-24', url: 'https://www.pallottihillmukkam.org/gallery-2023-2024/' },
  { slug: '2022-23', folder: 'gallery-2022-23', url: 'https://www.pallottihillmukkam.org/gallery-2022-2023/' },
  { slug: '2021-22', folder: 'gallery-2021-22', url: 'https://www.pallottihillmukkam.org/gallery-2021-2022/' },
];

function sanitizeName(name) {
  return name.replace(/[<>:"/\\|?*]/g, '').trim();
}

function cleanImageUrl(url) {
  return url.replace(/-\d+x\d+(\.[a-zA-Z]+)$/, '$1');
}

async function scrapeAll() {
  const allYearData = {};

  for (const y of years) {
    console.log(`Fetching HTML for ${y.slug}...`);
    const res = await fetch(y.url);
    const html = await res.text();
    fs.writeFileSync(`gallery_${y.slug}.html`, html, 'utf8');

    // Parse sections
    const sectionRegex = /<div class="grve-section[\s\S]*?(?=<div class="grve-section|<\/div>\s*<!-- end #grve-theme-wrapper|$)/gi;
    const h2Regex = /<h2[^>]*>(.*?)<\/h2>/i;
    const aImgRegex = /<a[^>]+href="([^"]+\.(?:jpg|jpeg|png|webp|jfif|jfif_\.jpg))"/gi;

    const categories = [];
    let secMatch;

    while ((secMatch = sectionRegex.exec(html)) !== null) {
      const sectionHtml = secMatch[0];
      const h2Match = h2Regex.exec(sectionHtml);
      if (!h2Match) continue;

      let catName = h2Match[1].replace(/<[^>]+>/g, '').trim();
      catName = catName.replace(/&amp;/g, '&').replace(/&#8211;/g, '-').replace(/&#8217;/g, "'").replace(/&#038;/g, '&');
      catName = sanitizeName(catName);
      if (!catName || catName.length < 2) continue;

      const imgUrls = [];
      let imgMatch;
      while ((imgMatch = aImgRegex.exec(sectionHtml)) !== null) {
        let u = imgMatch[1];
        if (u.startsWith('//')) u = 'https:' + u;
        if (!u.includes('/wp-content/uploads/')) continue;
        const clean = cleanImageUrl(u);
        if (!imgUrls.includes(clean)) {
          imgUrls.push(clean);
        }
      }

      if (imgUrls.length > 0) {
        categories.push({
          name: catName,
          urls: imgUrls
        });
      }
    }

    console.log(`${y.slug}: found ${categories.length} categories, total ${categories.reduce((acc, c) => acc + c.urls.length, 0)} images.`);
    allYearData[y.slug] = {
      folder: y.folder,
      categories
    };
  }

  fs.writeFileSync('scraped_new_galleries.json', JSON.stringify(allYearData, null, 2), 'utf8');
  console.log('Saved scraped_new_galleries.json');
}

scrapeAll();
