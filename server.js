const express = require('express');
const app = express();

const crypto = require('crypto');
const port = process.env.PORT || 8000

const requestTime = function (req, res, next) {
  req.requestTime = Date.now()
  next()
}

app.use(requestTime)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.post('/submit', (req, res) => {
  const name = req.body.name;
  console.log(`Received request from ${req.ip} with browser ${req.headers['user-agent']}`);
  console.log(`Time to display page: ${Date.now() - req.requestTime} ms`);
  res.send(`<html><body><textarea style="width: 500px; height: 24px;">Welcome, ${name}!</textarea><p>IP: ${req.ip}<p>Headers: ${req.headers['user-agent']}<p>Time: ${Date.now() - req.requestTime} ms</body></html>`);
});

app.get('/', (req, res) => {
  res.sendFile('index.html',{ root: __dirname });
});

app.get('/generateHashes/:size', async (req, res) => {
  const size = parseInt(req.params.size, 10);

  if (isNaN(size) || size <= 0) {
    return res
      .status(400)
      .send('Invalid size. Please provide a positive integer.');
  }

  const startTime = process.hrtime(); // Start time for generation
  const hashes = generateRandomHashes(size);
  const generationEndTime = process.hrtime(startTime); // End time for generation
  const generationTimeMs = generationEndTime[0] * 1000 + generationEndTime[1] / 1000000;

  const requestStartTime = Date.now(); // Start time for request

  // Simulate some server-side rendering time (replace with actual rendering)
  await new Promise((resolve) => setTimeout(resolve, 50)); // Simulate 50ms render time

  const renderEndTime = Date.now(); // End time for rendering
  const renderTime = renderEndTime - requestStartTime + generationTimeMs;

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>SHA256 Hash Generator</title>
    </head>
    <body>
      <h1>SHA256 Input: Output</h1>
      <p>Number of hashes generated: ${size}</p>
      <p>Generation Time: ${generationTimeMs.toFixed(2)} ms</p>
      <p>Render Time: ${renderTime} ms</p>
      <pre>${JSON.stringify(hashes, null, 2)}</pre>
    </body>
    </html>
  `);
});

function generateRandomHashes(count) {
  const hashes = [];
  for (let i = 0; i < count; i++) {
    const input = crypto.randomBytes(20).toString('hex'); // Generate random input
    const hash = crypto.createHash('sha256').update(input).digest('hex');
    hashes.push(`${input}: ${hash}`);
  }
  return hashes;
}



app.listen(port, () => {
  console.log('Server started on port: ', port);
});
