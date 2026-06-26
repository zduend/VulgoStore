const SUPABASE_URL = "https://evihfjnkgtvjqjhhudzj.supabase.co";
const SUPABASE_KEY = "sb_publishable_WXyiN55g6IFnJszmTLZo4A_B7dPSnCE";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function verificarLogin() {
  const { data } = await supabaseClient.auth.getSession();

  if (!data.session) {
    window.location.href = "login.html";
    return;
  }
}

verificarLogin();

function limparNomeArquivo(nome) {
    return nome
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9.-]/g, "-")
        .toLowerCase();
}

async function salvarProduto() {
    const codigo = document.getElementById("codigo").value;
    const nome = document.getElementById("nome").value;
    const preco = document.getElementById("preco").value;
    const categoria = document.getElementById("categoria").value;
    const arquivo = document.getElementById("imagem").files[0];

    if (!arquivo) {
        alert("Selecione uma imagem.");
        return;
    }

    const nomeLimpo = limparNomeArquivo(arquivo.name);
    const nomeArquivo = `${Date.now()}-${nomeLimpo}`;

    const { error: uploadError } = await supabaseClient.storage
        .from("Camisas")
        .upload(nomeArquivo, arquivo);

    if (uploadError) {
        alert("Erro ao enviar imagem: " + uploadError.message);
        return;
    }

    const { data: urlData } = supabaseClient.storage
        .from("Camisas")
        .getPublicUrl(nomeArquivo);

    const imagem_url = urlData.publicUrl;

    const { error } = await supabaseClient
        .from("produtos")
        .insert([
            {
                codigo,
                nome,
                preco,
                categoria,
                imagem_url,
                ativo: true
            }
        ]);

    if (error) {
        alert("Erro ao cadastrar: " + error.message);
        return;
    }

    alert("Produto cadastrado com sucesso!");

    document.getElementById("codigo").value = "";
    document.getElementById("nome").value = "";
    document.getElementById("preco").value = "140";
    document.getElementById("imagem").value = "";

    carregarProdutos();
}

async function carregarProdutos() {
    const { data, error } = await supabaseClient
        .from("produtos")
        .select("*")
        .order("criado_em", { ascending: false });

    const lista = document.getElementById("lista");

    if (error) {
        lista.innerHTML = "Erro ao carregar produtos.";
        return;
    }

    lista.innerHTML = "";

    data.forEach(produto => {
        lista.innerHTML += `
            <div class="produto">
                <strong>${produto.nome}</strong><br>
                Código: ${produto.codigo}<br>
                Preço: R$ ${produto.preco}<br>
                Categoria: ${produto.categoria}<br>
                <img src="${produto.imagem_url}" style="width:120px;margin-top:10px;border-radius:8px;">
            </div>
        `;
    });
}

carregarProdutos();


async function sair() {
  await supabaseClient.auth.signOut();
  window.location.href = "login.html";
}

