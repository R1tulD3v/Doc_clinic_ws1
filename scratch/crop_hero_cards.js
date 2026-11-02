const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const workspaceDir = path.resolve(__dirname, '..');
const indexHtml = path.resolve(workspaceDir, 'index.html');
const fileUrl = 'file:///' + indexHtml.replace(/\\/g, '/');

async function run() {
  const port = 9290;
  const tmpDir = path.resolve(__dirname, 'temp_cdp_hero');
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--user-data-dir=' + tmpDir,
    '--disable-gpu',
    'about:blank'
  ]);

  let wsUrl = null;
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 200));
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/list`);
      const list = await res.json();
      const page = list.find(t => t.type === 'page');
      if (page && page.webSocketDebuggerUrl) {
        wsUrl = page.webSocketDebuggerUrl;
        break;
      }
    } catch (e) {}
  }

  const ws = new WebSocket(wsUrl);
  await new Promise(r => ws.onopen = r);
  let id = 1;
  const send = (m, p={}) => new Promise((resolve, reject) => {
    const cur = id++;
    const h = (e) => {
      const d = JSON.parse(e.data);
      if (d.id === cur) {
        ws.removeEventListener('message', h);
        if (d.error) reject(new Error(JSON.stringify(d.error)));
        else resolve(d.result);
      }
    };
    ws.addEventListener('message', h);
    ws.send(JSON.stringify({id: cur, method: m, params: p}));
  });

  await send('Page.enable');

  // Desktop clip capture of form
  await send('Page.navigate', { url: fileUrl });
  await new Promise(r => setTimeout(r, 1500));
  const dClip = await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.getElementById('hero-book-wrap');
      el.scrollIntoView({ block: 'center' });
      const r = el.getBoundingClientRect();
      return { x: Math.max(0, r.left - 15), y: Math.max(0, r.top - 15), width: r.width + 30, height: r.height + 30, scale: 1 };
    })()`,
    returnByValue: true
  });
  const snapD = await send('Page.captureScreenshot', { format: 'png', clip: dClip.result.value });
  fs.writeFileSync(path.resolve(__dirname, 'hero_card_desktop_crop.png'), Buffer.from(snapD.data, 'base64'));

  // Mobile 375px clip capture of form
  await send('Emulation.setDeviceMetricsOverride', {
    width: 375,
    height: 812,
    deviceScaleFactor: 2,
    mobile: true
  });
  await send('Page.navigate', { url: fileUrl });
  await new Promise(r => setTimeout(r, 1500));
  const mClip = await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.getElementById('hero-book-wrap');
      el.scrollIntoView({ block: 'center' });
      const r = el.getBoundingClientRect();
      return { x: 0, y: Math.max(0, r.top - 10), width: 375, height: r.height + 20, scale: 1 };
    })()`,
    returnByValue: true
  });
  const snapM = await send('Page.captureScreenshot', { format: 'png', clip: mClip.result.value });
  fs.writeFileSync(path.resolve(__dirname, 'hero_card_mobile_crop.png'), Buffer.from(snapM.data, 'base64'));

  ws.close();
  chrome.kill();
  console.log('Cropped screenshots saved!');
}

run().catch(console.error);
