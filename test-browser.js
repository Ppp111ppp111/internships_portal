const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(`Console Error: ${msg.text()}`);
    }
  });
  page.on('pageerror', err => {
    errors.push(`Page Error: ${err.toString()}`);
  });
  page.on('requestfailed', request => {
    errors.push(`Request Failed: ${request.url()} - ${request.failure()?.errorText}`);
  });

  try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle2', timeout: 10000 });
  } catch (e) {
    errors.push(`Navigation Error: ${e.toString()}`);
  }

  await page.screenshot({ path: '/Users/pradipmacair1/.gemini/antigravity-ide/brain/fef5bbbc-d9fb-48b7-9e44-d4cfa9fbe74d/screenshot.png', fullPage: true });

  console.log('--- BROWSER ERRORS ---');
  if (errors.length > 0) {
    console.log(errors.join('\n'));
  } else {
    console.log('No errors found.');
  }
  
  const html = await page.content();
  console.log('Page length:', html.length);
  const h1 = await page.evaluate(() => document.querySelector('h1')?.innerText);
  console.log('H1:', h1);

  await browser.close();
})();
