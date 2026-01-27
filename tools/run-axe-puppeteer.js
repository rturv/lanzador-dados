#!/usr/bin/env node
// Run axe-core accessibility audit against the running dev server using Puppeteer
// Usage:
// 1. Start the dev server: `npm run dev` (keep it running)
// 2. In another terminal run: `node tools/run-axe-puppeteer.js`
// The script opens http://localhost:5173, injects axe, and prints violations.

const puppeteer = require('puppeteer');

async function run(){
  const url = process.env.URL || 'http://localhost:5173';
  console.log(`Opening ${url} (ensure dev server is running)`);
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

  // Inject axe
  await page.addScriptTag({ url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.7.2/axe.min.js' });

  // Run axe
  const results = await page.evaluate(async () => {
    return await window.axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2aa'] }
    });
  });

  const viol = results.violations || [];
  console.log(`axe violations: ${viol.length}`);
  for(const v of viol){
    console.log('\n--------------------------------------------------');
    console.log(`${v.id} — ${v.impact} — ${v.help}`);
    console.log(v.description);
    for(const node of v.nodes){
      console.log(`  Target: ${node.target.join(' | ')}`);
      console.log(`  Failure summary: ${node.failureSummary || node.html}`);
    }
  }

  await browser.close();
  if(viol.length>0) process.exitCode = 2;
}

run().catch(err=>{ console.error(err); process.exit(1) });
