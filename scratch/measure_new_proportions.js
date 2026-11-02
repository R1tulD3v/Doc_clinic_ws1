const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const workspaceDir = path.resolve(__dirname, '..');
const indexHtml = path.resolve(workspaceDir, 'index.html');
const fileUrl = 'file:///' + indexHtml.replace(/\\/g, '/');

const testCss = `
<style>
@media (max-width: 980px) {
  .dd2-form-card {
    padding: 24px 22px 20px 22px !important;
    border-radius: 22px !important;
  }

  .dd2-form-head {
    margin-bottom: 14px !important;
  }

  .dd2-form-head h3 {
    font-size: 19.5px !important;
    line-height: 1.25 !important;
  }

  .dd2-form-head p {
    font-size: 13px !important;
    margin-top: 4px !important;
    line-height: 1.35 !important;
  }

  .dd2-form-body {
    margin-top: 14px !important;
  }

  .dd2-f-field {
    margin-bottom: 11px !important;
  }

  .dd2-f-icon {
    left: 15px !important;
    width: 16.5px !important;
    height: 16.5px !important;
  }

  .dd2-f-field input,
  .dd2-f-field select {
    height: 46px !important;
    border-radius: 14px !important;
    padding: 0 16px 0 42px !important;
    font-size: 14px !important;
  }

  .dd2-f-field select {
    background-position: right 15px center !important;
    padding-right: 38px !important;
  }

  .dd2-dt-trigger {
    min-height: 48px !important;
    border-radius: 14px !important;
    padding: 6px 14px 6px 42px !important;
    gap: 10px !important;
  }

  .dd2-dt-preview-date {
    font-size: 13px !important;
  }

  .dd2-dt-preview-time {
    font-size: 11.5px !important;
  }

  .dd2-f-submit {
    height: 46px !important;
    border-radius: 999px !important;
    font-size: 14.5px !important;
    padding: 4px 6px 4px 20px !important;
    margin-top: 14px !important;
  }

  .dd2-f-submit-circle {
    width: 36px !important;
    height: 36px !important;
  }

  .dd2-f-submit-circle svg {
    width: 14.5px !important;
    height: 14.5px !important;
  }
}
</style>
`;

let htmlContent = fs.readFileSync(indexHtml, 'utf8');
let testHtmlContent = htmlContent.replace('</head>', testCss + '</head>');
const testFile = path.resolve(workspaceDir, '_test_hero_prop.html');
fs.writeFileSync(testFile, testHtmlContent);

async function run() {
  const port = 9300;
  const tmpDir = path.resolve(__dirname, 'temp_cdp_hero_measure');
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

  const widths = [360, 375, 390, 430];
  for (const w of widths) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: w,
      height: 850,
      deviceScaleFactor: 2,
      mobile: true
    });

    await send('Page.navigate', { url: 'file:///' + testFile.replace(/\\/g, '/') });
    await new Promise(r => setTimeout(r, 1200));

    const metrics = await send('Runtime.evaluate', {
      expression: `(() => {
        const card = document.querySelector('.dd2-form-card');
        const form = document.querySelector('.dd2-form');
        const pill = document.querySelector('.dd2-trust-pill');
        const cRect = card.getBoundingClientRect();
        const fRect = form.getBoundingClientRect();
        const pRect = pill ? pill.getBoundingClientRect() : {};
        return {
          viewportW: window.innerWidth,
          formWidth: fRect.width,
          cardWidth: cRect.width,
          cardHeight: cRect.height,
          aspectRatio: (cRect.width / cRect.height).toFixed(2),
          pillWidth: pRect.width,
          pillTop: pRect.top,
          cardBottom: cRect.bottom,
          gapToPill: (pRect.top - cRect.bottom).toFixed(1)
        };
      })()`,
      returnByValue: true
    });

    console.log(`=== Viewport ${w}px ===`, metrics.result.value);

    // Scroll to hero book wrap
    await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.getElementById('hero-book-wrap');
        el.scrollIntoView({ block: 'center' });
      })()`
    });
    await new Promise(r => setTimeout(r, 300));

    const snap = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.resolve(__dirname, `hero_card_new_${w}.png`), Buffer.from(snap.data, 'base64'));
  }

  ws.close();
  chrome.kill();
  if (fs.existsSync(testFile)) fs.unlinkSync(testFile);
}

run().catch(console.error);
