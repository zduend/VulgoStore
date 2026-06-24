const whatsapp = '5561982065232';
const preco = 'R$ 140,00';
let produtoSelecionado = null;

const produtos = [
  { codigo: 'BRA001', nome: 'Brasil Home Amarela 2026', imagem: 'img/brasil-amarela.png' },
  { codigo: 'BRA002', nome: 'Brasil Black Edition 2026', imagem: 'img/brasil-preta.png' },
  { codigo: 'FLA001', nome: 'Flamengo Home Rubro-Negra', imagem: 'img/flamengo.png' }
];

const catalogo = document.getElementById('catalogo');
produtos.forEach((produto, index) => {
  catalogo.innerHTML += `
    <div class="card">
      <img src="${produto.imagem}" alt="${produto.nome}">
      <div class="card-body">
        <span class="codigo">${produto.codigo}</span>
        <h3>${produto.nome}</h3>
        <p class="valor">${preco}</p>
        <button onclick="abrirModal(${index})">Personalizar e pedir</button>
      </div>
    </div>
  `;
});

function abrirModal(index) {
  produtoSelecionado = produtos[index];
  document.getElementById('produtoNome').innerText = `${produtoSelecionado.nome} - ${produtoSelecionado.codigo}`;
  document.getElementById('produtoImagem').src = produtoSelecionado.imagem;
  document.getElementById('modal').style.display = 'flex';
}

function fecharModal() {
  document.getElementById('modal').style.display = 'none';
}

function enviarPedido() {
  const tamanho = document.getElementById('tamanho').value;
  const nomeCamisa = document.getElementById('nomeCamisa').value || 'Sem personalização';
  const numeroCamisa = document.getElementById('numeroCamisa').value || 'Sem número';
  const quantidade = document.getElementById('quantidade').value;
  const cliente = document.getElementById('cliente').value || 'Não informado';

  const fotoCamisa = new URL(produtoSelecionado.imagem, window.location.href).href;

const textoPedido = `*VULGOSTORE - NOVO PEDIDO*

Camisa: ${produtoSelecionado.nome}
Código: ${produtoSelecionado.codigo}
Preço: ${preco}

Tamanho: ${tamanho}
Nome: ${nomeCamisa}
Número: ${numeroCamisa}
Quantidade: ${quantidade}

Foto da camisa:
${fotoCamisa}

Cliente: ${cliente}`;

  const mensagem = encodeURIComponent(textoPedido);
  window.open(`https://wa.me/${whatsapp}?text=${mensagem}`, '_blank');
}
