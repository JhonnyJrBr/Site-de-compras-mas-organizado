
let carrinho = JSON.parse(localStorage.getItem("kadabra_carrinho")) || [];

let formaPagamento = "";

const botaoAbrir = document.getElementById("abrirCarrinho");
const botaoFechar = document.getElementById("fecharCarrinho");
const fundoCarrinho = document.getElementById("fundoCarrinho");
const painelCarrinho = document.getElementById("painelCarrinho");

const listaCarrinho = document.getElementById("listaCarrinho");
const quantidadeCarrinho = document.getElementById("quantidadeCarrinho");
const totalCarrinho = document.getElementById("totalCarrinho");

const botaoFinalizar = document.getElementById("finalizarCompra");
const etapaPagamento = document.getElementById("etapaPagamento");
const rodapeCarrinho = document.querySelector(".rodape-carrinho");

const confirmarPagamento = document.getElementById("confirmarPagamento");
const voltarCarrinho = document.getElementById("voltarCarrinho");
const detalhesPagamento = document.getElementById("detalhesPagamento");


function formatarPreco(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}


function salvarCarrinho() {
    localStorage.setItem("kadabra_carrinho", JSON.stringify(carrinho));
    atualizarCarrinho();
}


function atualizarCarrinho() {

    listaCarrinho.innerHTML = "";

    let quantidadeTotal = 0;
    let valorTotal = 0;

    if (carrinho.length === 0) {

        listaCarrinho.innerHTML =
            '<p class="carrinho-vazio">Seu carrinho está vazio.</p>';

    }

    carrinho.forEach((produto, indice) => {

        quantidadeTotal += produto.quantidade;
        valorTotal += produto.preco * produto.quantidade;

        const item = document.createElement("div");
        item.classList.add("item-carrinho");

        const imagem = document.createElement("img");
        imagem.src = produto.imagem || "";
        imagem.alt = produto.nome;

        const informacoes = document.createElement("div");
        informacoes.classList.add("informacoes-item");

        const nome = document.createElement("h3");
        nome.textContent = produto.nome;

        const preco = document.createElement("p");
        preco.textContent = formatarPreco(produto.preco);

        const controles = document.createElement("div");
        controles.classList.add("controle-quantidade");

        const diminuir = document.createElement("button");
        diminuir.textContent = "-";
        diminuir.dataset.acao = "diminuir";
        diminuir.dataset.indice = indice;

        const quantidade = document.createElement("span");
        quantidade.textContent = produto.quantidade;

        const aumentar = document.createElement("button");
        aumentar.textContent = "+";
        aumentar.dataset.acao = "aumentar";
        aumentar.dataset.indice = indice;

        const remover = document.createElement("button");
        remover.textContent = "🗑";
        remover.classList.add("remover-item");
        remover.dataset.acao = "remover";
        remover.dataset.indice = indice;

        controles.append(
            diminuir,
            quantidade,
            aumentar,
            remover
        );

        informacoes.append(nome, preco, controles);

        item.append(imagem, informacoes);

        listaCarrinho.appendChild(item);

    });

    quantidadeCarrinho.textContent = quantidadeTotal;

    totalCarrinho.textContent = formatarPreco(valorTotal);

    botaoFinalizar.disabled = carrinho.length === 0;

    if (carrinho.length === 0) {
        voltarParaCarrinho();
    }

}


// ADICIONAR PRODUTOS

document.querySelectorAll(".card .adicionar-carrinho").forEach(botao => {

    botao.addEventListener("click", function() {

        const produto = this.closest(".card");

        const nome = produto.dataset.nome;
        const preco = Number(produto.dataset.preco);
        const imagem = produto.dataset.imagem;

        if (!nome || !Number.isFinite(preco) || preco <= 0) {
            alert("Não foi possível adicionar este produto.");
            return;
        }

        const existente = carrinho.find(item => item.nome === nome);

        if (existente) {
            existente.quantidade++;
        } else {
            carrinho.push({
                nome: nome,
                preco: preco,
                imagem: imagem,
                quantidade: 1
            });
        }

        salvarCarrinho();

        const textoOriginal = this.textContent;

        this.textContent = "Adicionado! ✓";

        setTimeout(() => {
            this.textContent = textoOriginal;
        }, 1000);

    });

});


// AUMENTAR, DIMINUIR E REMOVER

listaCarrinho.addEventListener("click", function(event) {

    const botao = event.target.closest("button");

    if (!botao) {
        return;
    }

    const indice = Number(botao.dataset.indice);
    const acao = botao.dataset.acao;

    if (!Number.isInteger(indice) || !carrinho[indice]) {
        return;
    }

    if (acao === "aumentar") {
        carrinho[indice].quantidade++;
    }

    if (acao === "diminuir") {
        carrinho[indice].quantidade--;

        if (carrinho[indice].quantidade <= 0) {
            carrinho.splice(indice, 1);
        }
    }

    if (acao === "remover") {
        carrinho.splice(indice, 1);
    }

    salvarCarrinho();

});


// ABRIR CARRINHO

function abrirCarrinho() {
    painelCarrinho.classList.add("ativo");
    fundoCarrinho.classList.add("ativo");
}

function fecharCarrinho() {
    painelCarrinho.classList.remove("ativo");
    fundoCarrinho.classList.remove("ativo");
}

botaoAbrir.addEventListener("click", abrirCarrinho);

botaoFechar.addEventListener("click", fecharCarrinho);

fundoCarrinho.addEventListener("click", fecharCarrinho);


// FINALIZAR COMPRA

botaoFinalizar.addEventListener("click", function() {

    if (carrinho.length === 0) {
        return;
    }

    rodapeCarrinho.style.display = "none";

    etapaPagamento.classList.add("ativo");

});


// ESCOLHER PAGAMENTO

document.querySelectorAll(".opcao-pagamento").forEach(botao => {

    botao.addEventListener("click", function() {

        document.querySelectorAll(".opcao-pagamento").forEach(opcao => {
            opcao.classList.remove("selecionado");
        });

        this.classList.add("selecionado");

        formaPagamento = this.dataset.pagamento;

        detalhesPagamento.textContent =
            "Forma de pagamento selecionada: " + formaPagamento;

    });

});


// VOLTAR AO CARRINHO

function voltarParaCarrinho() {

    etapaPagamento.classList.remove("ativo");

    rodapeCarrinho.style.display = "block";

    formaPagamento = "";

    document.querySelectorAll(".opcao-pagamento").forEach(opcao => {
        opcao.classList.remove("selecionado");
    });

    detalhesPagamento.textContent =
        "Selecione uma forma de pagamento.";

}

voltarCarrinho.addEventListener("click", voltarParaCarrinho);


// CONFIRMAR PEDIDO

confirmarPagamento.addEventListener("click", function() {

    if (!formaPagamento) {
        alert("Escolha uma forma de pagamento!");
        return;
    }

    if (carrinho.length === 0) {
        return;
    }

    const total = carrinho.reduce((soma, produto) => {
        return soma + produto.preco * produto.quantidade;
    }, 0);

    alert(
        "Pedido confirmado com sucesso!\n\n" +
        "Total: " + formatarPreco(total) + "\n" +
        "Pagamento: " + formaPagamento
    );

    carrinho = [];

    localStorage.removeItem("kadabra_carrinho");

    formaPagamento = "";

    atualizarCarrinho();

    voltarParaCarrinho();

    fecharCarrinho();

});


// CARREGAR CARRINHO

atualizarCarrinho();
