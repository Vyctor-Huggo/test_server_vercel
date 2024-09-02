const express = require('express');
const path = require('path');
const socketIo = require('socket.io');
const { createServer } = require('http');

const app = express();
const server = createServer(app);
const io = socketIo(server);

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '../views'));

app.get('/', (req, res) => {
  res.render('index');
});

let pageNumber = 1;

io.on('connection', (socket) => {
  console.log('Um usuário está conectado');
  socket.emit('pageNumber', pageNumber);

  socket.on('updatePageNumber', (newPageNumber) => {
    pageNumber = newPageNumber;
    io.emit('pageNumber', pageNumber);
  });
});

module.exports = (req, res) => {
  return new Promise((resolve) => {
    server.listen(0, () => {
      const port = server.address().port;
      const url = `http://localhost:${port}`;
      resolve(url);
    });
  });
};
