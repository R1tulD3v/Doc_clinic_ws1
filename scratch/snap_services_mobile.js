const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const htmlPath = path.resolve(__dirname, '../index.html').replace(/\\/g, '/');
const fileUrl = 'file:///' + htmlPath;

async function capture(width, height, outFile) {
  const port = 9225;
  const tmpDir = path.resolve(__dirname, 'chrome-snap-user-dir');
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${tmpDir}`,
    `--window-size=${width},${height}`,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    fileUrl
  ]);

  let wsUrl = null;
  for (let i = 0; i < 25; i++) {
    await new Promise(r => setTimeout(r, 200));
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/list`);
      const list = await res.json();
      if (list && list.length && list[0].webSocketDebuggerUrl) {
        wsUrl = list[0].webSocketDebuggerUrl;
        break;
      }
    } catch (e) {}
  }

  if (!wsUrl) {
    chrome.kill();
    throw new Error('Could not connect to Chrome CDP');
  }

  const ws = new WebSocket(wsUrl);
  let id = 1;
  const pending = new Map();

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(msg.error);
      else resolve(msg.result);
    }
  };

  await new Promise(r => ws.onopen = r);

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const reqId = id++;
      pending.set(reqId, { resolve, reject });
      ws.send(JSON.stringify({ id: reqId, method, params }));
    });
  }

  await send('Page.enable');
  await send('Runtime.enable');
  await send('DOM.enable');

  await new Promise(r => setTimeout(r, 800));

  // Scroll to #services element
  const clip = await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.getElementById('services');
      if (!el) return null;
      el.scrollIntoView();
      const rect = el.getBoundingClientRect();
      return {
        x: 0,
        y: Math.max(0, rect.top + window.scrollY),
        width: ${width},
        height: Math.min(rect.height + 40, 900)
      };
    })()`,
    returnByValue: true
  });

  await new Promise(r => setTimeout(r, 300));

  // Capture screenshot of that clip or viewport
  const snap = await send('Page.captureScreenshot', {
    format: 'png',
    clip: clip.value ? {
      x: 0,
      y: 0, // already scrolled into view, wait, if scrolled into view rect.top is at top of viewport
      width: width,
      height: Math.round(clip.value.height),
      scale: 1
    } : undefined
  });

  fs.writeFileSync(outFile, Buffer.from(snap.data, 'base64'));
  console.log(`Saved ${outFile}`);

  ws.close();
  chrome.kill();
  await new Promise(r => setTimeout(r, 500));
}

async function main() {
  await capture(375, 812, path.resolve(__dirname, 'services_375_current.png'));
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
