import * as http from 'http';
import fs from 'fs';
import path from 'path';

import { handleApiRequest } from './apiHandler';

const staticPath = './public';
const port = process.env.PORT || 3000;

function getFilePath(url: string) {
  if (url === '/') {
    url = 'index.html';
  }
  return path.join(staticPath, url);
}

function getContentType(filePath: string) {
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

  fs.readFile(filePath, (error, content) => {
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

  if (request.url && request.url.indexOf('/api') > -1) {
    return handleApiRequest(request.url).then(res => {
      response.writeHead(res.status || 200, { 'Content-Type': 'application/json' });
      response.end(res.content, 'utf-8');
    });
  }

  handleFileRequest(request, response);
});

server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
server.listen(port);

console.log(`Listening on ${port}`);


