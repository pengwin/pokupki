const http = require('http');
const fs = require('fs');
const path = require('path');


const staticPath = './public';
const port = process.env.PORT || 3000;


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

const query = {
  // give the query a unique name
  name: 'fetch-user',
  text: 'INSERT INTO test_table(id, email) VALUES($1, $2)',
  values: [1]
};

function handleApiRequest(pool, request, response) {
    pool.query('SELECT * FROM test_table')
      .then(res => {
        response.end(JSON.stringify({ results: res.rows }), 'utf-8');
      })
      .catch(err => {
        if (err) {
          console.error(err);
          response.writeHead(500);
          response.end(`Query error: ${err.message}, ${err.stack}`);
          response.end();
          return;
        }
      });
}



pool.on('error', function (err, client) {
  // if an error is encountered by a client while it sits idle in the pool
  // the pool itself will emit an error event with both the error and
  // the client which emitted the original error
  // this is a rare occurrence but can happen if there is a network partition
  // between your application and the database, the database restarts, etc.
  // and so you might want to handle it and at least log it out
  console.error('idle client error', err.message, err.stack);
});

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


