let financeChart;


async function carregarDados(periodo) {

    const resposta = await fetch(
        `/api/analytics?period=${periodo}`
    );

    const dados = await resposta.json();

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