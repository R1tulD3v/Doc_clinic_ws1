const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  const filePath = 'file://' + path.resolve(__dirname, '../index.html').replace(/\\/g, '/');
  
  const viewports = [
    { width: 1280, height: 800, name: 'desktop_1280' },
    { width: 375, height: 667, name: 'mobile_375' },
    { width: 390, height: 844, name: 'mobile_390' },
    { width: 430, height: 932, name: 'mobile_430' }
  ];

  for (const vp of viewports) {
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 2 });
    await page.goto(filePath, { waitUntil: 'networkidle0' });
    
    const metrics = await page.evaluate(() => {
      const sec = document.querySelector('.clinic-video-sec');
      const wrapper = document.querySelector('.clinic-video-wrapper');
      const video = document.querySelector('.clinic-video-player');
      const awardsSec = document.querySelector('#awards');
      const awardsEyebrow = document.querySelector('#awards .eyebrow');

      const secRect = sec.getBoundingClientRect();
      const wrapperRect = wrapper.getBoundingClientRect();
      const videoRect = video.getBoundingClientRect();
      const awardsSecRect = awardsSec.getBoundingClientRect();
      const awardsEyebrowRect = awardsEyebrow.getBoundingClientRect();

      const secStyle = window.getComputedStyle(sec);
      const awardsStyle = window.getComputedStyle(awardsSec);

      return {
        secPaddingTop: secStyle.paddingTop,
        secPaddingBottom: secStyle.paddingBottom,
        awardsPaddingTop: awardsStyle.paddingTop,
        videoBottomToAwardsTop: awardsSecRect.top - wrapperRect.bottom,
        videoBottomToAwardsEyebrow: awardsEyebrowRect.top - wrapperRect.bottom,
        secBottomToAwardsTop: awardsSecRect.top - secRect.bottom,
        videoWrapperHeight: wrapperRect.height,
        videoWrapperWidth: wrapperRect.width
      };
    });

    console.log(`\n=== Viewport ${vp.name} (${vp.width}px) ===`);
    console.log(JSON.stringify(metrics, null, 2));

    // Scroll to video section and take screenshot
    await page.evaluate(() => {
      document.querySelector('#clinic-video').scrollIntoView({ block: 'center' });
    });
    await new Promise(r => setTimeout(r, 300));
    await page.screenshot({ path: path.resolve(__dirname, `video_spacing_${vp.name}.png`) });
  }

  await browser.close();
})();
