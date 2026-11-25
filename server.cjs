const http = require('node:http');

http.createServer((request, response) => {
  if (request.method !== 'GET' || request.url !== '/health') {
    response.writeHead(404).end();
    return;
  }

  setTimeout(() => {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ status: 'ok' }));
  }, 100);
}).listen(3202, '127.0.0.1', () => console.log('Lab server listening on port 3202'));
