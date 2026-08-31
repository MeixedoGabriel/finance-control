let financeChart;
let movimentacoesAtuais = [];
let periodoAtual = "week";

async function carregarDados(periodo) {

    const resposta = await fetch(
        `/api/analytics?period=${periodo}`
    );

    const dados = await resposta.json();
    movimentacoesAtuais = dados.movimentacoes;

    return dados;
}


function criarGrafico(dados) {

    const canvas = document.getElementById("financeChart");

    financeChart = new Chart(canvas, {

        type: "line",

        data: {
            labels: dados.labels,

            datasets: [
                {
                    label: "Receitas",
                    data: dados.receitas,

                    borderColor: "#16A34A",
                    backgroundColor: "rgba(22, 163, 74, 0.08)",

                    borderWidth: 2,
                    tension: 0.3,

                    fill: true,

                    pointRadius: function(context) {

                        return context.raw > 0 ? 4 : 0;

                    },

                    pointHoverRadius: function(context) {

                        return context.raw > 0 ? 6 : 0;

                    }
                },

                {
                    label: "Despesas",
                    data: dados.despesas,

                    borderColor: "#DC2626",
                    backgroundColor: "rgba(220, 38, 38, 0.08)",

                    borderWidth: 2,
                    tension: 0.3,

                    fill: true,

                    pointRadius: function(context) {

                        return context.raw > 0 ? 4 : 0;

                    },

                    pointHoverRadius: function(context) {

                        return context.raw > 0 ? 6 : 0;

                    }
                }
            ]
        },

        options: {

            onClick: function (event, elements) {

                if (!elements.length) {
                    return;
                }

                const indice = elements[0].index;

                const movimentacoesDoPeriodo =
                    movimentacoesAtuais.filter(
                        movimentacao =>
                            movimentacao.indice_periodo === indice
                    );

                console.log("Índice clicado:", indice);

                console.log(
                    "Movimentações:",
                    movimentacoesDoPeriodo
                );

                abrirModalMovimentacoes(
                    movimentacoesDoPeriodo,
                    indice
                );
            },

            responsive: true,

            interaction: {
                mode: "index",
                intersect: false
            },

            plugins: {

                legend: {
                    position: "top"
                },

                tooltip: {

                    callbacks: {

                        label: function(context) {

                            const valor = context.parsed.y;

                            return `${context.dataset.label}: R$ ${valor.toLocaleString(
                                "pt-BR",
                                {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                }
                            )}`;
                        }

                    }

                }

            },

            scales: {

                x: {

                    ticks: {

                        autoSkip: true,

                        maxTicksLimit: 7

                    }

                },

                y: {

                    beginAtZero: true,

                    ticks: {

                        callback: function(value) {

                            return `R$ ${value.toLocaleString(
                                "pt-BR",
                                {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                }
                            )}`;

                        }

                    }

                }

            },

            animation: {
                duration: 600
            }

        }

    });
}


function atualizarGrafico(dados) {

    financeChart.data.labels = dados.labels;

    financeChart.data.datasets[0].data = dados.receitas;

    financeChart.data.datasets[1].data = dados.despesas;

    financeChart.update();

}


async function alterarPeriodo(periodo) {

    const dados = await carregarDados(periodo);

    atualizarGrafico(dados);

}


async function iniciarGrafico() {

    const dados = await carregarDados(periodoAtual);

    criarGrafico(dados);

}


const botoesPeriodo = document.querySelectorAll(
    ".period-button"
);


botoesPeriodo.forEach(botao => {

    botao.addEventListener("click", () => {

        const periodo = botao.dataset.period;

        periodoAtual = periodo;

        alterarPeriodo(periodo);

        botoesPeriodo.forEach(botao => {
            botao.classList.remove("active");
        });

        botao.classList.add("active");

    });

});


iniciarGrafico();


