const express = require('express');

const app = express();

app.use(express.json());

const produtos = [
  { id: 1, nome: 'Hamburguer', preco: 9.99 },
  { id: 2, nome: 'X-Burguer', preco: 12.99 },
  { id: 3, nome: 'Batata Frita', preco: 5.99 },
];

const pedidos = [];
app.listen(3001, () => {
  console.log('Server is running on http://localhost:3001');
});