const whatsapp = '5561982065232';

const SUPABASE_URL = "https://evihfjnkgtvjqjhhudzj.supabase.co";
const SUPABASE_KEY = "sb_publishable_WXyiN55g6IFnJszmTLZo4A_B7dPSnCE";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let produtoSelecionado = null;
let produtos = [];

const catalogo = document.getElementById('catalogo');

async function carregarProdutosLoja() {
  const { data, error } = await supabaseClient
    .from("produtos")
    .select("*")
    .eq("ativo", true)
    .order("criado_em", { ascending: false });

  if (error) {
    catalogo.innerHTML = "<p>Erro ao carregar produtos.</p>";
    console.error(error);
    return;
  }

  produtos = data;
  catalogo.innerHTML = "";

  produtos.forEach((produto, index) => {
    catalogo.innerHTML += `
      <div class="card">
        <img src="${produto.imagem_url}" alt="${produto.nome}">
        <div class="card-body">
          <span class="codigo">${produto.codigo}</span>
          <h3>${produto.nome}</h3>
          <p class="valor">R$ ${produto.preco}</p>
          <button onclick="abrirModal(${index})">Personalizar e pedir</button>
        </div>
      </div>
    `;
  });
}

function abrirModal(index) {
  produtoSelecionado = produtos[index];
  document.getElementById("produtoPreco").innerText = `R$ ${produtoSelecionado.preco}`;

  document.getElementById('produtoNome').innerText =
    `${produtoSelecionado.nome} - ${produtoSelecionado.codigo}`;

  document.getElementById('produtoImagem').src = produtoSelecionado.imagem_url;

  document.getElementById('modal').style.display = 'flex';
}

function fecharModal() {
  document.getElementById('modal').style.display = 'none';
}

function alterarPersonalizacao(){

    const opcao = document.querySelector(
        'input[name="personalizacao"]:checked'
    ).value;

    const dados = document.getElementById("dadosPersonalizacao");

    const preco = document.getElementById("produtoPreco");

    if(opcao === "sim"){

        dados.style.display = "block";

        preco.innerHTML =
            "<strong>Total: R$ 175,00</strong>";

    }else{

        dados.style.display = "none";

        preco.innerHTML =
            "<strong>Total: R$ 140,00</strong>";

        document.getElementById("nomeCamisa").value = "";
        document.getElementById("numeroCamisa").value = "";

    }

}

function enviarPedido() {
  const personalizacao =
document.querySelector(
'input[name="personalizacao"]:checked'
).value; 
  const tamanho = document.getElementById('tamanho').value;
  const nomeCamisa = document.getElementById('nomeCamisa').value || 'Sem personalização';
  const numeroCamisa = document.getElementById('numeroCamisa').value || 'Sem número';
  const quantidade = document.getElementById('quantidade').value;
  const cliente = document.getElementById('cliente').value || 'Não informado';

  const fotoCamisa = produtoSelecionado.imagem_url;
  const precoFinal =
personalizacao === "sim" ? 175 : 140;

const preco = `R$ ${precoFinal},00`;

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

carregarProdutosLoja();