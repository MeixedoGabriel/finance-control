from datetime import date

from app.extensions import db


class Movimentacao(db.Model):
    __tablename__ = "movimentacoes"

    id = db.Column(db.Integer, primary_key=True)

    descricao = db.Column(db.String(150), nullable=False)

    valor = db.Column(db.Float, nullable=False)

    categoria = db.Column(db.String(50), nullable=False)

    tipo = db.Column(db.String(20), nullable=False)

    data = db.Column(db.Date, default=date.today, nullable=False)