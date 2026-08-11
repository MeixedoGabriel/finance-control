let financeChart;
let movimentacoesAtuais = [];

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

                    pointRadius: 4,
                    pointHoverRadius: 6
                },

                {
                    label: "Despesas",
                    data: dados.despesas,

                    borderColor: "#DC2626",
                    backgroundColor: "rgba(220, 38, 38, 0.08)",

                    borderWidth: 2,
                    tension: 0.3,

                    fill: true,

                    pointRadius: 4,
                    pointHoverRadius: 6
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

    const dados = await carregarDados("week");

    criarGrafico(dados);

}


const botoesPeriodo = document.querySelectorAll(
    ".period-button"
);


botoesPeriodo.forEach(botao => {

    botao.addEventListener("click", () => {

        const periodo = botao.dataset.period;

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