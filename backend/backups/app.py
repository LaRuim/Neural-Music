import os
from flask import Flask, flash, json, redirect, request, session, url_for
from flask_session import Session
from flask_cors import CORS, cross_origin
from flask_pymongo import PyMongo
from tempfile import mkdtemp
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename
import subprocess
import sys
sys.path.append('./scripts')
import noiseCancellation
import makeBackingTrack
import makeLeadTrack
import convertToMIDIMelodia
import convertToMIDIWaon
import log

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
            print(f'{session["username"]} logged in.')
            print(session)
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
        print(f'{USER} wants to register')
        user = list(mongo.db.temp.find({'username': USER}))
        
        if len(user) >= 1:
            return app.response_class(response=json.dumps({'body': 'NOT OK'}),
                                  status=401,
                                  mimetype='application/json')

        HASH=generate_password_hash(request.form.get("password"))
        mongo.db.temp.insert_one({'username': USER, 'hash': HASH, 'darkmode': False, 'uploadFileID': 1, 'leadID': 1})

        return app.response_class(response=json.dumps({'body': 'OK'}),
                                  status=200,
                                  mimetype='application/json')
    else:
        return 101


@app.route("/generate", methods=["GET", "POST"])
@cross_origin(supports_credentials=True)
def generate():
    if request.method == 'POST':
        BPM = float(request.form.get('BPM'))
        offset = float(request.form.get('Offset'))
        cycles = int(request.form.get('cycles'))

        if request.form.get('generate') == 'Lead':  
            chordProgression = request.form.get('chordProgression')
            scale = request.form.get('scale')
            notes = request.form.get('notes')
            userData = mongo.db.temp.find_one({'username':session.get('username')})

            IDName = userData.get('_id')
            fileID = userData.get('leadID')
            filename = secure_filename(f'{IDName}:lead_{fileID}')
            fileID += 1
            mongo.db.temp.update_one({'_id': IDName}, {'$set':{'uploadFileID':fileID}}) 

            makeLeadTrack.make(fileName=fileName, scale=scale, notes=notes, progression=chordProgression, BPM=BPM, offset=offset, cycles=cycles)

        elif request.form.get('generate') == 'Backing':
            leadPath = request.form.get('path')
            arpeggio = True if request.form.get('arpeggio') == 'true' else False
            minDuration = float(request.form.get('minDuration'))/1000

            qindex = leadPath.index('?')+10
            fileName = leadPath[qindex:]
            leadPath = f'./static/userMusic/{fileName}'
            fileName = fileName[:-4]
            convertedMIDIPath = f'./static/userMIDIs/{fileName}.mid'
            ''' There are 2 methods to do audio-to-MIDI conversion; Right now, we're going with Melodia '''

            convertToMIDIMelodia.convertToMIDI(leadPath, convertedMIDIPath, bpm=BPM, minduration=minDuration) 
            #convertToMIDIWaon.convertToMIDI(leadPath, '../frontend/public/uploadSongs/leadPath.mid')

            outFileName = f'{fileName}_backing'
            makeBackingTrack.make(leadPath=convertedMIDIPath, outFileName=outFileName, BPM=BPM, offset=offset, cycles=cycles, arpeggio=arpeggio)
            userBackingTrack = {"src": f'http://localhost:5000/myMusic?filename={outFileName}.mp3',
                                "name": 'Backing Track ',
                                "waveOutlineColor": '#c0dce0'}           
            return app.response_class(response=json.dumps({'body': userBackingTrack}),
                                  status=200,
                                  mimetype='application/json')


@app.route("/upload", methods=["GET", "POST"])
@cross_origin(supports_credentials=True)
def upload():
    if request.method == 'POST':
        song = request.files['file']
        userData = mongo.db.temp.find_one({'username':session.get('username')})
        IDName = userData.get('_id')
        fileID = userData.get('uploadFileID')

        filename = secure_filename(f'{IDName}-{fileID}') +'.wav'
        fileID += 1
        mongo.db.temp.update_one({'_id': IDName}, {'$set':{'uploadFileID':fileID}})
        destination="/".join(['./static/userMusic', filename])
        
        song.save(destination)

        try:
            noiseCancellation.noiseCancel(destination)
        except:
            pass

        userTrack = {"src": f'http://localhost:5000/myMusic?filename={filename}',
                   "name": 'Track ' + str(fileID-1),
                   "waveOutlineColor": '#c0dce0',
                   "customClass": "vocals"}

        return app.response_class(response=json.dumps({'body': userTrack}),
                                  status=200,
                                  mimetype='application/json')


@app.route('/authenticate', methods=["GET", "POST"])
@cross_origin(supports_credentials=True)
def authenticate():
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


@app.route('/myMusic', methods=['GET']) # Frontend sends a request to this URL, based on the 'load' route
@cross_origin(supports_credentials=True)
def music():
    song = request.args.get('filename')
    print('THIS IS THE FILEPATH:', url_for('static', filename=f'userMusic/{song}'))
    return redirect(url_for('static', filename=f'userMusic/{song}'))


@app.route('/load', methods=["GET", "POST"]) # Modify to load only certain tracks
@cross_origin(supports_credentials=True)
def load():
    userData = mongo.db.temp.find_one({'username':session.get('username')})
    IDName = userData.get('_id')
    fileID = userData.get('uploadFileID')
    filenames = os.listdir('./static/userMusic')
    songs = []
    for filename in filenames:
        print(IDName, filename.split('-')[0])
        if str(IDName) == str(filename.split('-')[0]): 
            userTrack = {"src": f'http://localhost:5000/myMusic?filename={filename}',
            "name": 'Track ' + str(filename.split('-')[1]),
            "waveOutlineColor": '#c0dce0',
            "customClass": "vocals"}
            container = []
            container.append(userTrack)
            songs.append(container)
            #fileID += 1
    return app.response_class(response=json.dumps({'body': songs}),
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
