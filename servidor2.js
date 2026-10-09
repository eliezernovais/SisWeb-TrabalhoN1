const express = require('express');

const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

const produtos = [
  { CodProduto: 1, nome: 'Hamburguer', preco: 9.99 },
  { CodProduto: 2, nome: 'X-Burguer', preco: 12.99 },
  { CodProduto: 3, nome: 'Batata Frita', preco: 5.99 },
];
const pedidos = [];


app.get('/produtos', async (req, res) => {
    try {
        // Busca o estoque no Servidor 3
        const resposta = await fetch('http://localhost:3002/estoque');

        if (!resposta.ok) {
            throw new Error('Erro ao consultar o estoque');
        }

        const estoque = await resposta.json();

        // Junta os produtos do Servidor 2 com o estoque do Servidor 3
        const produtosComEstoque = produtos.map(produto => {
            const itemEstoque = estoque.find(
                item => item.CodProduto === produto.CodProduto
            );

            return {
                ...produto,
                quantidadeEstoque: itemEstoque
                    ? itemEstoque.quantidadeEstoque
                    : 0
            };
        });

        res.json(produtosComEstoque);

    } catch (erro) {
        console.error('Erro ao buscar produtos:', erro);
        res.status(500).json({
            erro: 'Não foi possível carregar os produtos e o estoque'
        });
    }
});

app.listen(3001, () => {
  console.log('Server is running on http://localhost:3001');
});