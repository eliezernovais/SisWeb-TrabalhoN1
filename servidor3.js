const express = require('express');
const app = express();

app.use(express.json());

// meu banco de dados fake
let estoque = [
  { CodProduto: 1, nome: 'Hamburguer', Qtd: 10 },
  { CodProduto: 2, nome: 'X-Burguer', Qtd: 15 },
  { CodProduto: 3, nome: 'Batata Frita', Qtd: 20 },
];

// rota pra ver o estoque
app.get('/estoque', (req, res) => {
  res.send(estoque);
});

//rota pra tirar produtos do estoque
app.post('/baixa', (req, res) => {
  const itens = req.body;

  // evitar q servidor caia se não for uma lista valida
  if (!Array.isArray(itens)) {
    return res.status(400).send('Envie uma lista de produtos.');
  }

  // primeiro loop confere se TODOS os itens estao corretos e se tem estoque
  for (let i = 0; i < itens.length; i++) {
    const itemReq = itens[i];
    const produtoNoEstoque = estoque.find(p => p.CodProduto === itemReq.CodProduto);

    if (!produtoNoEstoque) {
      return res.status(404).send('Produto não encontrado: ' + itemReq.CodProduto);
    }

    if (produtoNoEstoque.Qtd < itemReq.Qtd) {
      return res.status(400).send('estoque insuficiente pra: ' + produtoNoEstoque.nome);
    }
  }

  // segundo loop so roda se o primeiro loop passou sem erros
  for (let i = 0; i < itens.length; i++) {
    const itemReq = itens[i];
    const produtoNoEstoque = estoque.find(p => p.CodProduto === itemReq.CodProduto);
    
    produtoNoEstoque.Qtd -= itemReq.Qtd;
  }

  res.send({ mensagem: 'Baixa feita com sucesso!', estoque: estoque });
});

// rota p repor produtos no estoque 
app.post('/reposicao', (req, res) => {
  const itens = req.body;

  if (!Array.isArray(itens)) {
    return res.status(400).send('Envie uma lista de produtos.');
  }

  // confere se todos os produtos existem antes de somar
  for (let i = 0; i < itens.length; i++) {
    const itemReq = itens[i];
    const produtoNoEstoque = estoque.find(p => p.CodProduto === itemReq.CodProduto);

    if (!produtoNoEstoque) {
      return res.status(404).send('Produto não encontrado: ' + itemReq.CodProduto);
    }
  } 

  // se todos existem, faz a reposicao
  for (let i = 0; i < itens.length; i++) {
    const itemReq = itens[i];
    const produtoNoEstoque = estoque.find(p => p.CodProduto === itemReq.CodProduto);

    produtoNoEstoque.Qtd += itemReq.Qtd;
  }

  res.send({ mensagem: 'reposição feita!', estoque: estoque });
});

// inicializa o servidor na porta 3002
app.listen(3002, () => {
  console.log('Servidor rodando em http://localhost:3002');
});
