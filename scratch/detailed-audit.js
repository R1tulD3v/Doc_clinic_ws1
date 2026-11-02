const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('treatments').filter(f => f.endsWith('.html'));
let out = '';

files.forEach(f => {
  const c = fs.readFileSync('treatments/' + f, 'utf8');
  const title = (c.match(/<title>([\s\S]*?)<\/title>/i) || [])[1] || '';
  const desc = (c.match(/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']/i) || [])[1] || '';
  const h1Match = c.match(/<h1[\s\S]*?>([\s\S]*?)<\/h1>/i);
  const h1 = h1Match ? h1Match[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';
  const h2s = [...c.matchAll(/<h2[\s\S]*?>([\s\S]*?)<\/h2>/gi)].map(m => m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
  
  out += '=== ' + f + ' ===\n';
  out += 'TITLE: ' + title.trim() + '\n';
  out += 'DESC: ' + desc.trim() + '\n';
  out += 'H1: ' + h1 + '\n';
  out += 'H2s: ' + JSON.stringify(h2s) + '\n\n';
});

fs.writeFileSync('scratch/detailed-audit.txt', out, 'utf8');
console.log('Done, wrote UTF-8');
