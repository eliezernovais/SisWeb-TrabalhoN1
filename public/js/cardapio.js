async function carregarProdutos() {
  const response = await fetch('http://localhost:3001/produtos');
  const produtos = await response.json();
  const cardapio = document.getElementById('cardapio');
  cardapio.innerHTML = '';
  produtos.forEach(produto => {
    const li = document.createElement('li');
    li.textContent = `${produto.CodProduto} - ${produto.nome} - R$${produto.preco.toFixed(2)} - Quantidade de Estoque: ${produto.quantidadeEstoque || 'N/A'}`;
    cardapio.appendChild(li);
  });
}
carregarProdutos();