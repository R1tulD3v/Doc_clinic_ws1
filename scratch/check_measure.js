const { spawn } = require('child_process');
const path = require('path');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const htmlPath = 'file:///' + path.resolve(__dirname, '../index.html').replace(/\\/g, '/');

async function test(w) {
  const port = 9235;
  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--user-data-dir=' + path.resolve(__dirname, 'temp_cdp'),
    `--window-size=${w},800`,
    htmlPath
  ]);
  
  let wsUrl = null;
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 200));
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/list`);
      const list = await res.json();
      if (list && list[0] && list[0].webSocketDebuggerUrl) {
        wsUrl = list[0].webSocketDebuggerUrl;
        break;
      }
    } catch (e) {}
  }
  
  if (!wsUrl) {
    chrome.kill();
    return;
  }
  
  const ws = new WebSocket(wsUrl);
  await new Promise(r => ws.onopen = r);
  let id = 1;
  const send = (m, p={}) => new Promise(res => {
    const cur = id++;
    const h = (e) => {
      const d = JSON.parse(e.data);
      if (d.id === cur) { ws.removeEventListener('message', h); res(d.result); }
    };
    ws.addEventListener('message', h);
    ws.send(JSON.stringify({id: cur, method: m, params: p}));
  });
  
  await send('Page.enable');
  await send('Page.navigate', { url: htmlPath });
  await new Promise(r => setTimeout(r, 1500));
  
  const evalRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const row = document.querySelector('.svc__row');
      const cards = document.getElementById('services-container');
      const cardList = [...document.querySelectorAll('.svc-card')];
      const winW = window.innerWidth;
      const bodyW = document.body.clientWidth;
      const rowRect = row ? row.getBoundingClientRect() : {};
      const cardsRect = cards ? cards.getBoundingClientRect() : {};
      const cList = cardList.map(c => {
        const r = c.getBoundingClientRect();
        return { w: r.width, left: r.left, right: r.right };
      });
      const cs = cards ? window.getComputedStyle(cards) : null;
      return JSON.stringify({
        winW,
        bodyW,
        cardsFound: !!cards,
        cardCount: cardList.length,
        rowRect: row ? { w: rowRect.width, left: rowRect.left, right: rowRect.right } : null,
        cardsRect: cards ? {
          w: cardsRect.width,
          scrollW: cards.scrollWidth,
          clientW: cards.clientWidth,
          left: cardsRect.left,
          right: cardsRect.right,
          pl: cs ? cs.paddingLeft : null,
          pr: cs ? cs.paddingRight : null,
          ml: cs ? cs.marginLeft : null,
          mr: cs ? cs.marginRight : null
        } : null,
        cList
      }, null, 2);
    })()`,
    returnByValue: true
  });
  
  console.log(`=== Viewport ${w} ===\n`, evalRes);
  ws.close();
  chrome.kill();
  await new Promise(r => setTimeout(r, 400));
}

async function main() {
  await test(360);
  await test(375);
  await test(390);
  await test(430);
}

main();
