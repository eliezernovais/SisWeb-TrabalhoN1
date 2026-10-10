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

async function RecuperarEstoque() {
    const resposta = await fetch('http://localhost:3002/estoque');
    if (!resposta.ok) {
        throw new Error('Erro ao consultar o estoque');
    }
    const estoque = await resposta.json();
    return estoque;
};

app.get('/produtos', async (req, res) => {
    try {
        // Busca o estoque no Servidor 3
        const estoque = await RecuperarEstoque();

        // Junta os produtos do Servidor 2 com o estoque do Servidor 3
        const produtosComEstoque = produtos.map(produto => {
            const itemEstoque = estoque.find(
                item => item.CodProduto === produto.CodProduto
            );

            return {
                ...produto,
                Qtd: itemEstoque
                    ? itemEstoque.Qtd
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

app.post('/pedidos', async (req, res) => {
    const pedido = { id: 0, ...req.body, totalPedido: 0 };
    if (!pedido || !pedido.Itens || pedido.Itens.length === 0) {
        return res.status(400).json({ erro: 'Pedido inválido' });
    }
    const resposta = await fetch('http://localhost:3002/baixa', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pedido.Itens)
        });
    if (!resposta.ok) {
        const erro = await resposta.text();
        return res.status(resposta.status).json({ erro });
    }
    for (const item of pedido.Itens) {
        const produto = produtos.find(p => p.CodProduto === item.CodProduto);
        pedido.totalPedido += item.Qtd * produto.preco;
        pedido.id = pedidos.length + 1;
    }
    pedido.totalPedido = parseFloat(pedido.totalPedido.toFixed(2));
    pedidos.push(pedido);
    res.status(201).json({ message: 'Pedido realizado com sucesso!' });
});

app.get('/pedidos', (req, res) => {
    res.json(pedidos);
});

app.delete('/pedidos/:id/fechar', (req, res) => {
    const pedidoId = parseInt(req.params.id);
    const pedido = pedidos.find(p => p.id === pedidoId);
    if (!pedido) {
        return res.status(404).json({ erro: 'Pedido não encontrado' });
    }
    pedidos.splice(pedidos.indexOf(pedido), 1);
    res.json({ message: 'Pedido fechado com sucesso!' });
});
app.listen(3001, () => {
    console.log('Servidor rodando em http://localhost:3001');
});