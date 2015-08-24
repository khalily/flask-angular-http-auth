import os

from flask import Flask, render_template
from flask.ext.sqlalchemy import SQLAlchemy


basedir = os.path.abspath(os.path.dirname(__file__))
basedir = os.path.abspath(os.path.dirname(basedir))

app = Flask(__name__)

app.config['DEBUG'] = True
app.config['SECRET_KEY'] = '123456'
app.config['SQLALCHEMY_COMMIT_ON_TEARDOWN'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + \
        os.path.join(basedir, 'dev-data.sqlite')

db = SQLAlchemy(app)

from auth import auth as auth_blueprint
app.register_blueprint(auth_blueprint, url_prefix='/auth')


@app.route('/')
def index():
  return render_template('index.html')
