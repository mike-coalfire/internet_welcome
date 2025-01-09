const express = require('express');
const app = express();

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
  res.send(`<html><body>Welcome, ${name}!<p>IP: ${req.ip}<p>Headers: ${req.headers['user-agent']}<p>Time: ${Date.now() - req.requestTime} ms</body></html>`);
});

app.get('/', (req, res) => {
  res.sendFile('index.html',{ root: __dirname });
});

app.listen(port, () => {
  console.log('Server started on port: ', port);
});
