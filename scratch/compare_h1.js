const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');

const PORT = 3362;
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
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-h1-comp-'));
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9228',
    '--disable-gpu',
    '--user-data-dir=' + tmpDir,
    '--no-first-run',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1200));
  const listRes = await fetch('http://127.0.0.1:9228/json/list');
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

  const tests = [
    {
      page: 'treatments/root-canal-treatment.html',
      oldHtml: 'Root Canal Treatment for a <span class="grad">Healthier, Pain-Free</span> Smile',
      newHtml: 'Root Canal Treatment in Khagaria for a <span class="grad">Healthier Smile</span>'
    },
    {
      page: 'treatments/dental-implants.html',
      oldHtml: 'Permanent Dental Implants for a <span class="grad">Natural, Strong</span> Smile',
      newHtml: 'Dental Implants in Khagaria for a <span class="grad">Natural, Strong</span> Smile'
    },
    {
      page: 'treatments/orthodontics.html',
      oldHtml: 'Straighten Your Smile with <span class="grad">Certified Orthodontic</span> Braces',
      newHtml: 'Straighten Your Smile with <span class="grad">Braces in Khagaria</span>'
    }
  ];

  const viewports = [1440, 768, 360];
  const comparison = {};

  for (const t of tests) {
    comparison[t.page] = {};
    for (const vp of viewports) {
      await setViewport(vp, 900);
      await send('Page.navigate', { url: 'http://127.0.0.1:' + PORT + '/' + t.page });
      await new Promise(r => setTimeout(r, 400));

      const res = await send('Runtime.evaluate', {
        expression: `
          (function() {
            var h1 = document.querySelector('h1 .lang-en') || document.querySelector('h1');
            function measure(html) {
              h1.innerHTML = html;
              var comp = window.getComputedStyle(h1);
              var lh = parseFloat(comp.lineHeight) || (parseFloat(comp.fontSize) * 1.2);
              var h = h1.getBoundingClientRect().height;
              var lines = Math.round(h / lh);
              return { height: Math.round(h), lineHeight: Math.round(lh), lines: lines };
            }
            var mOld = measure(${JSON.stringify(t.oldHtml)});
            var mNew = measure(${JSON.stringify(t.newHtml)});
            return { old: mOld, new: mNew, diffLines: mNew.lines - mOld.lines };
          })()
        `,
        returnByValue: true
      });
      comparison[t.page][vp] = res.result?.result?.value;
    }
  }

  console.log(JSON.stringify(comparison, null, 2));

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
