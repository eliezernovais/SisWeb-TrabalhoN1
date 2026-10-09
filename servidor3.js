const express = require('express');

const app = express();

app.use(express.json());

const estoque = [
  { CodProduto: 1, nome: 'Hamburguer', quantidadeEstoque: 10 },
  { CodProduto: 2, nome: 'X-Burguer', quantidadeEstoque: 15 },
  { CodProduto: 3, nome: 'Batata Frita', quantidadeEstoque: 20 },
];

app.get('/estoque', (req, res) => {
  res.json(estoque);
});

app.listen(3002, () => {
  console.log('Server is running on http://localhost:3002');
});