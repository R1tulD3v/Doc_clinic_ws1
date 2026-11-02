const fs = require('fs');
const path = require('path');

const dir = './treatments';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

function audit(name, filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const title = (content.match(/<title>([\s\S]*?)<\/title>/i) || [])[1] || '';
  const desc = (content.match(/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']/i) || [])[1] || '';
  const canon = (content.match(/<link\s+rel=["']canonical["']\s+href=["']([\s\S]*?)["']/i) || [])[1] || '';
  const h1Match = content.match(/<h1[\s\S]*?>([\s\S]*?)<\/h1>/i);
  const h1 = h1Match ? h1Match[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';
  const schemaMatches = [...content.matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi)];
  const schemas = schemaMatches.map(m => {
    try { return JSON.parse(m[1]); } catch(e) { return 'INVALID JSON'; }
  });
  const hasOg = content.includes('og:title');
  const imgAlts = [...content.matchAll(/<img[^>]+alt=["']([\s\S]*?)["']/gi)].map(m => m[1]);
  const hasBreadcrumbs = content.includes('breadcrumb') || content.includes('tp-breadcrumb');
  
  return {
    name,
    title: title.trim(),
    desc: desc.trim(),
    canon: canon.trim(),
    h1,
    schemasTypes: schemas.map(s => s['@type'] || (Array.isArray(s) ? 'Array' : typeof s)),
    hasOg,
    imgAlts,
    hasBreadcrumbs
  };
}

const results = [];
results.push(audit('services.html', './services.html'));
files.forEach(f => {
  results.push(audit(f, path.join(dir, f)));
});

fs.writeFileSync('./scratch/audit-results.json', JSON.stringify(results, null, 2));
console.log('Saved ' + results.length + ' results to scratch/audit-results.json');
