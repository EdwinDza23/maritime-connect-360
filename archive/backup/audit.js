const fs = require('fs');
const path = require('path');

const htmlFiles = [
  'index.html',
  'products/bqs/index.html',
  'products/vis/index.html',
  'products/vcs/index.html',
  'products/gs/index.html'
];

htmlFiles.forEach(relPath => {
  const filePath = path.join(__dirname, relPath);
  if (!fs.existsSync(filePath)) {
    console.log(`[MISSING FILE] ${relPath}`);
    return;
  }
  const fileDir = path.dirname(filePath);
  const content = fs.readFileSync(filePath, 'utf8');

  console.log(`\n==============================================`);
  console.log(`AUDITING FILE: ${relPath}`);
  console.log(`==============================================`);

  // Extract all hrefs
  const hrefMatches = [...content.matchAll(/href=["']([^"']+)["']/g)];
  console.log(`\n--- HREF Links (${hrefMatches.length}) ---`);
  hrefMatches.forEach(m => {
    const val = m[1];
    let status = 'OK';
    let target = val;

    if (val.startsWith('#')) {
      // Check element ID in the same file
      const targetId = val.substring(1);
      if (targetId && !content.includes(`id="${targetId}"`) && !content.includes(`id='${targetId}'`)) {
        status = `BROKEN ANCHOR (#${targetId} not found in ${relPath})`;
      }
    } else if (val.startsWith('http://') || val.startsWith('https://') || val.startsWith('mailto:') || val.startsWith('tel:')) {
      status = 'EXTERNAL LINK';
    } else {
      // Relative file path
      const [filePathOnly, hash] = val.split('#');
      const resolvedPath = path.resolve(fileDir, filePathOnly);
      if (!fs.existsSync(resolvedPath)) {
        status = `BROKEN FILE PATH (${filePathOnly} does not exist at ${resolvedPath})`;
      } else if (hash) {
        const targetContent = fs.readFileSync(resolvedPath, 'utf8');
        if (!targetContent.includes(`id="${hash}"`) && !targetContent.includes(`id='${hash}'`)) {
          status = `BROKEN HASH ANCHOR (#${hash} not found in ${filePathOnly})`;
        }
      }
    }
    console.log(`Href: "${val}" -> ${status}`);
  });

  // Extract all src attributes (images, scripts, videos)
  const srcMatches = [...content.matchAll(/src=["']([^"']+)["']/g)];
  console.log(`\n--- SRC Assets (${srcMatches.length}) ---`);
  srcMatches.forEach(m => {
    const val = m[1];
    let status = 'OK';
    if (!val.startsWith('http') && !val.startsWith('data:')) {
      const resolvedPath = path.resolve(fileDir, val);
      if (!fs.existsSync(resolvedPath)) {
        status = `BROKEN ASSET (${val} does not exist at ${resolvedPath})`;
      }
    } else {
      status = 'EXTERNAL/DATA';
    }
    console.log(`Src: "${val}" -> ${status}`);
  });

  // Extract inline onclick handlers (e.g. window.location.href)
  const onclickMatches = [...content.matchAll(/onclick=["']([^"']+)["']/g)];
  console.log(`\n--- ONCLICK Handlers (${onclickMatches.length}) ---`);
  onclickMatches.forEach(m => {
    const val = m[1];
    console.log(`Onclick: "${val}"`);
    const locMatch = val.match(/location\.href=['"]([^'"]+)['"]/);
    if (locMatch) {
      const targetUrl = locMatch[1];
      const [filePathOnly, hash] = targetUrl.split('#');
      const resolvedPath = path.resolve(fileDir, filePathOnly);
      let status = 'OK';
      if (!fs.existsSync(resolvedPath)) {
        status = `BROKEN ONCLICK TARGET (${filePathOnly} does not exist at ${resolvedPath})`;
      }
      console.log(`  -> Target: "${targetUrl}" -> ${status}`);
    }
  });

  // Check product dropdown items specifically
  console.log(`\n--- DROPDOWN CHECK ---`);
  const dropdownMatch = content.match(/id=["']dd-products["'][\s\S]*?<\/div>\s*<\/div>/);
  if (dropdownMatch) {
    console.log(`Product dropdown HTML found in ${relPath}`);
  } else {
    console.log(`Product dropdown HTML NOT FOUND in ${relPath}`);
  }
});
