const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');

const PORT = 3365;
const ROOT = path.resolve(__dirname, '..');

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(ROOT, reqPath);
  if (!fs.existsSync(filePath)) { res.writeHead(404); return res.end(); }
  fs.createReadStream(filePath).pipe(res);
});

async function run() {
  await new Promise(r => server.listen(PORT, r));
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-m-'));
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9228',
    '--disable-gpu',
    '--user-data-dir=' + tmpDir,
    '--no-first-run',
    'about:blank'
  ]);
  await new Promise(r => setTimeout(r, 1500));
  const listRes = await fetch('http://127.0.0.1:9228/json/list');
  const tabs = await listRes.json();
  const ws = new WebSocket(tabs[0].webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let id = 1;
  const pending = new Map();
  ws.onmessage = (evt) => {
    const msg = JSON.parse(evt.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    }
  };
  function send(method, params = {}) {
    return new Promise(resolve => {
      const msgId = id++;
      pending.set(msgId, resolve);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }
  await send('Page.enable');

  for (const w of [1280, 390]) {
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: 800, deviceScaleFactor: 1, mobile: w <= 768 });
    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/services.html` });
    await new Promise(r => setTimeout(r, 1500));
    const evalRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const getBox = sel => {
          const el = document.querySelector(sel);
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return { top: Math.round(r.top), left: Math.round(r.left), width: Math.round(r.width), height: Math.round(r.height), bottom: Math.round(r.bottom) };
        };
        return JSON.stringify({
          w: window.innerWidth,
          svh: getBox('.svh'),
          media: getBox('.svh__media'),
          in: getBox('.svh__in'),
          badge: getBox('.svh__badge-wrap')
        }, null, 2);
      })()`
    });
    console.log(evalRes.result.value);
  }

  ws.close();
  chrome.kill();
  server.close();
  process.exit(0);
}
run();
