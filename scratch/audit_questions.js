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

console.log('=== PART 1: PHONE NUMBERS ===');
const phoneHits = [];
for (const f of files) {
  const rel = path.relative('.', f).replace(/\\/g, '/');
  const lines = fs.readFileSync(f, 'utf8').split('\n');
  lines.forEach((line, idx) => {
    if (/70912|99050/i.test(line)) {
      phoneHits.push({
        file: rel,
        line: idx + 1,
        content: line.trim()
      });
    }
  });
}

console.log(`Total phone mentions (70912 or 99050): ${phoneHits.length}`);
const mentions99050 = phoneHits.filter(h => h.content.includes('99050'));
console.log(`Mentions of 99050 57644: ${mentions99050.length}`);
mentions99050.forEach(h => console.log(`  [${h.file}:${h.line}] ${h.content}`));

// Inspect JSON-LD telephone fields
console.log('\n--- JSON-LD telephone fields across all HTML pages ---');
for (const f of files.filter(f => f.endsWith('.html'))) {
  const rel = path.relative('.', f).replace(/\\/g, '/');
  const content = fs.readFileSync(f, 'utf8');
  const scripts = content.match(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi) || [];
  scripts.forEach((s, sIdx) => {
    const jsonStr = s.replace(/<script[^>]*>|<\/script>/gi, '');
    try {
      const data = JSON.parse(jsonStr);
      function checkTel(obj, pathStr) {
        if (!obj || typeof obj !== 'object') return;
        if (obj['@type']) pathStr += ` [${obj['@type']}]`;
        if (obj.telephone) {
          console.log(`  ${rel} -> ${pathStr}: telephone = "${obj.telephone}"`);
        }
        for (const k in obj) {
          if (typeof obj[k] === 'object') {
            checkTel(obj[k], pathStr + `.${k}`);
          }
        }
      }
      checkTel(data, `script#${sIdx + 1}`);
    } catch(e) {}
  });
}

console.log('\n=== PART 2: FOLLOW-UP FEE FAQ ===');
// Search for follow-up fee FAQ across index.html, doctor.html, clinic-data.js, i18n.js
const followUpFiles = ['index.html', 'doctor.html', 'js/clinic-data.js', 'js/i18n.js'];
for (const f of followUpFiles) {
  if (fs.existsSync(f)) {
    const content = fs.readFileSync(f, 'utf8');
    const lines = content.split('\n');
    lines.forEach((l, idx) => {
      if (/follow-up|follow up|दोबारा फ़ीस|दोबारा फीस|25 days|25 दिन/i.test(l)) {
        console.log(`  [${f}:${idx + 1}] ${l.trim()}`);
      }
    });
  }
}

console.log('\n=== PART 3: CLINIC OPENING HOURS & HERO BADGE LOGIC ===');
// Check openingHoursSpecification in JSON-LD
for (const f of files.filter(f => f.endsWith('.html'))) {
  const rel = path.relative('.', f).replace(/\\/g, '/');
  const content = fs.readFileSync(f, 'utf8');
  if (content.includes('openingHoursSpecification') || content.includes('openingHours')) {
    console.log(`  File with openingHours in JSON-LD: ${rel}`);
  }
}

// Check opening hours in clinic-data.js
const clinicDataContent = fs.readFileSync('js/clinic-data.js', 'utf8');
const hoursMatches = clinicDataContent.split('\n').filter((l, idx) => /hours|schedule|opens|closes|Sunday|Monday/i.test(l));
console.log('\nHours in clinic-data.js:');
hoursMatches.slice(0, 15).forEach(l => console.log('  ' + l.trim()));

// Check hero badge logic in main.js
const mainJsContent = fs.readFileSync('js/main.js', 'utf8');
console.log('\nHero badge logic in main.js:');
const mainLines = mainJsContent.split('\n');
mainLines.forEach((l, idx) => {
  if (/open now|isOpen|schedule|badge|hero__status|until 7|hours/i.test(l)) {
    console.log(`  [main.js:${idx + 1}] ${l.trim()}`);
  }
});
