const http = require('http');
const EventEmitter = require('events');
const PORT = 8080;

const eventEmitter = new EventEmitter();


eventEmitter.on('messageReceived', (message) => {
  console.log(`Message:${message}`);
});


const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/log') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    
    req.on('end', () => {
      try {
        const { message } = JSON.parse(body);
        eventEmitter.emit('messageReceived', message);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: true, message:"Message Received"}));
      } catch (err) {
        res.statusCode = 400;
        res.end(JSON.stringify({ success: false, message: 'Invalid JSON' }));
      }
    });
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: false, message: 'Not Found' }));
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
