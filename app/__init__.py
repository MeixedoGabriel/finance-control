from flask import Flask
from app.extensions import db


def create_app():
    app = Flask(__name__)

    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///finance.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)

    from app import models
    from app.routes import main

    app.register_blueprint(main)

    with app.app_context():
        db.create_all()

    return app