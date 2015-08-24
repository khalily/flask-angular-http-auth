from ..models import User
from flask import g, make_response, request
from flask.ext.httpauth import HTTPBasicAuth

http_auth = HTTPBasicAuth()

@http_auth.error_handler
def unauthorized():
    response = make_response()
    response.status_code = 401
    response.headers['WWW-Authenticate'] = 'xBasic realm="{0}"'.format('Authentication Required')
    return response

@http_auth.verify_password
def verify_password(username_or_token, password):
    if password == '':
        g.current_user = User.verify_auth_token(username_or_token)
        g.token_used = True
        return g.current_user != None
    user = User.query.filter_by(name=username_or_token).first()
    if not user:
        return False
    g.current_user = user
    g.token_used = False
    return user.verify_password(password)
