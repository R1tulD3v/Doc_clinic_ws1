const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');

const PORT = 3363;
const ROOT = path.resolve(__dirname, '..');

const MIMES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(ROOT, reqPath);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404);
    return res.end('Not found');
  }
  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, { 'Content-Type': MIMES[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
});

async function main() {
  await new Promise(r => server.listen(PORT, r));
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-audit-'));
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9229',
    '--disable-gpu',
    '--user-data-dir=' + tmpDir,
    '--no-first-run',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1200));
  const listRes = await fetch('http://127.0.0.1:9229/json/list');
  const tabs = await listRes.json();
  const pageTab = tabs.find(t => t.type === 'page');
  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);

  let id = 1;
  const pending = new Map();
  ws.onmessage = (evt) => {
    const msg = JSON.parse(evt.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    }
  };

  await new Promise(r => ws.onopen = r);

  function send(method, params = {}) {
    return new Promise((resolve) => {
      const msgId = id++;
      pending.set(msgId, resolve);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  await send('Page.enable');

  const pages = [
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

  const renderedAudit = {};

  for (const p of pages) {
    await send('Page.navigate', { url: 'http://127.0.0.1:' + PORT + '/' + p });
    await new Promise(r => setTimeout(r, 600));

    const evalRes = await send('Runtime.evaluate', {
      expression: `
        (function() {
          // Count visible text Khagaria
          var bodyClone = document.body.cloneNode(true);
          // remove scripts, styles
          var scripts = bodyClone.querySelectorAll('script, style');
          scripts.forEach(s => s.remove());
          var text = bodyClone.innerText || '';
          var matches = text.match(/Khagaria/gi) || [];

          // Find implantologist in rendered page
          var impMatches = [];
          var paragraphs = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, span, a, td, th, div');
          paragraphs.forEach(el => {
            // direct text or small elements
            if (el.children.length === 0 && /implantologist/i.test(el.textContent)) {
              impMatches.push(el.textContent.trim());
            }
          });

          return {
            khagariaRenderedCount: matches.length,
            renderedImplantologist: [...new Set(impMatches)]
          };
        })()
      `,
      returnByValue: true
    });

    renderedAudit[p] = evalRes.result?.result?.value;
  }

  fs.writeFileSync(path.join(ROOT, 'scratch/rendered_audit.json'), JSON.stringify(renderedAudit, null, 2), 'utf8');

  ws.close();
  chrome.kill();
  server.close();
  try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (e) {}
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
