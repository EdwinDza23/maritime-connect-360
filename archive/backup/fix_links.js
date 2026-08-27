const fs = require('fs');
const path = require('path');

const rootDir = __dirname;

// Helper to create standardized header for product subpages (vis, vcs, gs)
function buildProductHeader(activeModule) {
  return `  <!-- NAVIGATION -->
  <header style="position: sticky; top: 0; z-index: 1000; background: var(--surface-translucent, rgba(10, 15, 29, 0.85)); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.08));">
    <nav class="nav-fixed" id="main-nav" aria-label="Main Navigation" style="max-width: 1280px; margin: 0 auto; padding: 16px 24px; display: flex; align-items: center; justify-content: space-between;">
      <a href="../../index.html" class="nav-logo" aria-label="MC360 Home">
        <img src="../../assets/logos/MC360logo.png" alt="MC360" style="height:34px;width:auto">
      </a>

      <!-- Desktop Nav Items -->
      <div class="nav-links" id="nav-links" style="display: flex; gap: 24px; align-items: center;">
        <a href="../../index.html" class="nav-link">Home</a>
        
        <!-- Products Dropdown -->
        <div class="nav-dd-wrap" id="dd-products-wrap" style="position: relative;">
          <button class="nav-link ${activeModule ? 'active' : ''}" id="dd-products-btn" aria-haspopup="true" aria-expanded="false">
            Products
            <span class="nav-chevron">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </span>
          </button>
          <div class="nav-dropdown dd-products" id="dd-products" role="menu">
            <div class="dd-section-label">Modules</div>
            <div class="dd-grid">
              <a href="../bqs/index.html" class="dd-product-card ${activeModule === 'bqs' ? 'active-product' : ''}" role="menuitem">
                <span class="dd-product-icon" style="background:#e8f4fd">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a73e8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 22V8a2 2 0 012-2h8a2 2 0 012 2v14" />
                    <path d="M3 22h12M9 6V3M15 8h2a2 2 0 012 2v3a2 2 0 01-2 2h-2" />
                    <path d="M19 15v4a2 2 0 01-2 2" />
                    <rect x="6" y="10" width="6" height="4" rx="1" />
                  </svg>
                </span>
                <div>
                  <div class="dd-product-name">Bunker Quantity Survey</div>
                  <div class="dd-product-desc">Measurement, quantity verification and reports</div>
                </div>
              </a>
              <a href="../vis/index.html" class="dd-product-card ${activeModule === 'vis' ? 'active-product' : ''}" role="menuitem">
                <span class="dd-product-icon" style="background:#eef4ff">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3C50E0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="6" y="3" width="12" height="18" rx="2" />
                    <path d="M9 3V2a1 1 0 011-1h4a1 1 0 011 1v1" />
                    <path d="M9 12l2 2 4-4" />
                    <path d="M9 17h4" />
                  </svg>
                </span>
                <div>
                  <div class="dd-product-name">Vessel Inspection</div>
                  <div class="dd-product-desc">Digital checklists, photo evidence, compliance reports</div>
                </div>
              </a>
              <a href="../vcs/index.html" class="dd-product-card ${activeModule === 'vcs' ? 'active-product' : ''}" role="menuitem">
                <span class="dd-product-icon" style="background:#fff3e8">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e67e22" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M2 20h20" />
                    <path d="M5 20V10l7-7 7 7v10" />
                    <path d="M9 20v-5h6v5" />
                  </svg>
                </span>
                <div>
                  <div class="dd-product-name">Vessel Condition Survey</div>
                  <div class="dd-product-desc">Deficiency tracking and corrective action workflows</div>
                </div>
              </a>
              <a href="../gs/index.html" class="dd-product-card ${activeModule === 'gs' ? 'active-product' : ''}" role="menuitem">
                <span class="dd-product-icon" style="background:#eef4ff">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4338CA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="5" y="2" width="14" height="20" rx="2" />
                    <path d="M9 7h6M9 11h6M9 15h4" />
                  </svg>
                </span>
                <div>
                  <div class="dd-product-name">Global Sanctions</div>
                  <div class="dd-product-desc">Real-time OFAC, EU, UN screening across 50+ lists</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        <a href="../../index.html#compliance" class="nav-link">Security</a>
        <a href="../../index.html#pricing" class="nav-link">Pricing</a>
      </div>

      <!-- Actions -->
      <div class="nav-actions">
        <a href="../../index.html#cta" class="btn-secondary nav-btn">Book Demo</a>
        <a href="../../index.html#cta" class="btn-primary nav-btn">Start Free Trial</a>
      </div>
    </nav>
  </header>`;
}

