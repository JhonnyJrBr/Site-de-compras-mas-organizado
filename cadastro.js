
const formCadastro = document.getElementById("formCadastro");
const formLogin = document.getElementById("formLogin");

if (formCadastro) {
    formCadastro.addEventListener("submit", function(event) {
        event.preventDefault();

        const usuario = document.getElementById("usuario").value.trim();
        const senha = document.getElementById("senha").value;

        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        const existe = usuarios.some(function(conta) {
            return conta.usuario.toLowerCase() === usuario.toLowerCase();
        });

        if (existe) {
            document.getElementById("mensagem").textContent =
                "Este usuário já existe!";
            return;
        }

        usuarios.push({
            usuario: usuario,
            senha: senha
        });

        localStorage.setItem("usuarios", JSON.stringify(usuarios));

        alert("Cadastro realizado com sucesso!");

        window.location.href= 'loginempresa.html'
    });
}

if (formLogin) {
    formLogin.addEventListener("submit", function(event) {
        event.preventDefault();

        const usuario = document.getElementById("usuarioLogin").value.trim();
        const senha = document.getElementById("senhaLogin").value;

        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        const conta = usuarios.find(function(conta) {
            return conta.usuario.toLowerCase() === usuario.toLowerCase()
                && conta.senha === senha;
        });

        if (conta) {
            localStorage.setItem("usuarioLogado", conta.usuario);
            window.location.href = "kadabra.html";
        } else {
            document.getElementById("mensagem").textContent =
                "Usuário ou senha incorretos!";
        }
    });
}

const paginaLoja = document.getElementById("paginaLoja");

if (paginaLoja) {
    const usuarioLogado = localStorage.getItem("usuarioLogado");

    if (!usuarioLogado) {
        window.location.href = "loginempresa.html";
    }
}