from flask import request, make_response, jsonify, redirect, url_for
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity, create_access_token
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError

from config import app, db, api
from models import *

@app.route('/')
def index():
    return 'Hello World!'

if __name__ == '__main__':
    # Run the app locally in debug mode
    app.run(debug=True, port=5555)