// 1. FIX index.html
let indexContent = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');

// Update dd-products links in index.html
indexContent = indexContent.replace(
  /<a href="#modules" class="dd-product-card" role="menuitem">(\s*<span class="dd-product-icon"[^>]*>[\s\S]*?<div class="dd-product-name">Vessel Inspection<\/div>)/,
  '<a href="products/vis/index.html" class="dd-product-card" role="menuitem">$1'
);

indexContent = indexContent.replace(
  /<a href="#modules" class="dd-product-card" role="menuitem">(\s*<span class="dd-product-icon"[^>]*>[\s\S]*?<div class="dd-product-name">Vessel Condition Survey<\/div>)/,
  '<a href="products/vcs/index.html" class="dd-product-card" role="menuitem">$1'
);

indexContent = indexContent.replace(
  /<a href="#modules" class="dd-product-card" role="menuitem">(\s*<span class="dd-product-icon"[^>]*>[\s\S]*?<div class="dd-product-name">Global Sanctions<\/div>)/,
  '<a href="products/gs/index.html" class="dd-product-card" role="menuitem">$1'
);

// Update mobile menu links in index.html
indexContent = indexContent.replace(
  /<div class="mob-subsection" id="mob-products-sub">[\s\S]*?<\/div>/,
  `<div class="mob-subsection" id="mob-products-sub">
      <a href="products/bqs/index.html" class="mob-sub-item">Bunker Quantity Survey</a>
      <a href="products/vis/index.html" class="mob-sub-item">Vessel Inspection</a>
      <a href="products/vcs/index.html" class="mob-sub-item">Vessel Condition Survey</a>
      <a href="products/gs/index.html" class="mob-sub-item">Global Sanctions</a>
    </div>`
);

// Update nav-demo-btn in index.html
indexContent = indexContent.replace('href="#" class="nav-demo" id="nav-demo-btn"', 'href="#cta" class="nav-demo" id="nav-demo-btn"');

// Add id="demo" and id="trial" to section #cta in index.html
indexContent = indexContent.replace('<section class="s-cta" id="cta"', '<section class="s-cta" id="cta"><div id="demo"></div><div id="trial"></div>');

// Update footer href="#" in index.html to #compliance or #cta
indexContent = indexContent.replace(/<a href="#" class="footer-link">Privacy Policy<\/a>/, '<a href="#compliance" class="footer-link">Privacy Policy</a>');
indexContent = indexContent.replace(/<a href="#" class="footer-link">Terms of Service<\/a>/, '<a href="#compliance" class="footer-link">Terms of Service</a>');
indexContent = indexContent.replace(/<a href="#" class="footer-link">Cookie Settings<\/a>/, '<a href="#compliance" class="footer-link">Cookie Settings</a>');

fs.writeFileSync(path.join(rootDir, 'index.html'), indexContent, 'utf8');
console.log('Fixed index.html links and dropdowns');


// 2. FIX products/bqs/index.html
let bqsContent = fs.readFileSync(path.join(rootDir, 'products/bqs/index.html'), 'utf8');

// Replace dd-products links in bqs page
bqsContent = bqsContent.replace(
  /<a href="#modules" class="dd-product-card" role="menuitem">(\s*<span class="dd-product-icon"[^>]*>[\s\S]*?<div class="dd-product-name">Vessel Inspection<\/div>)/,
  '<a href="../vis/index.html" class="dd-product-card" role="menuitem">$1'
);

