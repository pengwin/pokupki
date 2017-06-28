const http = require('http');
const fs = require('fs');
const path = require('path');
const pg = require('pg');
const url = require('url');

const staticPath = './public';
const port = process.env.PORT || 3000;
const databaseUrl = process.env.DATABASE_URL || 3000;

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

function handleApiRequest(pool, request, response) {
  pool.connect().then(client => {
    client.query('SELECT * FROM test_table')
      .then(res => {
        //client.release()
        response.end(JSON.stringify({ results: res.rows }), 'utf-8');
      })
      .catch(err => {
        //client.release();
        if (err) {
          console.error(err);
          response.writeHead(500);
          response.end(`Query error: ${e.message}, ${e.stack}`);
          response.end();
          return;
        }
      });
  }).catch(err => {
    if (err) {
      console.error(err);
      response.writeHead(500);
      response.end(`Connect error: ${err.message}, ${err.stack}`);
      response.end();
      return;
    }
  });
}

const params = url.parse(databaseUrl);
const auth = params.auth.split(':');

const config = {
  user: auth[0],
  password: auth[1],
  host: params.hostname,
  port: params.port,
  database: params.pathname.split('/')[1],
  ssl: true,
  max: 20
};

const pool = new pg.Pool(config);

const server = http.createServer((request, response) => {
  console.log(`Handle request ${request.url}`);

  if (request.url.indexOf('/api') > -1) {
    handleApiRequest(pool, request, response);
    return;
  }

  handleFileRequest(request, response);
});

server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
server.listen(port);

console.log(`Listening on ${port}`);


