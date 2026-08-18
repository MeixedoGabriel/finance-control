from flask import Blueprint, render_template, request, redirect, url_for
from app.extensions import db
from app.models import Movimentacao
from datetime import datetime, date, timedelta


main = Blueprint("main", __name__)


@main.route("/")
def home():

    movimentacoes = (
        Movimentacao.query
        .order_by(Movimentacao.data.desc())
        .limit(5)
        .all()
    )

    saldo = 0
    total_receitas = 0
    total_despesas = 0

    for movimentacao in movimentacoes:

        if movimentacao.tipo == "Receita":

            saldo += movimentacao.valor
            total_receitas += movimentacao.valor

        else:

            saldo -= movimentacao.valor
            total_despesas += movimentacao.valor

    quantidade_movimentacoes = len(movimentacoes)

    return render_template(
        "index.html",
        movimentacoes=movimentacoes,
        saldo=saldo,
        total_receitas=total_receitas,
        total_despesas=total_despesas,
        quantidade_movimentacoes=quantidade_movimentacoes
    )


@main.route("/movimentacoes")
def movimentacoes():

    movimentacoes = (
        Movimentacao.query
        .order_by(Movimentacao.data.desc())
        .all()
    )

    return render_template(
        "movimentacoes.html",
        movimentacoes=movimentacoes
    )


@main.route("/nova-movimentacao", methods=["GET", "POST"])
def nova_movimentacao():

    if request.method == "POST":

        descricao = request.form["descricao"]
        valor = float(request.form["valor"])
        categoria = request.form["categoria"]
        tipo = request.form["tipo"]
        data = datetime.strptime(request.form["data"],"%Y-%m-%d").date()

        movimentacao = Movimentacao(
            descricao=descricao,
            valor=valor,
            categoria=categoria,
            tipo=tipo,
            data=data
        )

        db.session.add(movimentacao)
        db.session.commit()

        return redirect(url_for("main.home"))

    return render_template(
        "nova_movimentacao.html",
        movimentacao=None
    )


@main.route("/editar/<int:id>", methods=["GET", "POST"])
def editar_movimentacao(id):

    movimentacao = Movimentacao.query.get_or_404(id)

    if request.method == "POST":

        movimentacao.descricao = request.form["descricao"]
        movimentacao.valor = float(request.form["valor"])
        movimentacao.categoria = request.form["categoria"]
        movimentacao.tipo = request.form["tipo"]
        movimentacao.data = datetime.strptime(
            request.form["data"],
            "%Y-%m-%d"
        ).date()

        db.session.commit()

        return redirect(url_for("main.home"))

    return render_template(
        "editar_movimentacao.html",
        movimentacao=movimentacao
    )


@main.route("/excluir/<int:id>", methods=["POST"])
def excluir_movimentacao(id):

    movimentacao = Movimentacao.query.get_or_404(id)

    db.session.delete(movimentacao)
    db.session.commit()

    return redirect(url_for("main.home"))


@main.route("/api/analytics")
def analytics():

    period = request.args.get("period", "week")

    hoje = date.today()

    if period == "week":
        inicio = hoje - timedelta(days=6)

    elif period == "month":
        inicio = hoje.replace(day=1)

    elif period == "year":
        inicio = hoje.replace(month=1, day=1)

    else:
        return {"erro": "Período inválido."}, 400

    movimentacoes = (
        Movimentacao.query
        .filter(Movimentacao.data >= inicio)
        .filter(Movimentacao.data <= hoje)
        .order_by(Movimentacao.data.asc())
        .all()
    )

    if period == "year":

        labels = [
            "Jan", "Fev", "Mar", "Abr",
            "Mai", "Jun", "Jul", "Ago",
            "Set", "Out", "Nov", "Dez"
        ]

        receitas_por_periodo = [0] * 12
        despesas_por_periodo = [0] * 12

        for movimentacao in movimentacoes:

            indice = movimentacao.data.month - 1

            if movimentacao.tipo == "Receita":
                receitas_por_periodo[indice] += movimentacao.valor

            else:
                despesas_por_periodo[indice] += movimentacao.valor

    else:
        
        datas = []

        data_atual = inicio

        while data_atual <= hoje:
            datas.append(data_atual)
            data_atual += timedelta(days=1)

        labels = []
        receitas_por_periodo = []
        despesas_por_periodo = []

        for data in datas:

            receita = 0
            despesa = 0

            for movimentacao in movimentacoes:

                if movimentacao.data == data:

                    if movimentacao.tipo == "Receita":
                        receita += movimentacao.valor

                    else:
                        despesa += movimentacao.valor

            labels.append(data.strftime("%d/%m"))
            receitas_por_periodo.append(receita)
            despesas_por_periodo.append(despesa)

    movimentacoes_api = []

    for movimentacao in movimentacoes:

        if period == "year":
            indice_periodo = movimentacao.data.month - 1

        else:
            indice_periodo = (movimentacao.data - inicio).days

        movimentacoes_api.append({

            "id": movimentacao.id,

            "descricao": movimentacao.descricao,

            "valor": movimentacao.valor,

            "categoria": movimentacao.categoria,

            "tipo": movimentacao.tipo,

            "data": movimentacao.data.strftime("%Y-%m-%d"),

            "indice_periodo": indice_periodo
        })

    return {
        "periodo": period,
        "inicio": inicio.strftime("%Y-%m-%d"),
        "fim": hoje.strftime("%Y-%m-%d"),

        "labels": labels,

        "receitas": receitas_por_periodo,

        "despesas": despesas_por_periodo,

        "movimentacoes": movimentacoes_api
    }


@main.route("/api/categories")
def categories():

    period = request.args.get("period", "month")

    hoje = date.today()

    if period == "week":
        inicio = hoje - timedelta(days=6)

    elif period == "month":
        inicio = hoje.replace(day=1)

    elif period == "year":
        inicio = hoje.replace(month=1, day=1)

    else:
        return {"erro": "Período inválido."}, 400

    movimentacoes = (
        Movimentacao.query
        .filter(Movimentacao.data >= inicio)
        .filter(Movimentacao.data <= hoje)
        .all()
    )

    categorias = {}

    for movimentacao in movimentacoes:

        if movimentacao.tipo != "Despesa":
            continue

        categoria = movimentacao.categoria

        if categoria not in categorias:
            categorias[categoria] = 0

        categorias[categoria] += movimentacao.valor

    categorias_ordenadas = sorted(
        categorias.items(),
        key=lambda item: item[1],
        reverse=True
    )

    categorias_ordenadas = categorias_ordenadas[:5]

    return {
        "periodo": period,
        "categorias": [
            {
                "nome": categoria,
                "valor": valor
            }
            for categoria, valor in categorias_ordenadas
        ]
    }