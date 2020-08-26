import React, { useState, useEffect, useRef } from 'react';
import { addUserTrack, clearUserTracks } from '../actions/actions.js'
import { useSelector, useDispatch } from 'react-redux'

import Tooltip from "@material-ui/core/Tooltip";

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/styles/App.css';
import { store } from '../store/index.js';

const ToMIDI = (props) => {
    
    const [index, setIndex] = useState(1)
    const [BPM, setBPM] = useState(130)
    const [noteTolerance, setNoteTolerance] = useState(70)
    const [voicing, setVoicing] = useState(10)

    const onNext = (VAL) => {
        setIndex(VAL);
    }
    const dispatch = useDispatch();

    const handleReq = (event, TrackPath='') => {
        event.preventDefault();
        var request = new FormData();
        request.append('path', TrackPath)
        request.append('BPM', BPM)
        request.append('minDuration', noteTolerance)
        request.append('voicing', voicing)

        fetch('http://localhost:5000/midi', {
            method: 'POST',
            body: request,
            credentials: 'include'
            }).then(response => {
            if (response['status'] == 200){
              response.json().then((responseJSON) => {
                var response = responseJSON
                var trackDetails = response['body']
                var newTrack = []
                newTrack.push(trackDetails)
                dispatch(addUserTrack(newTrack))
                var request = new FormData();
                request.append('urlMIDI', trackDetails['src'].split('=')[1].split('.')[0] + '.mid')
                fetch('http://localhost:5000/myMIDI', {
                    method: 'POST',
                    body: request,
                    credentials: 'include'
                    }).then(response => {
                      console.log(response)
                      response.json().then((responseJSON) => {
                        var response = responseJSON
                        console.log(response) // Find a way to allow the server to send the MIDI file, and allow the user to download it.
                      })   
                })
                window.location.reload();
              })
            }
            else{
                alert('This part is still under development; Need backend code!');
            }
        })
    }
    
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        backdrop="static"
        keyboard={false}
        animation={true} 
        className='midi' 
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <h3 style={{color:'black'}}>Convert to MIDI</h3>
          </Modal.Title>
        </Modal.Header>
        {index == 1 && <><Modal.Body>
          <h4 style={{color:'black'}}>Parameters</h4>
          <p style={{color:'black'}}>
            Choose your required parameters.
          </p>
          <div className='text-center'>
            
            <div className="def-number-input number-input small">
              <Tooltip title="Beats Per Minute of your Track" placement="left">
                <div style={{display: 'inline-block'}}>
                  <h5 style={{color:'black', fontSize:'1.25em'}}>BPM</h5>
                  <input className="quantity" name="BPM" value={BPM} onChange={(event)=> setBPM(event.target.value)} type="number" />
                </div>
              </Tooltip>
              <Tooltip title="Number of milliseconds a sound must be present for it to be considered a distinct note" placement="bottom">
                <div style={{display: 'inline-block'}}>
                  <h5 style={{color:'black', fontSize:'1.25em'}}>Note Tolerance (ms)</h5>
                  <input className="quantity" name="tolerance" value={noteTolerance} onChange={(event)=> setNoteTolerance(event.target.value)} type="number" step="any"/>
                </div>
              </Tooltip>
              <Tooltip title="Only change if you know waht you're doing." placement="right">
                <div style={{display: 'inline-block'}}>
                  <h5 style={{color:'black', fontSize:'1.25em'}}>Voicing</h5>
                  <input className="quantity" name="voicing" value={voicing} onChange={(event)=> setVoicing(event.target.value)} type="number" step="any"/>
                </div>
              </Tooltip>
            </div>
            <br></br>
            <Button onClick={(event) => {
                  var tracks = store.getState().userTracks
                  var trackPath = tracks[tracks.length-1][0].src
                  handleReq(event, trackPath)
                  onNext(2);
                }} variant='primary'>
              Generate
            </Button>
          </div>
        </Modal.Body>
        </>}
        {index == 2 && <><Modal.Body>
          <h4 style={{color:'black'}}>Converting your audio to MIDI form.</h4>
          <p style={{color:'black'}}>
            Please wait while your MIDI and MIDI preview are generated. 
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer></>}
      </Modal>
    );
  }
  

export default ToMIDI