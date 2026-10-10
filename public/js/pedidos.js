
// função para carregar os pedidos do servidor 2 e exibir na tela
async function carregarPedidos() {
    const response = await fetch('http://localhost:3001/pedidos');
    const pedidos = await response.json();

    // pega o elemento section dos pedidos e limpa ele antes de adicionar os pedidos
    const pedidosSection = document.getElementById('pedidos');
    pedidosSection.innerHTML = '';

    // adiciona cada pedido na lista de pedidos
    for (const pedido of pedidos) {
        const pedidoDiv = document.createElement('div');
        pedidoDiv.classList.add('pedido');
        pedidoDiv.innerHTML = `
            <h3>Pedido #${pedido.id}</h3>
            <p><strong>Cliente:</strong> ${pedido.nomeCliente}</p>
            <p><strong>Total do Pedido:</strong> R$${pedido.totalPedido.toFixed(2)}</p>
            <ul>
                ${pedido.Itens.map(item => `
                    <li>
                        <strong>${item.CodProduto} - ${item.nomeProduto}</strong> - Quantidade: ${item.Qtd}
                    </li>
                `).join('')}
            </ul>
        `;
        pedidosSection.appendChild(pedidoDiv);
    }
}

// adiciona eventos para os botões de atualizar pedidos e acessar cardápio
document.getElementById('atualizarPedidos').addEventListener('click', () => {
    carregarPedidos();
});

// adiciona evento para o botão de acessar cardápio que redireciona para a página do cardápio
document.getElementById('acessarCardapio').addEventListener('click', () => {
    window.location.href = '/';
});
carregarPedidos();