function abrirModalMovimentacoes(movimentacoes, indice) {

    const modal =
        document.getElementById("modal-movimentacoes");

    const titulo =
        document.getElementById("modal-titulo");

    const lista =
        document.getElementById("lista-movimentacoes");

    lista.innerHTML = "";

    if (movimentacoes.length === 0) {

        titulo.textContent = "Nenhuma movimentação";

        lista.innerHTML = `
            <p>
                Não existem movimentações neste período.
            </p>
        `;

    } else {

        titulo.textContent = "Movimentações";

        movimentacoes.forEach(movimentacao => {

            const elemento =
                document.createElement("div");

            elemento.classList.add(
                "movimentacao-modal"
            );

            const sinal =
                movimentacao.tipo === "Receita"
                    ? "+"
                    : "-";

            elemento.innerHTML = `
                <div class="movimentacao-modal-cabecalho">

                    <strong class="${movimentacao.tipo === "Receita" ? "receita" : "despesa"}">
                        ${sinal} ${movimentacao.descricao}
                    </strong>

                    <span class="${movimentacao.tipo === "Receita" ? "receita" : "despesa"}">
                        ${sinal} R$ ${Number(movimentacao.valor).toFixed(2)}
                    </span>

                </div>

                <p class="categoria">
                    ${movimentacao.categoria}
                </p>

                <div class="acoes-modal">

                    <a
                        href="/editar/${movimentacao.id}"
                        class="button"
                    >
                        Editar
                    </a>

                    <form
                        action="/excluir/${movimentacao.id}"
                        method="POST"
                        onsubmit="return confirm('Tem certeza que deseja excluir esta movimentação?')"
                    >

                        <button
                            type="submit"
                            class="button secondary"
                        >
                            Excluir
                        </button>

                    </form>

                </div>
            `;

            lista.appendChild(elemento);
        });
    }

    modal.classList.add("ativo");
}

document.addEventListener("DOMContentLoaded", () => {

    const modal =
        document.getElementById("modal-movimentacoes");

    const botaoFechar =
        document.getElementById("fechar-modal");

    botaoFechar.addEventListener("click", () => {

        modal.classList.remove("ativo");

    });

});

async function carregarCategorias(periodo) {

    const resposta =
        await fetch(`/api/categories?period=${periodo}`);

    const dados =
        await resposta.json();

    return dados.categorias;
}


function renderizarCategorias(categorias) {

    const container =
        document.getElementById("categorias-container");

    if (categorias.length === 0) {

        container.innerHTML = `
            <p>
                Nenhuma despesa encontrada neste período.
            </p>
        `;

        return;
    }

    const maiorValor =
        categorias[0].valor;

    container.innerHTML = "";

    categorias.forEach(categoria => {

        const porcentagem =
            (categoria.valor / maiorValor) * 100;

        const elemento =
            document.createElement("div");

        elemento.classList.add("categoria-analise");

        elemento.innerHTML = `

            <div class="categoria-analise-cabecalho">

                <span>
                    ${categoria.nome}
                </span>

                <strong>
                    R$ ${Number(categoria.valor).toLocaleString(
                        "pt-BR",
                        {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        }
                    )}

                    (${Number(categoria.porcentagem).toFixed(1)}%)
                </strong>

            </div>

            <div class="barra-categoria">

                <div
                    class="barra-categoria-progresso"
                    style="width: ${porcentagem}%"
                ></div>

            </div>

        `;

        container.appendChild(elemento);

    });
}


document.addEventListener("DOMContentLoaded", () => {

    const modal =
        document.getElementById("modal-analise");

    const botaoAbrir =
        document.getElementById("abrir-analise-completa");

    const botaoFechar =
        document.getElementById("fechar-modal-analise");


    botaoAbrir.addEventListener("click", async () => {

        modal.classList.add("ativo");

        const categorias =
            await carregarCategorias(periodoAtual);

        renderizarCategorias(categorias);

    });


    botaoFechar.addEventListener("click", () => {

        modal.classList.remove("ativo");

    });

});