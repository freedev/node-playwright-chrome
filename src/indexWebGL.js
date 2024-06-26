import 'dotenv/config'
import express from 'express'
const { webkit, chromium, firefox } = require('playwright');  // Or 'chromium' or 'firefox'.

const app = express()
app.use(express.static('static'))

var g_browser = null
var g_context = null
var g_page = null

app.listen(process.env.PORT, async () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
  // server ready to accept connections here
  g_browser = await chromium.launch( 
    // {headless: false}
  )
  console.log(`browser created`)
  g_context = await g_browser.newContext();
  g_page = await g_context.newPage();

  g_page.on('console', msg => console.log('PAGE LOG:', msg.text()))

  // Navigate the page to a URL
  console.log(`page created`)
  await g_page.goto('http://localhost:3000/webglSample/index.html')
  console.log(`sample loaded in page`)
  await renderTheCube(g_page, 0.5)
  console.log(`render complete`)
})

async function renderTheCube(page, rotation) {
  await page.evaluate((r) => {
    console.log(`received rotation ${cubeRotation}`)
    render(r)
  }, rotation)
}

app.get('/', async (req, res) => {

  let rotation = 0.5
  if (req.query.rotation) {
    rotation = parseFloat(req.query.rotation )
  }

  renderTheCube(g_page, rotation)

  const element = await g_page.$('#glcanvas')

  let opt = {
    type: 'png',
    encoding: 'binary',
    captureBeyondViewport: true
  }

  let resp = await element.screenshot(opt)

  console.log(rotation)

  res.type('png') // => 'image/png'
  res.header({'Cache-Control':'no-store, no-cache, must-revalidate, proxy-revalidate'})
  res.send(resp)
})
