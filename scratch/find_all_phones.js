const fs = require('fs');
const path = require('path');

const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== 'scratch') walk(full);
    } else if (entry.isFile()) {
      if (entry.name.endsWith('.html') || entry.name.endsWith('.js') || entry.name.endsWith('.xml') || entry.name.endsWith('.json')) {
        files.push(full);
      }
    }
  }
}
walk('.');

const results = [];

for (const f of files) {
  const rel = path.relative('.', f).replace(/\\/g, '/');
  const lines = fs.readFileSync(f, 'utf8').split('\n');
  lines.forEach((line, idx) => {
    // Look for 70912 or 99050
    if (/70912|99050/i.test(line)) {
      let num = '';
      if (/70912\s*38383/i.test(line) || /7091238383/i.test(line)) {
        num = '70912 38383';
      }
      if (/99050\s*57644/i.test(line) || /9905057644/i.test(line)) {
        if (num) num += ' & 99050 57644';
        else num = '99050 57644';
      }
      
      let context = 'visible text';
      if (line.includes('<meta')) context = 'meta tag';
      else if (line.includes('"telephone"') || line.includes('"@type"') || (idx < 60 && line.includes('{') && f.endsWith('.html'))) context = 'JSON-LD';
      else if (f === 'js/clinic-data.js') context = 'clinic-data.js config/FAQ';
      else if (f === 'js/layout.js') context = 'layout.js (header/footer/nav/fabs)';
      else if (f === 'js/i18n.js') context = 'i18n.js';
      else if (line.includes('href="tel:') || line.includes('href="https://wa.me')) {
        if (line.includes('class="btn') || line.includes('class="hdr') || line.includes('<a') || line.includes('<p')) context = 'HTML link / visible text';
      }

      results.push({
        file: rel,
        line: idx + 1,
        number: num || '70912 / 99050 match',
        context,
        text: line.trim()
      });
    }
  });
}

fs.writeFileSync('scratch/all_phone_occurrences.json', JSON.stringify(results, null, 2), 'utf8');
console.log('Saved', results.length, 'phone occurrences to scratch/all_phone_occurrences.json');
