import fs from 'fs';

const data = JSON.parse(fs.readFileSync('gallery_scanned.json', 'utf8'));

let tsContent = `export interface GalleryPhoto {
  src: string;
  category: string;
  globalIndex: number;
}

export interface GalleryCategory {
  name: string;
  slug: string;
  photos: GalleryPhoto[];
  cover: string;
}

export const GALLERY_YEARS = [
  { slug: '2025-26', label: '2025 — 2026', active: true },
  { slug: '2024-25', label: '2024 — 2025', active: true },
  { slug: '2023-24', label: '2023 — 2024', active: true },
  { slug: '2022-23', label: '2022 — 2023', active: false },
  { slug: '2021-22', label: '2021 — 2022', active: false },
  { slug: '2020-21', label: '2020 — 2021', active: false },
  { slug: '2019-20', label: '2019 — 2020', active: false },
] as const;

function gallerySrc(yearFolder: string, categoryName: string, fileName: string): string {
  const folder = encodeURI(categoryName).replace(/#/g, '%23');
  const file = encodeURI(fileName).replace(/#/g, '%23');
  const base = import.meta.env.BASE_URL.replace(/\\/$/, '');
  return \`\${base}/images/\${yearFolder}/\${folder}/\${file}\`;
}

const YEAR_DATA: Record<string, { folder: string; categories: { name: string; files: string[] }[] }> = {
`;

for (const year of ['2025-26', '2024-25', '2023-24']) {
  const yearFolder = `gallery-${year}`;
  const cats = data[year] || {};
  tsContent += `  '${year}': {\n    folder: '${yearFolder}',\n    categories: [\n`;
  for (const cat in cats) {
    const files = cats[cat];
    tsContent += `      {\n        name: ${JSON.stringify(cat)},\n        files: ${JSON.stringify(files, null, 10).replace(/\n/g, '\n        ')},\n      },\n`;
  }
  tsContent += `    ],\n  },\n`;
}

tsContent += `};

export function buildGalleryCategories(year: string): GalleryCategory[] {
  const yearConfig = YEAR_DATA[year];
  if (!yearConfig) return [];
  
  let gi = 0;
  return yearConfig.categories.map((c, idx) => {
    const slug = c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + \`-\${idx}\`;
    const photos: GalleryPhoto[] = c.files.map((f) => ({
      src: gallerySrc(yearConfig.folder, c.name, f),
      category: c.name,
      globalIndex: gi++,
    }));
    return {
      name: c.name,
      slug,
      photos,
      cover: photos[0]?.src || "",
    };
  });
}

export function getAllPhotosForYear(year: string): GalleryPhoto[] {
  return buildGalleryCategories(year).flatMap((c) => c.photos);
}
`;

fs.writeFileSync('src/data/gallery.ts', tsContent, 'utf8');
console.log('Successfully generated src/data/gallery.ts');
