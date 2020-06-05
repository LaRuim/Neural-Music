import os
from flask import Flask, flash, json, redirect, request, session
from flask_session import Session
from flask_cors import CORS
from flask_pymongo import PyMongo
from tempfile import mkdtemp
from werkzeug.security import check_password_hash, generate_password_hash
import subprocess

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/myDatabase"
app.config["TEMPLATES_AUTO_RELOAD"] = True
CORS(app)
app.config["SECRET_KEY"] = "OCML3BRawWEUeaxcuKHLpw"
app.secret_key = "OCML3BRawWEUeaxcuKHLpw"

app.config['MONGO_DBNAME'] = 'db'

mongo = PyMongo(app)


@app.after_request
def after_request(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response

Session(app)

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":

        USER = request.form.get("username")
        user = list(mongo.db.temp.find({'username': USER}))

        if len(user) != 1 or not check_password_hash(user[0]["hash"], request.form.get("password")):
            return app.response_class(response=json.dumps({'body': 'NOT OK'}),
                                  status=401,
                                  mimetype='application/json')
        else:
            return app.response_class(response=json.dumps({'body': 'LOL OK'}),
                                    status=200,
                                    mimetype='application/json')

    else:
        return app.response_class(response=json.dumps({'body': 'WOT'}),
                                  status=501,
                                  mimetype='application/json')

@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":

        USER = request.form.get("username")
        user = list(mongo.db.temp.find({'username': USER}))
        if len(user) >= 1:
            return app.response_class(response=json.dumps({'body': 'NOT OK'}),
                                  status=401,
                                  mimetype='application/json')

        


        HASH=generate_password_hash(request.form.get("password"))
        mongo.db.temp.insert_one({'username': USER, 'hash': HASH})
        
        itm = mongo.db.temp.find_one({"username":USER})
        #session['username'] = itm.get('_id')

        return app.response_class(response=json.dumps({'body': 'LOL OK'}),
                                  status=200,
                                  mimetype='application/json')
    else:
        return 101

@app.route("/generate", methods=["GET", "POST"])
def generate():
    if request.method == 'POST':
        import create_midi
        return app.response_class(response=json.dumps({'body': 'LOL OK'}),
                                  status=200,
                                  mimetype='application/json')


