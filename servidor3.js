const express = require('express');
const app = express();

app.use(express.json());

// meu banco de dados fake
let estoque = [
  { id: 1, nome: 'Hamburguer', qtd: 10 },
  { id: 2, nome: 'X-Burguer', qtd: 15 },
  { id: 3, nome: 'Batata Frita', qtd: 20 },
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
    const produtoNoEstoque = estoque.find(p => p.id === itemReq.id);

    if (!produtoNoEstoque) {
      return res.status(404).send('Produto não encontrado: ' + itemReq.id);
    }

    if (produtoNoEstoque.qtd < itemReq.qtd) {
      return res.status(400).send('estoque insuficiente pra: ' + produtoNoEstoque.nome);
    }
  }

  // segundo loop so roda se o primeiro loop passou sem erros
  for (let i = 0; i < itens.length; i++) {
    const itemReq = itens[i];
    const produtoNoEstoque = estoque.find(p => p.id === itemReq.id);
    
    produtoNoEstoque.qtd -= itemReq.qtd;
  }

  res.send({ mensagem: 'Baixa feita com sucesso!', estoque: estoque });
});

// terceiro loop rota p repor produtos no estoque 
app.post('/reposicao', (req, res) => {
  const itens = req.body;

  if (!Array.isArray(itens)) {
    return res.status(400).send('Envie uma lista de produtos.');
  }

  // confere se todos os produtos existem antes de somar
  for (let i = 0; i < itens.length; i++) {
    const itemReq = itens[i];
    const produtoNoEstoque = estoque.find(p => p.id === itemReq.id);

    if (!produtoNoEstoque) {
      return res.status(404).send('Produto não encontrado: ' + itemReq.id);
    }
  } 

  // se todos existem, faz a reposicao
  for (let i = 0; i < itens.length; i++) {
    const itemReq = itens[i];
    const produtoNoEstoque = estoque.find(p => p.id === itemReq.id);

    produtoNoEstoque.qtd += itemReq.qtd;
  }

  res.send({ mensagem: 'reposição feita!', estoque: estoque });
});

// inicializa o servidor na porta 3002
app.listen(3002, () => {
  console.log('Servido rodando na porta 3002');
});
