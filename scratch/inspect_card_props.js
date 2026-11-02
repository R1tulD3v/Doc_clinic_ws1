const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const workspaceDir = path.resolve(__dirname, '..');
const indexHtml = path.resolve(workspaceDir, 'index.html');
const fileUrl = 'file:///' + indexHtml.replace(/\\/g, '/');

async function run() {
  const port = 9295;
  const tmpDir = path.resolve(__dirname, 'temp_cdp_hero_props');
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

  const extractProps = `(() => {
    const card = document.querySelector('.dd2-form-card');
    const form = document.querySelector('.dd2-form');
    const head = document.querySelector('.dd2-form-head');
    const title = document.querySelector('.dd2-form-head h3');
    const sub = document.querySelector('.dd2-form-head p');
    const inputs = [...document.querySelectorAll('.dd2-f-field input, .dd2-f-field select')];
    const trigger = document.querySelector('.dd2-dt-trigger');
    const submit = document.querySelector('.dd2-f-submit');
    const fields = [...document.querySelectorAll('.dd2-f-field')];

    const cStyle = window.getComputedStyle(card);
    const hStyle = window.getComputedStyle(head);
    const tStyle = window.getComputedStyle(title);
    const sStyle = window.getComputedStyle(sub);
    const trigStyle = trigger ? window.getComputedStyle(trigger) : {};
    const subStyle = submit ? window.getComputedStyle(submit) : {};

    return {
      viewportWidth: window.innerWidth,
      formWidth: form ? form.getBoundingClientRect().width : null,
      cardWidth: card ? card.getBoundingClientRect().width : null,
      cardHeight: card ? card.getBoundingClientRect().height : null,
      cardPadding: cStyle.padding,
      cardBorderRadius: cStyle.borderRadius,
      headMarginBottom: hStyle.marginBottom,
      titleFontSize: tStyle.fontSize,
      titleLineHeight: tStyle.lineHeight,
      subFontSize: sStyle.fontSize,
      subMarginTop: sStyle.marginTop,
      fieldsMarginBottom: fields.map(f => window.getComputedStyle(f).marginBottom),
      inputHeights: inputs.map(i => i.getBoundingClientRect().height),
      inputFontSizes: inputs.map(i => window.getComputedStyle(i).fontSize),
      inputPadding: inputs.map(i => window.getComputedStyle(i).padding),
      inputBorderRadius: inputs.map(i => window.getComputedStyle(i).borderRadius),
      triggerMinHeight: trigStyle.minHeight,
      triggerPadding: trigStyle.padding,
      submitHeight: subStyle.height,
      submitFontSize: subStyle.fontSize,
      submitPadding: subStyle.padding,
      submitMarginTop: subStyle.marginTop
    };
  })()`;

  // Desktop
  await send('Page.navigate', { url: fileUrl });
  await new Promise(r => setTimeout(r, 1200));
  const desktopData = await send('Runtime.evaluate', { expression: extractProps, returnByValue: true });

  // Mobile 375px
  await send('Emulation.setDeviceMetricsOverride', {
    width: 375,
    height: 812,
    deviceScaleFactor: 2,
    mobile: true
  });
  await send('Page.navigate', { url: fileUrl });
  await new Promise(r => setTimeout(r, 1200));
  const mobileData = await send('Runtime.evaluate', { expression: extractProps, returnByValue: true });

  console.log('=== DESKTOP APPOINTMENT CARD PROPORTIONS ===');
  console.log(JSON.stringify(desktopData.result.value, null, 2));

  console.log('\n=== CURRENT MOBILE APPOINTMENT CARD PROPORTIONS (375px) ===');
  console.log(JSON.stringify(mobileData.result.value, null, 2));

  ws.close();
  chrome.kill();
}

run().catch(console.error);
