import json
from flask import request, jsonify, abort, current_app, g, Response, make_response
from . import auth
from authentication import http_auth
from errors import bad_request

@auth.route('/login')
@http_auth.login_required
def login():
    if g.token_used:
        bad_request('must use password login')
    return jsonify({
        'token': g.current_user.generate_auth_token().encode('ascii'),
        'profile': {
            'name': g.current_user.name
        }
    })

@auth.route('/login_with_token')
@http_auth.login_required
def login_with_token():
    return jsonify({
        'profile': {
            'name': g.current_user.name
        }
    })
