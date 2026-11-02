const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');

const PORT = 3348;
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
  console.log(`Server listening at http://127.0.0.1:${PORT}`);

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-verify-'));
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9224',
    '--disable-gpu',
    `--user-data-dir=${tmpDir}`,
    '--no-first-run',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1200));

  const listRes = await fetch('http://127.0.0.1:9224/json/list');
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

  async function setViewport(w, h) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: w,
      height: h,
      deviceScaleFactor: 1,
      mobile: w <= 768
    });
  }

  const pagesToTest = [
    'index.html',
    'doctor.html',
    'contact.html',
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

  const viewports = [1440, 768, 360];
  const results = {};

  for (const p of pagesToTest) {
    results[p] = {};
    for (const vp of viewports) {
      await setViewport(vp, 900);
      await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/${p}` });
      // Wait for layout injection and scroll down to load all images
      await new Promise(r => setTimeout(r, 600));

      // Force-load all images and wait for layout
      await send('Runtime.evaluate', {
        expression: `
          (async function() {
            window.scrollTo(0, document.body.scrollHeight);
            const imgs = Array.from(document.querySelectorAll('img'));
            await Promise.all(imgs.map(img => {
              if (img.complete && img.naturalWidth !== 0) return Promise.resolve();
              return new Promise(r => {
                img.addEventListener('load', r, { once: true });
                img.addEventListener('error', r, { once: true });
                // If it has loading=lazy, force eager temporarily to measure rendered size accurately
                img.loading = 'eager';
              });
            }));
            await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
          })()
        `,
        awaitPromise: true
      });

      const evalRes = await send('Runtime.evaluate', {
        expression: `
          (function() {
            var imgs = document.querySelectorAll('img');
            var out = [];
            for (var i = 0; i < imgs.length; i++) {
              var img = imgs[i];
              var r = img.getBoundingClientRect();
              out.push({
                src: img.getAttribute('src') || '',
                className: img.className || '',
                parentClass: (img.parentElement ? img.parentElement.className : '') || '',
                renderedWidth: Math.round(r.width * 10) / 10,
                renderedHeight: Math.round(r.height * 10) / 10
              });
            }
            return JSON.stringify(out);
          })()
        `,
        returnByValue: true
      });

      const raw = evalRes.result?.result?.value;
      const parsed = raw ? JSON.parse(raw) : [];
      parsed.forEach((img, idx) => {
        // Unique selector key: parentClass + src + idx
        const key = `${img.parentClass} > ${img.src}`;
        if (!results[p][key]) {
          results[p][key] = {
            src: img.src,
            className: img.className,
            parentClass: img.parentClass,
            sizes: {}
          };
        }
        results[p][key].sizes[vp] = {
          w: img.renderedWidth,
          h: img.renderedHeight
        };
      });
    }
  }

  const outPath = path.join(__dirname, process.argv[2] || 'loaded_measurements.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`Saved measurements to ${outPath}`);

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
