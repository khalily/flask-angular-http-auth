import sys
from flask.ext.script import Manager
from myapp import app, db
from myapp.models import User

manager = Manager(app)

@manager.command
def create_db():
    db.create_all()

@manager.shell
def make_context():
    return dict(db=db, User=User)

if __name__ == '__main__':
    manager.run()
