const http = require('http');
const port = process.env.PORT || 3000;
const fs = require('fs');
const path = require('path');

const staticPath = './public';

function getFilePath(url) {
  if (url === '/') {
    url = 'index.html';  
  }
  return path.join(staticPath, url);
}

function getContentType(filePath) {
  let extname = path.extname(filePath);
  switch (extname) {
    case '.js':
      return 'text/javascript';
    case '.css':
      return 'text/css';
    case '.json':
      return 'application/json';
    case '.png':
      return 'image/png';
    case '.jpg':
      return 'image/jpg';
    default:
      return 'text/html';
  }
}

function handleFileRequest(request, response) {

  let filePath = getFilePath(request.url);
  let contentType = getContentType(filePath);

  fs.readFile(filePath, function (error, content) {
    if (error) {
      if (error.code == 'ENOENT') {
        response.writeHead(404, 'NOT FOUND');
        response.end(`Couldn't find ${request.url}`);
        return;
      }
      response.writeHead(500);
      response.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
      response.end();
      return;
    }

    response.writeHead(200, { 'Content-Type': contentType });
    response.end(content, 'utf-8');
  });
}

const server = http.createServer((request, response) => {
  console.log(`Handle request ${request.url}`);
  handleFileRequest(request, response);
});

server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
server.listen(port);

console.log(`Listening on ${port}`);


