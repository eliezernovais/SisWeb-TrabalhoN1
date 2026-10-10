const express = require('express');

const app = express();

// cors serve para que este servidor possa ser acessado por outros servidores, como o servidor 1
const cors = require('cors');
app.use(cors());
app.use(express.json());

// """banco de dados""" do servidor 2
const produtos = [
    { CodProduto: 1, nome: 'Hamburguer', preco: 9.99 },
    { CodProduto: 2, nome: 'X-Burguer', preco: 12.99 },
    { CodProduto: 3, nome: 'Batata Frita', preco: 5.99 },
];
const pedidos = [];

// Função para puxar o estoque do Servidor 3
async function RecuperarEstoque() {
    const resposta = await fetch('http://localhost:3002/estoque');
    if (!resposta.ok) {
        throw new Error('Erro ao consultar o estoque');
    }
    const estoque = await resposta.json();
    return estoque;
};

// get produtos retorna a lista de produtos com o estoque atualizado do Servidor 3
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

// post para criar um pedido e dar baixa no servidor 3
app.post('/pedidos', async (req, res) => {

    // cria a estrutura do pedido com id, nome do cliente, itens e total do pedido
    const pedido = { id: 0, ...req.body, totalPedido: 0 };

    // validação do pedido
    if (!pedido || !pedido.Itens || pedido.Itens.length === 0) {
        return res.status(400).json({ erro: 'Pedido inválido' });
    }

    // chama o servidor 3 para dar baixa no estoque
    const resposta = await fetch('http://localhost:3002/baixa', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pedido.Itens)
        });

    // se a resposta do servidor 3 não for ok, retorna o erro para o cliente
    if (!resposta.ok) {
        const erro = await resposta.text();
        return res.status(resposta.status).json({ erro });
    }

    // se a resposta do servidor 3 for ok, calcula o total do pedido e adiciona o nome do produto em cada item
    for (const item of pedido.Itens) {
        const produto = produtos.find(p => p.CodProduto === item.CodProduto);
        if (!produto) {
            return res.status(400).json({ erro: `Produto não encontrado: ${item.CodProduto}` });
        }
        item.nomeProduto = produto.nome;
        pedido.totalPedido += item.Qtd * produto.preco;
        pedido.id = pedidos.length + 1;
    }
    pedido.totalPedido = parseFloat(pedido.totalPedido.toFixed(2));
    pedidos.push(pedido);
    res.status(201).json({ message: 'Pedido realizado com sucesso!' });
});

// get pedidos retorna a lista de pedidos
app.get('/pedidos', (req, res) => {
    res.json(pedidos);
});

// delete pedidos/:id/fechar fecha o pedido e remove da lista de pedidos
app.delete('/pedidos/:id/fechar', (req, res) => {
    const pedidoId = parseInt(req.params.id);
    const pedido = pedidos.find(p => p.id === pedidoId);
    if (!pedido) {
        return res.status(404).json({ erro: 'Pedido não encontrado' });
    }
    pedidos.splice(pedidos.indexOf(pedido), 1);
    res.json({ message: 'Pedido fechado com sucesso!' });
});

// porta do servidor
app.listen(3001, () => {
    console.log('Servidor rodando em http://localhost:3001');
});