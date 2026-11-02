const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// Find all HTML files
const htmlFiles = [
  'index.html',
  'doctor.html',
  'services.html',
  'contact.html',
  'privacy-policy.html',
  'terms.html',
  'treatments/cast-partial-denture.html',
  'treatments/ceramic-crown-and-bridge.html',
  'treatments/childrens-dentistry.html',
  'treatments/complete-denture.html',
  'treatments/dental-implants.html',
  'treatments/filling-of-decayed-teeth.html',
  'treatments/oral-lesions-diagnosis.html',
  'treatments/orthodontics.html',
  'treatments/periodontal-flap-surgery.html',
  'treatments/removable-partial-denture.html',
  'treatments/root-canal-treatment.html',
  'treatments/teeth-cleaning-scaling.html',
  'treatments/teeth-whitening.html'
];

const jsFiles = [
  'js/clinic-data.js',
  'js/i18n.js',
  'js/layout.js',
  'js/main.js'
];

function extractSentences(text, wordRegex) {
  // Split into rough sentences by ., !, ?, newline, or HTML tag boundaries
  const rawSentences = text
    .replace(/<[^>]+>/g, ' . ') // replace tags with sentence boundary
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .split(/(?<=[.!?\n\r])\s+/);

  const matched = [];
  for (let s of rawSentences) {
    let clean = s.trim().replace(/\s+/g, ' ');
    if (wordRegex.test(clean)) {
      matched.push(clean);
    }
  }
  return matched;
}

// 1 & 2: Search for target words
const implantologistHits = [];
const claimWordsHits = [];
const targetWordsRegex = /\b(painless|pain-free|cure|best|guarantee)\b/i;
const implantRegex = /implantologist/i;

// Also extract visible text, titles, metas, canonicals, og:urls, json-ld
const pageAudit = {};

for (const relPath of htmlFiles) {
  const fullPath = path.join(ROOT, relPath);
  const content = fs.readFileSync(fullPath, 'utf8');

  // Title
  const titleMatch = content.match(/<title>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';

  // Meta description
  const metaDescMatch = content.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i) ||
                        content.match(/<meta\s+content=["']([^"']*)["']\s+name=["']description["']/i);
  const metaDesc = metaDescMatch ? metaDescMatch[1].trim() : '';

  // Canonical
  const canonicalMatch = content.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i) ||
                         content.match(/<link\s+href=["']([^"']*)["']\s+rel=["']canonical["']/i);
  const canonical = canonicalMatch ? canonicalMatch[1].trim() : '';

  // og:url
  const ogUrlMatch = content.match(/<meta\s+property=["']og:url["']\s+content=["']([^"']*)["']/i) ||
                     content.match(/<meta\s+content=["']([^"']*)["']\s+property=["']og:url["']/i);
  const ogUrl = ogUrlMatch ? ogUrlMatch[1].trim() : '';

  // JSON-LD urls
  const jsonLdUrls = [];
  const jsonLdMatches = content.match(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi) || [];
  for (const scriptTag of jsonLdMatches) {
    const jsonStr = scriptTag.replace(/<script[^>]*>|<\/script>/gi, '');
    try {
      const parsed = JSON.parse(jsonStr);
      function findUrls(obj) {
        if (!obj || typeof obj !== 'object') return;
        for (let k in obj) {
          if (k === 'url' || k === '@id') {
            if (typeof obj[k] === 'string' && obj[k].startsWith('http')) {
              jsonLdUrls.push(obj[k]);
            }
          }
          findUrls(obj[k]);
        }
      }
      findUrls(parsed);
    } catch(e) {}
  }

  // Visible text: remove <head>, <script>, <style>
  const bodyOnly = content
    .replace(/<head[\s\S]*?<\/head>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');

  const visibleTextOnly = bodyOnly
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ');

  // Count Khagaria in visible text (case insensitive)
  const khagariaMatches = visibleTextOnly.match(/\bKhagaria\b/gi) || [];
  const khagariaCount = khagariaMatches.length;

  pageAudit[relPath] = {
    title,
    titleLen: title.length,
    metaDesc,
    metaDescLen: metaDesc.length,
    canonical,
    ogUrl,
    jsonLdUrls: [...new Set(jsonLdUrls)],
    khagariaCount
  };

  // Find implantologist in entire page content
  // We want page, exact sentence/context, and location (meta, JSON-LD, visible)
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (implantRegex.test(line)) {
      let loc = 'visible text';
      if (idx < 50 && (line.includes('<meta') || line.includes('<title'))) loc = 'meta/head';
      else if (line.includes('application/ld+json') || (idx < 70 && line.includes('"@type"'))) loc = 'JSON-LD';
      
      implantologistHits.push({
        file: relPath,
        lineNum: idx + 1,
        location: loc,
        context: line.trim()
      });
    }

    if (targetWordsRegex.test(line)) {
      // ignore inside html tags / class names / script src unless it's visible content or meta
      // check if it's visible text or meta or schema
      let loc = 'visible text';
      if (line.includes('<meta') || line.includes('<title')) loc = 'meta/head';
      else if (line.includes('application/ld+json') || line.includes('"@type"') || line.includes('"description"')) loc = 'JSON-LD';
      
      // clean sentence
      const cleanLine = line.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      if (targetWordsRegex.test(cleanLine)) {
        claimWordsHits.push({
          file: relPath,
          lineNum: idx + 1,
          location: loc,
          matchedWords: cleanLine.match(/\b(painless|pain-free|cure|best|guarantee)\b/gi),
          sentence: cleanLine
        });
      }
    }
  });
}

// Check JS files as well
for (const relPath of jsFiles) {
  const fullPath = path.join(ROOT, relPath);
  const content = fs.readFileSync(fullPath, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (implantRegex.test(line)) {
      implantologistHits.push({
        file: relPath,
        lineNum: idx + 1,
        location: 'JavaScript / data',
        context: line.trim()
      });
    }
    if (targetWordsRegex.test(line)) {
      const clean = line.trim();
      claimWordsHits.push({
        file: relPath,
        lineNum: idx + 1,
        location: 'JavaScript / data',
        matchedWords: clean.match(/\b(painless|pain-free|cure|best|guarantee)\b/gi),
        sentence: clean
      });
    }
  });
}

// Read sitemap.xml
const sitemapPath = path.join(ROOT, 'sitemap.xml');
let sitemapUrls = [];
if (fs.existsSync(sitemapPath)) {
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
  const locMatches = sitemapContent.match(/<loc>([^<]*)<\/loc>/gi) || [];
  sitemapUrls = locMatches.map(m => m.replace(/<loc>|<\/loc>/gi, '').trim());
}

fs.writeFileSync(path.join(ROOT, 'scratch/full_audit_results.json'), JSON.stringify({
  pageAudit,
  sitemapUrls,
  implantologistHits,
  claimWordsHits
}, null, 2), 'utf8');

console.log('Audit complete, written to scratch/full_audit_results.json');
