import os
from flask import Flask, flash, json, redirect, request, session
from flask_session import Session
from flask_cors import CORS, cross_origin
from flask_pymongo import PyMongo
from tempfile import mkdtemp
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename
import subprocess
import sys
sys.path.append('./scripts')
import BackingTrack as backingTrack
import makeMIDI

song = 0

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/myDatabase"
app.config["TEMPLATES_AUTO_RELOAD"] = True
CORS(app)
app.config["SECRET_KEY"] = "OCML3BRawWEUeaxcuKHLpw"
app.secret_key = "OCML3BRawWEUeaxcuKHLpw"

app.config['MONGO_DBNAME'] = 'db'


app.config["SESSION_FILE_DIR"] = mkdtemp()
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
mongo = PyMongo(app)


@app.after_request
def after_request(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response

Session(app)

@app.route("/login", methods=["GET", "POST"])
@cross_origin(supports_credentials=True)
def login():
    session.clear()
    if request.method == "POST":

        USER = request.form.get("username")
        user = list(mongo.db.temp.find({'username': USER}))

        if len(user) != 1 or not check_password_hash(user[0]["hash"], request.form.get("password")):
            return app.response_class(response=json.dumps({'body': 'NOT OK'}),
                                  status=401,
                                  mimetype='application/json')
        else:
            itm = mongo.db.temp.find_one({"username":USER})
            session['username'] = itm.get('username')
            print(session)
            print(session['username'])
            return app.response_class(response=json.dumps({'body': 'OK'}),
                                    status=200,
                                    mimetype='application/json')

    else:
        return app.response_class(response=json.dumps({'body': 'WOT'}),
                                  status=501,
                                  mimetype='application/json')

@app.route("/register", methods=["GET", "POST"])
@cross_origin(supports_credentials=True)
def register():
    if request.method == "POST":
        session.clear()
        USER = request.form.get("username")
        user = list(mongo.db.temp.find({'username': USER}))

        if len(user) >= 1:
            return app.response_class(response=json.dumps({'body': 'NOT OK'}),
                                  status=401,
                                  mimetype='application/json')

        HASH=generate_password_hash(request.form.get("password"))
        mongo.db.temp.insert_one({'username': USER, 'hash': HASH, 'darkmode': False})

        return app.response_class(response=json.dumps({'body': 'OK'}),
                                  status=200,
                                  mimetype='application/json')
    else:
        return 101

@app.route("/generate", methods=["GET", "POST"])
@cross_origin(supports_credentials=True)
def generate():
    if request.method == 'POST':
        print(request.form)
        if request.form.get('generate') == 'Lead':
            pass
        elif request.form.get('generate') == 'Backing':
            lead = session['uploadFilePath']
            print(lead)
            makeMIDI.makeMIDI(lead, '../frontend/public/uploadSongs/lead.mid', 125, minduration=0.1)
            backingTrack.make()
        """try:
            imp.reload(create_midi)
        except:
            import create_midi"""
        return app.response_class(response=json.dumps({'body': 'OK'}),
                                  status=200,
                                  mimetype='application/json')

@app.route("/upload", methods=["GET", "POST"])
@cross_origin(supports_credentials=True)
def upload():
    if request.method == 'POST':
        song = request.files['file']
        filename = secure_filename('lead.wav')
        destination="/".join(['../frontend/public/uploadSongs', filename])
        song.save(destination)
        session['uploadFilePath'] = destination
        return app.response_class(response=json.dumps({'body': 'OK'}),
                                  status=200,
                                  mimetype='application/json')

@app.route('/authenticate', methods=["GET", "POST"])
@cross_origin(supports_credentials=True)
def authenticate():
    print(session)
    print(session.get('username'))
    if session.get('username') is None:
        return {'body': 'NOK'}, 401
    else:
        return {'body': 'OK'}, 200

@app.route('/userdetails', methods=["GET", "POST"])
@cross_origin(supports_credentials=True)
def getuserdetails():
    if request.method == 'GET':
        username = session.get('username')
        user = list(mongo.db.temp.find({'username': username}))
        userdetails = {}
        for key in user[0]:
            userdetails[key] = str(user[0][key])

        print(userdetails)

        return app.response_class(response=json.dumps({'body': userdetails}),
                                    status=200,
                                    mimetype='application/json')
            
@app.route('/logout', methods=["GET", "POST"])
@cross_origin(supports_credentials=True)
def logout():
    if request.method == 'POST':
        session.clear()
        return app.response_class(response=json.dumps({'body': 'OK'}),
                                  status=200,
                                  mimetype='application/json')


