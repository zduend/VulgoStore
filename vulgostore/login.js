const SUPABASE_URL = "https://evihfjnkgtvjqjhhudzj.supabase.co";
const SUPABASE_KEY = "sb_publishable_WXyiN55g6IFnJszmTLZo4A_B7dPSnCE";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function fazerLogin() {
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();

  if (!email || !senha) {
    alert("Preencha o e-mail e a senha.");
    return;
  }

  const { error } = await supabaseClient.auth.signInWithPassword({
    email: email,
    password: senha
  });

  if (error) {
    alert("Erro ao entrar: " + error.message);
    return;
  }

  window.location.href = "admin.html";
}