bqsContent = bqsContent.replace(
  /<a href="#modules" class="dd-product-card" role="menuitem">(\s*<span class="dd-product-icon"[^>]*>[\s\S]*?<div class="dd-product-name">Vessel Condition Survey<\/div>)/,
  '<a href="../vcs/index.html" class="dd-product-card" role="menuitem">$1'
);

bqsContent = bqsContent.replace(
  /<a href="#modules" class="dd-product-card" role="menuitem">(\s*<span class="dd-product-icon"[^>]*>[\s\S]*?<div class="dd-product-name">Global Sanctions<\/div>)/,
  '<a href="../gs/index.html" class="dd-product-card" role="menuitem">$1'
);

// Update mobile menu links in bqs page
bqsContent = bqsContent.replace(
  /<div class="mob-subsection" id="mob-customers-sub">[\s\S]*?<\/div>\s*<\/div>/,
  (m) => {
    return m;
  }
);

bqsContent = bqsContent.replace(
  /<a href="index\.html" class="mob-sub-item">Bunker Quantity Survey<\/a>\s*<a href="#modules" class="mob-sub-item">Vessel Inspection<\/a>\s*<a href="#modules" class="mob-sub-item">Vessel Condition Survey<\/a>\s*<a href="#modules" class="mob-sub-item">Global Sanctions<\/a>/,
  `<a href="index.html" class="mob-sub-item">Bunker Quantity Survey</a>
      <a href="../vis/index.html" class="mob-sub-item">Vessel Inspection</a>
      <a href="../vcs/index.html" class="mob-sub-item">Vessel Condition Survey</a>
      <a href="../gs/index.html" class="mob-sub-item">Global Sanctions</a>`
);

// Update header and hero button href="#" in BQS page to #cta
bqsContent = bqsContent.replace('href="#" class="nav-demo" id="nav-demo-btn"', 'href="#cta" class="nav-demo" id="nav-demo-btn"');
bqsContent = bqsContent.replace('href="#" class="nav-trial" id="nav-trial-btn"', 'href="#cta" class="nav-trial" id="nav-trial-btn"');
bqsContent = bqsContent.replace('href="#" class="btn btn-primary btn-lg" id="hero-trial-btn"', 'href="#cta" class="btn btn-primary btn-lg" id="hero-trial-btn"');
bqsContent = bqsContent.replace('href="#" class="btn btn-secondary btn-lg" id="hero-demo-btn"', 'href="#cta" class="btn btn-secondary btn-lg" id="hero-demo-btn"');

// Replace feature card href="#" links in BQS page
bqsContent = bqsContent.replace(/href="#" class="feat-card-link"/g, 'href="#cta" class="feat-card-link"');

fs.writeFileSync(path.join(rootDir, 'products/bqs/index.html'), bqsContent, 'utf8');
console.log('Fixed products/bqs/index.html links and dropdowns');


// 3. UPDATE products/vis/index.html, products/vcs/index.html, products/gs/index.html
function updatePlaceholderPage(moduleCode, title, desc) {
  const filePath = path.join(rootDir, `products/${moduleCode}/index.html`);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace header navigation block
  const navHeaderRegex = /<!-- NAVIGATION -->[\s\S]*?<!-- HERO PLACEHOLDER -->/;
  const newHeader = buildProductHeader(moduleCode) + '\n\n  <!-- HERO PLACEHOLDER -->';
  content = content.replace(navHeaderRegex, newHeader);

  // Fix CTA buttons in body
  content = content.replace('href="../../index.html#demo"', 'href="../../index.html#cta"');
  content = content.replace('href="../../index.html#trial"', 'href="../../index.html#cta"');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated products/${moduleCode}/index.html header and links`);
}

updatePlaceholderPage('vis', 'Vessel Inspection System (VIS)', 'Automate checklist management, inspector assignments, and compliance evidence workflows.');
updatePlaceholderPage('vcs', 'Vessel Condition Survey (VCS)', 'Comprehensive condition scoring, defect tracking, and corrective action workflows.');
updatePlaceholderPage('gs', 'Global Sanctions & Guidance System (GS)', 'Real-time counterparty screening and automated maritime regulatory compliance alerts.');

console.log('All link fixes applied successfully!');
