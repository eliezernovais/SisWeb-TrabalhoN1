async function carregarProdutos() {
  const response = await fetch('http://localhost:3001/produtos');
  const produtos = await response.json();
  const cardapio = document.getElementById('cardapio');
  cardapio.innerHTML = '';
  produtos.forEach(produto => {
    const li = document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = produto.CodProduto;
    const texto = document.createTextNode(`${produto.CodProduto} - ${produto.nome} - R$${produto.preco.toFixed(2)} - Quantidade de Estoque: ${produto.Qtd || 0}`);
    const quantidade = document.createElement('input');
    quantidade.type = 'number';
    quantidade.min = '1';
    quantidade.placeholder = 'Quantidade';
    quantidade.style.display = 'none';
    checkbox.addEventListener('change', () => {
      quantidade.style.display = checkbox.checked
        ? 'inline-block'
        : 'none';
    });
    li.appendChild(checkbox);
    li.appendChild(texto);
    li.appendChild(quantidade);
    cardapio.appendChild(li);
  });
}

document.getElementById('finalizarPedido').addEventListener('click', async () => {
  const itensSelecionados = document.querySelectorAll('#cardapio input[type="checkbox"]:checked');
  const nomeCliente = document.getElementById('nomeCliente').value;
  const Itens = [];
  if (itensSelecionados.length === 0) {
    alert('Selecione pelo menos um produto.');
    return;
  }
  if (!nomeCliente) {
    alert('Por favor, insira o nome do cliente.');
    return;
  }
  for (const checkbox of itensSelecionados) {
    const quantidadeInput = checkbox.parentElement.querySelector('input[type="number"]');
    const quantidade = parseInt(quantidadeInput.value);
    if (isNaN(quantidade) || quantidade <= 0) {
      alert('Por favor, insira uma quantidade válida para todos os produtos selecionados.');
      return;
    }
    Itens.push({
      CodProduto: parseInt(checkbox.value),
      Qtd: quantidade
    });
  }
  const response = await fetch('http://localhost:3001/pedidos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ nomeCliente, Itens })
  });
  const dados = await response.json();
  if (response.ok) {
    alert('Pedido realizado com sucesso!');
  } else {
    alert(dados.erro || 'Erro ao realizar o pedido.');
  }

  carregarProdutos();
});

document.getElementById('acessarPedidos').addEventListener('click', () => {
  window.location.href = '/pedidos';
});

carregarProdutos();