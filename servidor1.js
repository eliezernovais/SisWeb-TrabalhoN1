const express = require('express');

const app = express();

app.use(express.static('public'));

// rota padrao do cardápio
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// rota padrao dos pedidos
app.get('/pedidos', (req, res) => {
  res.sendFile(__dirname + '/public/pedidos.html');
});

// porta do servidor
app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});