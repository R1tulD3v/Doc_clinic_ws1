const fs = require('fs');
const content = fs.readFileSync('treatments/root-canal-treatment.html', 'utf8');
const links = [...content.matchAll(/href=["']([^"']+)["']/gi)].map(m => m[1]);
console.log('Links in root-canal-treatment.html:', [...new Set(links)]);

const files = fs.readdirSync('treatments').filter(f => f.endsWith('.html'));
files.forEach(f => {
  const c = fs.readFileSync('treatments/' + f, 'utf8');
  const l = [...c.matchAll(/href=["']([^"']+)["']/gi)].map(m => m[1]);
  const hasRelated = c.includes('related') || c.includes('tp-related') || c.includes('other-treatments');
  console.log(f, 'links count:', l.length, 'hasRelatedSection:', hasRelated);
});
