async function carregarPedidos() {
    const response = await fetch('http://localhost:3001/pedidos');
    const pedidos = await response.json();
    const pedidosSection = document.getElementById('pedidos');
    pedidosSection.innerHTML = '';
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

document.getElementById('atualizarPedidos').addEventListener('click', () => {
    carregarPedidos();
});

document.getElementById('acessarCardapio').addEventListener('click', () => {
    window.location.href = '/';
});
carregarPedidos();