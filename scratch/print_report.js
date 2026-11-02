const fs = require('fs');
const res = JSON.parse(fs.readFileSync('scratch/full_audit_results.json', 'utf8'));

let out = '';
out += '=== IMPLANTOLOGIST OCCURRENCES ===\n';
res.implantologistHits.forEach((h, i) => {
  out += `${i + 1}. [${h.file} (Line ${h.lineNum}) - ${h.location}]\n   "${h.context}"\n\n`;
});

out += '\n=== CLAIM WORDS OCCURRENCES ===\n';
res.claimWordsHits.forEach((h, i) => {
  out += `${i + 1}. [${h.file} (Line ${h.lineNum}) - [${h.matchedWords.join(', ')}] - ${h.location}]\n   "${h.sentence}"\n\n`;
});

out += '\n=== SITEMAP URLS ===\n';
res.sitemapUrls.forEach((u, i) => {
  out += `${i + 1}. ${u}\n`;
});

out += '\n=== CANONICALS, OG:URL, JSON-LD PER PAGE ===\n';
for (const [p, info] of Object.entries(res.pageAudit)) {
  out += `\n--- ${p} ---\n`;
  out += `Title (${info.titleLen} chars): "${info.title}"\n`;
  out += `Meta Description (${info.metaDescLen} chars): "${info.metaDesc}"\n`;
  out += `Canonical: ${info.canonical}\n`;
  out += `og:url: ${info.ogUrl}\n`;
  out += `JSON-LD URLs:\n` + info.jsonLdUrls.map(u => `  - ${u}`).join('\n') + '\n';
  out += `Visible "Khagaria" count: static body = ${info.khagariaCount}\n`;
}

fs.writeFileSync('scratch/report_summary.txt', out, 'utf8');
console.log('Summary written to scratch/report_summary.txt');
