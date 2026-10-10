
// função para carregar os produtos do servidor 2 e exibir no cardápio
async function carregarProdutos() {

  // faz a requisição para o servidor 2 para pegar os produtos
  const response = await fetch('http://localhost:3001/produtos');
  const produtos = await response.json();
  
  //pega o elemento ul do cardápio e limpa ele antes de adicionar os produtos
  const cardapio = document.getElementById('cardapio');
  cardapio.innerHTML = '';

  // adiciona cada produto na lista do cardápio
  produtos.forEach(produto => {

    //cria os elementos li, checkbox, texto e input de quantidade para cada produto
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

    // adiciona um evento para mostrar ou esconder o input de quantidade quando o checkbox for marcado ou desmarcado
    checkbox.addEventListener('change', () => {
      quantidade.style.display = checkbox.checked
        ? 'inline-block'
        : 'none';
    });

    // adiciona os elementos criados ao li e depois ao cardápio
    li.appendChild(checkbox);
    li.appendChild(texto);
    li.appendChild(quantidade);
    cardapio.appendChild(li);
  });
}

// adiciona um evento para o botão de finalizar pedido que vai pegar os produtos selecionados, validar e enviar para o servidor 2
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

  // valida se a quantidade de cada produto selecionado é válida (maior que 0 e não nula)
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

  // envia o pedido para o servidor 2 e trata a resposta, mostrando uma mensagem de sucesso ou erro
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

// adiciona um evento para o botão de acessar pedidos que vai redirecionar para a página de pedidos
document.getElementById('acessarPedidos').addEventListener('click', () => {
  window.location.href = '/pedidos';
});

carregarProdutos();