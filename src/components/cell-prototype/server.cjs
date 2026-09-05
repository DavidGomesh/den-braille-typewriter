const http = require('http');
const fs = require('fs');
const path = require('path');
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(fs.readFileSync(path.join(__dirname, 'index.html')));
}).listen(3001, '127.0.0.1', () => console.log('Protótipo: http://localhost:3001/den-braille-typewriter/free?variant=B'));
