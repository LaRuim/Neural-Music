import React, { useState, useCallback, createElement, setRef } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import WaveformPlaylist from 'waveform-playlist';
import { addUserTrack, clearUserTracks } from '../actions/actions.js'

import '../components/styles/AudioPlayer.css'
import '../components/styles/App.css';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import { store } from '../store/index.js';



const AudioPlayer = (theme) => {

    // These are all hooks; They're basically variables that cause re-renders on change
    var [eventEmitter, setEventEmitter] = useState(null);
    var [playlist, setPlaylist] = useState(null);
    var [audioData, set] = useState({})
    var [downloadRequest, downloaded] = useState(false)
    var [downloadLink, makeLink] = useState(null);
    var [paused, pauser] = useState(true);
    var [format, setFormat] = useState("hh:mm:ss");
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);
    
    // Get already loaded usertracks; Reload them back on a page refresh
    const userTracks = useSelector(state => state.userTracks)

    const dispatch = useDispatch();

    var startTime = 0;
    var endTime = 0;
    var audioPos = 0;
    var downloadUrl = undefined;
    var isLooping = false;
    var playoutPromises;

    // For the playback time format
    const timeFormatter = (format) => {
        const makeFormat = (seconds, decimals) => {
            var hours, minutes, secs, result;
            hours = parseInt(seconds / 3600, 10) % 24;
            minutes = parseInt(seconds / 60, 10) % 60;
            secs = seconds % 60;
            secs = secs.toFixed(decimals);

            result = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (secs < 10 ? "0" + secs : secs);
            return result;
        }

        var formats = {
            "seconds": (seconds) => {
                return seconds.toFixed(0);
            },
            "thousandths": (seconds) => {
                return seconds.toFixed(3);
            },
            "hh:mm:ss": (seconds) => {
                return makeFormat(seconds, 0);   
            },
            "hh:mm:ss.u": (seconds) => {
                return makeFormat(seconds, 1);   
            },
            "hh:mm:ss.uu": (seconds) => {
                return makeFormat(seconds, 2);   
            },
            "hh:mm:ss.uuu": (seconds) => {
                return makeFormat(seconds, 3);   
            }
        };

        return formats[format];
        }

    // To create download link for edited song
    const displayDownloadLink = (link) => {
        console.log(link)
        var dateString = (new Date()).toISOString();
        var Link = createElement('a', {
            'title' : 'Download your song as a .wav file',
            'href': link,
            'className': "btn btn-download btn-primary",
            'download': 'waveformplaylist' + dateString + '.wav',
        }, createElement("i", {
            'text': 'Download mix ' + dateString,
            'className': 'fa fa-download',
            'href': link,
            'download': 'NeuralMoosic' + dateString + '.wav'
            }));
        makeLink(Link);
        }

    const updateSelect = (start, end, trimaudionode, loopnode, audioStart, audioEnd, format) => {
        if (start < end) {
            trimaudionode.classList.remove('disabled');
            loopnode.classList.remove('disabled');
        }
        else {
            trimaudionode.classList.add('disabled');
            loopnode.classList.add('disabled');
        }

        audioStart.value = timeFormatter(format)(start);
        audioEnd.value = timeFormatter(format)(end);

        startTime = start;
        endTime = end;
    }

    const updateTime = (time, audioposnode, format) => {
        audioposnode.innerHTML = timeFormatter(format)(time)
        audioPos = time;
    }
    
    // Send request containing uploaded song to backend
    const uploadFile = (file) => {
        return new Promise(function(resolve, reject) {
            var request = new FormData()
            request.append('file', file)
            fetch('http://localhost:5000/upload', {
                method: 'POST',
                body: request,
                credentials: 'include',
            }
            ).then((response) => response.json().then((responseJSON)=>{
                var response = responseJSON
                var newTrack = []
                newTrack.push(response['body'])
                dispatch(addUserTrack(newTrack))
                resolve()
            })).catch(() => {})
        })
    }

    const loadUserSongs = () => {
        return new Promise(function(resolve, reject) {
        var request = new FormData()
        fetch('http://localhost:5000/load', {
            method: 'POST',
            body: request,
            credentials: 'include',
        }
        ).then((response) => {response.json().then((responseJSON)=>{
            var response = responseJSON
            console.log(response['body'])
            eventEmitter.emit('Clear')
            for (var track of response['body']){
                dispatch(addUserTrack(track))
            }
            resolve()
          })}).catch(() => {})
        })
    }

    const containerRendered = useCallback(container => {
        if(container !== null){

            const playlist = WaveformPlaylist({
                samplesPerPixel: 2048,
                waveHeight: 125,
                container,
                state: 'cursor',
                colors: {
                    waveOutlineColor: '#E0EFF1',
                    timeColor: 'grey',
                    fadeColor: 'black'
                },
                timescale: true,
                controls: {
                    show: true,
                    width: 200 
                },
                seekStyle : 'line',
                zoomLevels: [16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192]
            });

            //var body = container.parentNode.parentNode.parentNode.parentNode            
            var audioStart = document.getElementsByClassName('audio-start')[0]
            var audioEnd = audioStart.nextSibling;
            var audioposnode = document.getElementsByClassName('audio-pos')[0]
            var loopnode = document.getElementsByClassName('btn-loop')[0]
            var trimaudionode = loopnode.nextSibling
            
            set({'audioStart': audioStart, 
                 'audioEnd': audioEnd,
                 'audioposnode': audioposnode,
                 'loopnode': loopnode,
                 'trimaudionode': trimaudionode, 
                })

            const updateselect = (start, end) => {
                var format = document.getElementsByClassName('time-format')[0].value
                updateSelect(start, end, trimaudionode, loopnode, audioStart, audioEnd, format);
            }
            const updatetime = (time) => {
                var format = document.getElementsByClassName('time-format')[0].value
                updateTime(time, audioposnode, format)
            }

            eventEmitter = playlist.getEventEmitter()
            eventEmitter.on("select", updateselect);
            eventEmitter.on("timeupdate", updatetime);
            eventEmitter.on("stop", pauser)
            eventEmitter.on('audiorenderingfinished', (type, data) => {
                if (type == 'wav'){
                    if (downloadUrl) {
                        window.URL.revokeObjectURL(downloadUrl);
                    }
                    downloadUrl = window.URL.createObjectURL(data);
                    console.log(downloadUrl)
                    displayDownloadLink(downloadUrl);
                    downloaded(true);
                }
            });
            eventEmitter.on('finished', () => {
                if (isLooping) {
                  playoutPromises.then(() => {
                    playoutPromises = playlist.play(startTime, endTime);
                  });
                pauser(true)
                }
              });
            eventEmitter.on('addUploadedTrack', () => {
                var usertracks = store.getState().userTracks
                var track = usertracks[usertracks.length - 1]
                playlist.load(track)
            })
            eventEmitter.on('addTrack', (track) => {
                playlist.load(track)
            })
            eventEmitter.on('Clear', () => {
                dispatch(clearUserTracks())
                eventEmitter.emit('clear')
            })

            setEventEmitter(eventEmitter);  

            var usersTracks = store.getState().userTracks
            console.log('Tracks are:', ...usersTracks)
            for (var track of usersTracks){
                playlist.load(track).then(function() {
                    playlist.initExporter();
                }).finally(() => {
                    setPlaylist(playlist);
                    updateSelect(startTime, endTime, trimaudionode, loopnode, audioStart, audioEnd, format)
                    updateTime(audioPos, audioposnode, format)
                    //eventEmitter.emit('Clear')
                });
            }

        }
    }, []);

    return(
        <div>
            <br/>
            <br/>
            <meta charSet="utf-8"/>
            <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <meta property="og:image:height" content="401"/>
            <meta property="og:image:width" content="1039"/>
            <div>
            <div className="container-fluid">
                <div className="wrapper">
                <article className="post">  
                    <div className="post-content">
                    <div id="top-bar" className="playlist-top-bar" style = {{marginLeft:'-80px'}}>
                        <ToggleButtonGroup defaultValue= {1} type='radio' name='editoptions' className="btn-playlist-state-group" style = {{marginLeft:'20em'}}>
                            <ToggleButton
                            variant={theme.buttontheme}
                            className="btn-cursor"
                            title="select cursor"
                            value={1}
                            onClick = {(event) => {
                                eventEmitter.emit("statechange", "cursor");
                            }} >
                            <i className="fa fa-headphones"/>
                            </ToggleButton>
                            <ToggleButton
                            value={2}
                            variant={theme.buttontheme}
                            className="btn-select"
                            title="select audio region"
                            
                            onClick = {(event) => {
                                eventEmitter.emit("statechange", "select");
                                eventEmitter.emit("pause");
                                pauser(true);
                            }}
                            >
                            <i className="fa fa-italic" />
                            </ToggleButton>
                            <ToggleButton
                            value={3}
                            variant={theme.buttontheme}
                            className="btn-shift"
                            title="shift audio in time"
                            onClick = {(event) => {
                                eventEmitter.emit("statechange", "shift");
                            }}
                            >
                            <i className="fa fa-arrows-alt-h" />
                            </ToggleButton>
                            <ToggleButton
                            value={4}
                            variant={theme.buttontheme}
                            className="btn-fadein"
                            title="set audio fade in"
                            onClick = {(event) => {
                                eventEmitter.emit("statechange", "fadein");
                            }}
                            >
                            <i className="fa fa-arrow-right" />
                            </ToggleButton>
                            <ToggleButton
                            value={5}
                            variant={theme.buttontheme}
                            className="btn-fadeout"
                            title="set audio fade out"
                            onClick = {(event) => {
                                eventEmitter.emit("statechange", "fadeout");
                            }}
                            >
                            <i className="fa fa-arrow-left" />
                            </ToggleButton>
                        </ToggleButtonGroup>
                        <ToggleButtonGroup defaultValue= {1} type='radio' name='fadetype' className="btn-group btn-fade-state-group" style = {{marginLeft:'10px'}}>
                            <ToggleButton
                            type='checkbox'
                            value={1}
                            variant={theme.buttontheme}
                            className="btn-logarithmic"
                            onClick = {event => eventEmitter.emit("fadetype", "logarithmic")}>
                                logarithmic
                            </ToggleButton>
                            <ToggleButton
                            type='checkbox'
                            value={2}
                            variant={theme.buttontheme}
                            className="btn-linear"
                            onClick = {event => eventEmitter.emit("fadetype", "linear")}>
                            linear</ToggleButton>
                            <ToggleButton
                            type='checkbox'
                            value={3}
                            variant={theme.buttontheme}
                            className="btn-exponential"
                            onClick = {event => eventEmitter.emit("fadetype", "exponential")}>
                            exponential
                            </ToggleButton>
                            <ToggleButton
                            type='checkbox'
                            value={4}
                            variant={theme.buttontheme}
                            className="btn-scurve"
                            onClick = {event => eventEmitter.emit("fadetype", "sCurve")}>
                            s-curve</ToggleButton>
                        </ToggleButtonGroup>
                        <ToggleButtonGroup type='radio' name='zoom' className="btn-group" style = {{marginLeft:'7em'}}>
                            <ToggleButton
                                type='checkbox'

                                variant={theme.buttontheme}
                                title="zoom in" className="btn-zoom-in"
                                onClick = {() =>{eventEmitter.emit("zoomin");}}>    
                                <i className="fa fa-search-plus" />
                            </ToggleButton>
                            <ToggleButton
                            type='checkbox'
                            variant={theme.buttontheme}
                                title="zoom out" className="btn-zoom-out"
                                onClick = {() =>{eventEmitter.emit("zoomout");}}>
                                <i className="fa fa-search-minus" />
                            </ToggleButton>
                        </ToggleButtonGroup>
                    <div ref={containerRendered} style = {{marginLeft:'1em'}}/>
                    <div className="playlist-toolbar">
                         <ButtonGroup  style = {{marginLeft:'22em', marginTop: '-2em'}}>
                            {!paused &&<span className="btn-pause btn btn-warning" 
                                    onClick = {() =>{isLooping = false;
                                        eventEmitter.emit("pause");
                                        pauser(true);}}>
                            <i className="fa fa-pause" />
                            </span>}
                            {paused && <span className="btn-play btn btn-success" 
                                    onClick = {() =>{eventEmitter.emit("play");
                                    console.log(playlist.tracks[0])
                                                pauser(false)}}>
                            <i className="fa fa-play" />
                            </span>}
                            <span className="btn-stop btn btn-danger"
                                    onClick = {() =>{isLooping = false;
                                        eventEmitter.emit("stop");
                                        pauser(true);}}>
                            <i className="fa fa-stop" />
                            </span>
                            <span className="btn-rewind btn btn-success"
                                    onClick = {() =>{isLooping = false;
                                        eventEmitter.emit("rewind");}}>
                            <i className="fa fa-fast-backward" />
                            </span>
                            <span className="btn-fast-forward btn btn-success"
                                    onClick = {() =>{isLooping = false;
                                        eventEmitter.emit("fastforward");}}>                
                            <i className="fa fa-fast-forward" />
                            </span>
                        </ButtonGroup>
                        <ButtonGroup className="btn-select-state-group" style = {{marginLeft:'10px', marginTop: '-2em'}}>
                            <span
                            className="btn-loop btn btn-success disabled"
                            title="loop a selected segment of audio"
                            onClick={()=>{isLooping = true;
                                playoutPromises = playlist.play(startTime, endTime);}}
                            >
                            <i className = 'fa fa-sync-alt'/>
                            </span>
                            <span
                            title="keep only the selected audio region for a track"
                            className="btn-trim-audio btn btn-primary disabled"
                            onClick = {() =>{eventEmitter.emit("trim");}}>
                            Trim
                            </span>
                        </ButtonGroup>
                        <ButtonGroup style = {{marginLeft:'10px', marginTop: '-2em'}}>
                            <span
                            title="Prints playlist info to console"
                            className="btn btn-info"
                            onClick = {() => console.log(...playlist.getInfo())}
                            >
                            Print
                            </span>
                            <span
                            title="Clear the playlist's tracks"
                            className="btn btn-clear btn-danger"
                            onClick = {() =>{isLooping = false;
                                eventEmitter.emit("Clear");
                                updateSelect(0, 0, audioData['trimaudionode'], audioData['loopnode'],
                                            audioData['audioStart'], audioData['audioEnd'], format);
                                updateTime(0, audioData['audioposnode'], format);
                                pauser(true);
                                downloaded(false);
                            }}>
                            Clear
                            </span>
                        </ButtonGroup>
                        <ButtonGroup style = {{marginLeft:'10px',  marginTop: '-2em'}}>
                            {!downloadRequest && <span
                            title="Prepare current file for downloading"
                            className="btn btn-download btn-primary"
                            onClick = {() => eventEmitter.emit('startaudiorendering', 'wav')}
                            >
                            Prepare
                            </span>}
                            {downloadRequest && downloadLink}
                            <span
                            title="Load your songs"
                            className="btn blue-gradient"
                            onClick = {() =>{
                                loadUserSongs().then(()=> {
                                    console.log('hello')
                                    var usertracks = store.getState().userTracks
                                    for (var track of userTracks){
                                        eventEmitter.emit('addTrack', track)
                                    }
                                })
                            }}>
                            Load your tracks! {/*(Right now, all are loaded. We need a way to load based on user choice.)*/}
                            </span>
                        </ButtonGroup>
                        </div>
                    </div>
                    <br/><br/>
                    <div className="playlist-bottom-bar">
                        <form className="form-inline">
                        <select className="time-format form-control" style = {{marginLeft:'-80px'}}
                            onChange = {(event) => {
                                var format = event.target.value
                                eventEmitter.emit("durationformat", format);
                                setFormat(format);
                                updateSelect(startTime, endTime, audioData['trimaudionode'], audioData['loopnode'],
                                            audioData['audioStart'], audioData['audioEnd'], format);
                                updateTime(audioPos, audioData['audioposnode'], format);
                            }}
                            defaultValue="hh:mm:ss"
                            >
                            <option value="seconds">seconds</option>
                            <option value="thousandths">thousandths</option>
                            <option value="hh:mm:ss">hh:mm:ss</option>
                            <option value="hh:mm:ss.u">hh:mm:ss + tenths</option>
                            <option value="hh:mm:ss.uu">hh:mm:ss + hundredths</option>
                            <option value="hh:mm:ss.uuu">
                            hh:mm:ss + milliseconds
                            </option>
                        </select>
                        
                        <input
                            type="text"
                            style = {{marginLeft:'1em'}}
                            className="audio-start col-xs-1 form-control"
                        />
                        <input type="text" className="audio-end form-control" />
                        <p className="audio-pos" style = {{marginLeft:'1em', marginTop:'1em'}}>00:00:00</p>
                        </form>
                        <br/>
                        <form className="form-inline" style = {{marginLeft:'-80px'}}>
                        <div className="form-group">
                            <p htmlFor="master-gain" style={{marginTop:'1em'}}>Master Volume: </p>
                            <input
                            style = {{marginLeft:'1em'}}
                            type="range"
                            min={0}
                            max={100}
                            defaultValue={100}
                            id="master-gain"
                            onInput = {(event) => {
                                eventEmitter.emit("mastervolumechange", event.target.value);
                            }}
                            />
                        </div>
                        <div className="checkbox" style = {{marginLeft:'1em'}}>
                            <p style={{marginTop:'1em'}}>
                            <input type="checkbox" className="automatic-scroll"
                                onChange = {(event) => eventEmitter.emit("automaticscroll", event.target.checked)}
                            />{" "}
                            Automatic Scroll
                            </p>
                        </div>
                        </form>
                        <br/>
                        <form className="form-inline" style = {{marginLeft:'-80px'}}>
                        <div className="control-group">
                            <p htmlFor="time" style={{marginTop:'1em'}}>Seek to time (in seconds):</p>
                            <input
                            type="number"
                            className="form-control"
                            defaultValue={14}
                            id="seektime"
                            className='seektime'
                            />
                            <Button className="btn-seektotime"
                                variant='secondary'
                                onClick = {(event)=>{
                                    var time = parseInt(event.target.previousSibling.value, 10);
                                    eventEmitter.emit('select', time, time);
                                }}>Seek!</Button>
                        </div>
                        </form>
                        <div className="sound-status" />
                        <div className="track-drop"  
                                onDragEnter = {(event) => {
                                    event.preventDefault();
                                    event.target.classList.add("drag-enter");
                                }}
                                onDragOver = {(event) => event.preventDefault()} 
                                onDragLeave = {(event) => {
                                    event.preventDefault();
                                    event.target.classList.remove("drag-enter");
                                }}
                                onDrop = {(event) => {
                                    event.preventDefault();
                                    event.target.classList.remove("drag-enter");
                                    for (var i = 0; i < event.dataTransfer.files.length; i++) {
                                        //eventEmitter.emit("newtrack", event.dataTransfer.files[i]);
                                        uploadFile(event.dataTransfer.files[i]).then(()=>{
                                            eventEmitter.emit('addUploadedTrack')})
                                    }
                                }}   
                        />
                    </div>
                    </div>
                </article>
                </div>
            </div>
        </div>
    </div>
    )
}


export default AudioPlayer