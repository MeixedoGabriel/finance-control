from flask import Blueprint, render_template, request, redirect, url_for
from app.extensions import db
from app.models import Movimentacao
from datetime import datetime


main = Blueprint("main", __name__)


@main.route("/")
def home():

    movimentacoes = (
        Movimentacao.query
        .order_by(Movimentacao.data.desc())
        .all()
    )

    saldo = 0

    for movimentacao in movimentacoes:

        if movimentacao.tipo == "Receita":
            saldo += movimentacao.valor

        else:
            saldo -= movimentacao.valor

    return render_template(
        "index.html",
        movimentacoes=movimentacoes,
        saldo=saldo
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