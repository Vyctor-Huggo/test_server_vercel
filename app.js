const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

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

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
