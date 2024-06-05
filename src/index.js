import 'dotenv/config'
import express from 'express'
const { webkit, chromium, firefox } = require('playwright');  // Or 'chromium' or 'firefox'.
 
const app = express()

app.get('/', async (req, res) => {

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(`chrome://gpu`)
  let opt = {
    type: 'png',
    fullPage: true,
    encoding: 'binary',
    captureBeyondViewport: true
  }
  let resp = await page.screenshot(opt);
  await page.close()
  await browser.close();

  res.type('png') // => 'image/png'
  res.send(resp)
})

app.listen(process.env.PORT, async () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
  // server ready to accept connections here
})
