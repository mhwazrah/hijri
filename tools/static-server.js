/* Minimal static file server for local preview (service workers need http://). */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5050;
const ROOT = path.join(__dirname, '..');
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/' || urlPath.endsWith('/')) urlPath += 'index.html';
  const filePath = path.join(ROOT, urlPath);
  fs.readFile(filePath, (err, buf) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(filePath)] || 'application/octet-stream' });
    res.end(buf);
  });
}).listen(PORT, () => console.log(`Static server on http://localhost:${PORT}`));
