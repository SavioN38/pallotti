import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

const data = JSON.parse(fs.readFileSync('scraped_new_galleries.json', 'utf8'));
const year2023 = data['2023-24'];

if (!year2023) {
  console.error('2023-24 data not found');
  process.exit(1);
}

const baseDir = path.join('public', 'images', 'gallery-2023-24');
fs.mkdirSync(baseDir, { recursive: true });

const tasks = [];

for (const cat of year2023.categories) {
  const catDir = path.join(baseDir, cat.name);
  fs.mkdirSync(catDir, { recursive: true });
  
  for (const url of cat.urls) {
    let fileName = path.basename(new URL(url).pathname);
    fileName = decodeURIComponent(fileName);
    const destPath = path.join(catDir, fileName);
    tasks.push({ url, destPath, fileName, catName: cat.name });
  }
}

console.log(`2023-2024 Gallery: ${year2023.categories.length} categories, ${tasks.length} images.`);

function downloadFile(url, destPath) {
  return new Promise((resolve) => {
    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 1000) {
      return resolve({ status: 'exists' });
    }

    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          redirectUrl = new URL(redirectUrl, url).toString();
        }
        return downloadFile(redirectUrl, destPath).then(resolve);
      }

      if (res.statusCode !== 200) {
        return resolve({ status: 'fail', code: res.statusCode, url });
      }

      const fileStream = fs.createWriteStream(destPath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve({ status: 'ok' });
      });
      fileStream.on('error', (err) => {
        fs.unlink(destPath, () => {});
        resolve({ status: 'error', error: err.message, url });
      });
    });

    req.on('error', (err) => {
      resolve({ status: 'error', error: err.message, url });
    });

    req.setTimeout(25000, () => {
      req.destroy();
      resolve({ status: 'timeout', url });
    });
  });
}

async function runPool(concurrency = 12) {
  let index = 0;
  let downloadedCount = 0;
  let existsCount = 0;
  let failedCount = 0;

  async function worker() {
    while (index < tasks.length) {
      const task = tasks[index++];
      const result = await downloadFile(task.url, task.destPath);
      if (result.status === 'ok') {
        downloadedCount++;
        if (downloadedCount % 50 === 0) {
          console.log(`Downloaded ${downloadedCount}/${tasks.length}...`);
        }
      } else if (result.status === 'exists') {
        existsCount++;
      } else {
        failedCount++;
      }
    }
  }

  const workers = Array.from({ length: concurrency }, () => worker());
  await Promise.all(workers);
  console.log(`2023-24 Finished! Downloaded: ${downloadedCount}, Existing: ${existsCount}, Failed: ${failedCount}`);
}

runPool(12);
