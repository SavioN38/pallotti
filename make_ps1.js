import fs from 'fs';
import path from 'path';

const data = JSON.parse(fs.readFileSync('scraped_new_galleries.json', 'utf8'));

let psScript = `$ErrorActionPreference = 'SilentlyContinue'\n\n`;

for (const [yearSlug, yearObj] of Object.entries(data)) {
  const baseDir = `public/images/${yearObj.folder}`;
  
  for (const cat of yearObj.categories) {
    const catDir = `${baseDir}/${cat.name}`;
    psScript += `New-Item -ItemType Directory -Force -Path "${catDir}" | Out-Null\n`;
    
    for (const url of cat.urls) {
      let fileName = path.basename(new URL(url).pathname);
      if (!fileName || fileName.length === 0) continue;
      // normalize jfif_.jpg
      fileName = fileName.replace(/jfif_\.jpg$/i, 'jpg');
      const destPath = `${catDir}/${fileName}`;
      
      psScript += `if (-not (Test-Path -LiteralPath "${destPath}")) {\n`;
      psScript += `  try {\n`;
      psScript += `    Invoke-WebRequest -Uri "${url}" -OutFile "${destPath}" -UserAgent "Mozilla/5.0" -TimeoutSec 30\n`;
      psScript += `    Write-Host "Downloaded: ${yearSlug} -> ${fileName}"\n`;
      psScript += `  } catch {\n`;
      psScript += `    Write-Host "Failed: ${url}" -ForegroundColor Red\n`;
      psScript += `  }\n`;
      psScript += `}\n`;
    }
  }
}

fs.writeFileSync('download_new_galleries.ps1', psScript, 'utf8');
console.log('Created download_new_galleries.ps1');
