const fs = require('fs');
const path = require('path');

const files = [
  'index.html',
  'products/bqs/index.html',
  'products/vis/index.html',
  'products/vcs/index.html',
  'products/gs/index.html'
];

let issues = [];

files.forEach(relPath => {
  const filePath = path.join(__dirname, relPath);
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  const fileDir = path.dirname(filePath);

  // Check 1: hrefs
  const hrefRegex = /href=["']([^"']*)["']/g;
  let match;
  while ((match = hrefRegex.exec(content)) !== null) {
    const href = match[1];
    const lineNum = content.substring(0, match.index).split('\n').length;
    
    if (href === '#' || href === '') {
      issues.push({ file: relPath, line: lineNum, type: 'EMPTY_OR_HASH_LINK', detail: `href="${href}"` });
    } else if (href.startsWith('#')) {
      const targetId = href.substring(1);
      if (!content.includes(`id="${targetId}"`) && !content.includes(`id='${targetId}'`)) {
        issues.push({ file: relPath, line: lineNum, type: 'BROKEN_LOCAL_ANCHOR', detail: `href="${href}"` });
      }
    } else if (!href.startsWith('http://') && !href.startsWith('https://') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
      const [filePart, hashPart] = href.split('#');
      const targetPath = path.resolve(fileDir, filePart);
      if (!fs.existsSync(targetPath)) {
        issues.push({ file: relPath, line: lineNum, type: 'BROKEN_FILE_LINK', detail: `href="${href}" -> ${targetPath}` });
      } else if (hashPart) {
        const targetContent = fs.readFileSync(targetPath, 'utf8');
        if (!targetContent.includes(`id="${hashPart}"`) && !targetContent.includes(`id='${hashPart}'`)) {
          issues.push({ file: relPath, line: lineNum, type: 'BROKEN_CROSS_ANCHOR', detail: `href="${href}" (id #${hashPart} missing)` });
        }
      }
    }
  }

  // Check 2: onclick location
  const onclickRegex = /onclick=["']([^"']*)["']/g;
  while ((match = onclickRegex.exec(content)) !== null) {
    const onclick = match[1];
    const lineNum = content.substring(0, match.index).split('\n').length;
    const locMatch = onclick.match(/location\.href=['"]([^'"]+)['"]/);
    if (locMatch) {
      const targetUrl = locMatch[1];
      const [filePart, hashPart] = targetUrl.split('#');
      const targetPath = path.resolve(fileDir, filePart);
      if (!fs.existsSync(targetPath)) {
        issues.push({ file: relPath, line: lineNum, type: 'BROKEN_ONCLICK_LINK', detail: `onclick="${onclick}" -> ${targetPath}` });
      }
    }
  }
});

console.log('TOTAL ISSUES FOUND:', issues.length);
console.log(JSON.stringify(issues, null, 2));
