import os
from flask import Flask, flash, jsonify, redirect, render_template, request, session
from flask_session import Session
from flask_cors import CORS
from flask_pymongo import PyMongo
from tempfile import mkdtemp
from werkzeug.security import check_password_hash, generate_password_hash   

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/myDatabase"
app.config["TEMPLATES_AUTO_RELOAD"] = True
CORS(app)

app.config['MONGO_DBNAME'] = 'db'

mongo = PyMongo(app)


@app.after_request
def after_request(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response

app.config["SESSION_FILE_DIR"] = mkdtemp()
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        if not request.form.get("username"):
            return jsonify(body='No Username', status=400)
        elif not request.form.get("password"):
            return jsonify(body='No Password', status=401)

        USER = request.form.get("username")
        rows = list(mongo.db.temp.find({'username': USER}))

        if len(rows) != 1 or not check_password_hash(rows[0]["hash"], request.form.get("password")):
            return {"body": "Error: Invalid Credentials"}, 103

        session["user_id"] = rows[0]["_id"]
        
        return jsonify(body='OK', status=200)
    else:
        return jsonify(body='NOT OK', status=501)

@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":

        USER = request.form.get("username")
        rows = list(mongo.db.temp.find({'username': USER}))
        
        if len(rows) >= 1:
            return {"body": "Error: Username Already Exists"}, 102

        USER=request.form.get("username")
        HASH=generate_password_hash(request.form.get("password"))
        mongo.db.temp.insert_one({'username': USER, 'hash': HASH})
        rows = list(mongo.db.temp.find({'username': USER}))
        print(rows)

        #session["user_id"] = new_id
        
        return jsonify(body='OK', status=200)
    else:
        return 101

