const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');

const PORT = 3399;
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
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-case-'));
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9249',
    '--disable-gpu',
    `--user-data-dir=${tmpDir}`,
    '--no-first-run',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1200));
  const listRes = await fetch('http://127.0.0.1:9249/json/list');
  const tabs = await listRes.json();
  const pageTab = tabs.find(t => t.type === 'page');
  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);

  let id = 1;
  const pending = new Map();
  ws.onmessage = (evt) => {
    const data = JSON.parse(evt.data);
    if (data.id && pending.has(data.id)) {
      const cb = pending.get(data.id);
      pending.delete(data.id);
      cb(data);
    }
  };

  const send = (method, params = {}) => new Promise((resolve) => {
    const msgId = id++;
    pending.set(msgId, resolve);
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });

  await new Promise(r => ws.onopen = r);
  await send('Page.enable');
  await send('DOM.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 2, mobile: false });

  // Case 1: default chip background, yellow stroke on icon, yellow star on 4.6
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/index.html` });
  await new Promise(r => setTimeout(r, 1600));
  await send('Runtime.evaluate', {
    expression: `
      const stat4 = document.querySelectorAll('#stats-container .stat')[3];
      const b = stat4.querySelector('b');
      b.innerHTML = '<span class="js-count" data-target="4.6" data-decimals="1">4.6</span><span style="color: #FBBC04; margin-left: 2px;">★</span>';
      const iconSpan = stat4.querySelector('.stat__icon');
      iconSpan.style.color = '#FBBC04';
    `
  });
  let shot = await send('Page.captureScreenshot', { clip: { x: 40, y: 580, width: 620, height: 180, scale: 2 } });
  fs.writeFileSync(path.join(__dirname, 'case1_default_chip.png'), Buffer.from(shot.result.data, 'base64'));

  // Case 2: warm chip background, yellow stroke on icon, yellow star on 4.6
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/index.html` });
  await new Promise(r => setTimeout(r, 1600));
  await send('Runtime.evaluate', {
    expression: `
      const stat4 = document.querySelectorAll('#stats-container .stat')[3];
      const b = stat4.querySelector('b');
      b.innerHTML = '<span class="js-count" data-target="4.6" data-decimals="1">4.6</span><span style="color: #FBBC04; margin-left: 2px;">★</span>';
      const iconSpan = stat4.querySelector('.stat__icon');
      iconSpan.style.color = '#FBBC04';
      iconSpan.style.background = 'rgba(251, 188, 4, 0.12)';
    `
  });
  shot = await send('Page.captureScreenshot', { clip: { x: 40, y: 580, width: 620, height: 180, scale: 2 } });
  fs.writeFileSync(path.join(__dirname, 'case2_warm_chip.png'), Buffer.from(shot.result.data, 'base64'));

  await send('Browser.close');
  chrome.kill();
  server.close();
  try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (e) {}
  console.log('Cases saved');
}
main().catch(console.error);
