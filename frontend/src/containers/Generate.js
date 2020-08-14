import React, { useState, useEffect, useRef } from 'react';
import { addUserTrack, clearUserTracks } from '../actions/actions.js'
import { useSelector, useDispatch } from 'react-redux'

import Tooltip from "@material-ui/core/Tooltip";

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/styles/App.css';
import { store } from '../store/index.js';

const Generate = (props) => {
    
    const [index, setIndex] = useState(1)
    const [requiredTrackType, setRequiredTrackType] = useState(null)
    const [BPM, setBPM] = useState(130)
    const [sequenceLength, setSequenceLength] = useState(100)
    const [offset, setOffset] = useState(0)
    const [chordProgression, setProgression] = useState('6415')
    const [scale, setScale] = useState('C Major')
    const [cycles, setCycles] = useState(2)
    const [noteTolerance, setNoteTolerance] = useState(70)
    const [arpeggio, setArpeggio] = useState(false)
    const onNext = (VAL) => {
        setIndex(VAL);
    }
    const dispatch = useDispatch();

    const handleReq = (event, TrackPath='') => {
        event.preventDefault();
        var request = new FormData();
        request.append("generate", requiredTrackType);
        request.append('BPM', BPM)

        if (requiredTrackType == 'Backing'){
          request.append('path', TrackPath)
          request.append('Offset', offset)
          request.append('cycles', cycles)
          request.append('arpeggio', arpeggio)
          request.append('minDuration', noteTolerance)
        }
        else{
          request.append('chordProgression', chordProgression)
          request.append('scale', scale)
          request.append('sequenceLength', sequenceLength)
        }
        fetch('http://localhost:5000/generate', {
            method: 'POST',
            body: request,
            credentials: 'include'
            }).then(response => {
            console.log(response)
            if (response['status'] == 200){
              response.json().then((responseJSON) => {
                var response = responseJSON
                var newTrack = []
                newTrack.push(response['body'])
                dispatch(addUserTrack(newTrack))
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
        className='generator' 
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <h3 style={{color:'black'}}>Generate accompaniment</h3>
          </Modal.Title>
        </Modal.Header>
        {index == 1 && <><Modal.Body>
          <h4 style={{color:'black'}}>Track Type</h4>
          <p style={{color:'black'}}>
            What kind of track did you want?
          </p>
          <div className='text-center'>
              <ButtonGroup className='mr-5' size='lg'>
              <Button onClick={(event) => {
                    setRequiredTrackType('Backing')
                    onNext(2);
                }} variant='secondary'>Backing Track</Button>

              </ButtonGroup>
              <ButtonGroup className='mr-5'  size='lg'>
                <Button onClick={(event) => {
                    setRequiredTrackType('Lead')
                    onNext(3);
                }} variant='primary'>Lead Track (WIP)</Button>
              </ButtonGroup>
          </div>
        </Modal.Body>
        </>}
        {index == 2 && <><Modal.Body>
          <h4 style={{color:'black'}}>Track Details</h4>
          <p style={{color:'black'}}>
            Choose your required parameters.
          </p>
          <div className='text-center'>
            
            <div className="def-number-input number-input small">
              <Tooltip title="Beats Per Minute of your Lead Track" placement="left">
                <div style={{display: 'inline-block'}}>
                  <h5 style={{color:'black', fontSize:'1.25em'}}>BPM</h5>
                  <input className="quantity" name="BPM" value={BPM} onChange={(event)=> setBPM(event.target.value)} type="number" />
                </div>
              </Tooltip>
              <Tooltip title="Only change if you know what you're doing" placement="top">
                <div style={{display: 'inline-block', paddingLeft:'2em'}}>
                    <h5 style={{color:'black', fontSize:'1.25em'}}>Offset per chord</h5>
                  <input className="quantity" name="offset" value={offset} onChange={(event)=> setOffset(event.target.value)} type="number" step="any"/>
                </div>
              </Tooltip>
              <div style={{display: 'inline-block', paddingLeft:'2em'}}>
                <h5 style={{color:'black', fontSize:'1.25em'}}>Chord Cycles per measure</h5>
                <input className="quantity" name="Cycles" value={cycles} onChange={(event)=> setCycles(event.target.value)} type="number" />
              </div> 
            </div>
            <br></br>
            <div className="def-number-input number-input small">
              <Tooltip title="Number of milliseconds a sound must be present for it to be considered a distinct note" placement="left">
                <div style={{display: 'inline-block'}}>
                  <h5 style={{color:'black', fontSize:'1.25em'}}>Note Tolerance (ms)</h5>
                  <input className="quantity" name="tolerance" value={noteTolerance} onChange={(event)=> setNoteTolerance(event.target.value)} type="number" step="any"/>
                </div>
              </Tooltip>
              <Tooltip title="Whether the chords are played as one chord or in a broken style" placement="right">
                <div style={{display: 'inline-block', paddingLeft:'2em'}}>
                  <h5 style={{color:'black', fontSize:'1.25em'}}>Arpeggio?</h5>
                  <select className="browser-default custom-select-small" onChange={(e)=>setArpeggio(e.target.value)}>
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>
              </Tooltip>
            </div>
            <Button onClick={(event) => {
                  var tracks = store.getState().userTracks
                  var trackPath = tracks[tracks.length-1][0].src
                  handleReq(event, trackPath)
                  onNext(4);
                }} variant='primary'>
              Generate
            </Button>
          </div>
        </Modal.Body>
        </>}
        {index == 3 && <><Modal.Body> 
          <h4 style={{color:'black'}}>Track Details</h4>
          <p style={{color:'black'}}>
            Choose your required parameters.
          </p>
          <div className='text-center'>
            <div className="def-number-input number-input small">
              <Tooltip title="Beats Per Minute the generated Lead Track" placement="left">
                <div style={{display: 'inline-block'}}>
                  <h5 style={{color:'black', fontSize:'1.25em'}}>BPM</h5>
                  <input className="quantity" name="BPM" value={BPM} onChange={(event)=> setBPM(event.target.value)} type="number"/>
                </div>
              </Tooltip>
              <Tooltip title="Only change if you know what you're doing" placement="top">
                <div style={{display: 'inline-block', paddingLeft:'2em'}}>
                    <h5 style={{color:'black', fontSize:'1.25em'}}>Offset per chord</h5>
                  <input className="quantity" name="offset" value={offset} onChange={(event)=> setOffset(event.target.value)} type="number" step="any"/>
                </div>
              </Tooltip>
              <div style={{display: 'inline-block', paddingLeft:'2em'}}>
                <h5 style={{color:'black', fontSize:'1.25em'}}>Chord Cycles per measure</h5>
                <input className="quantity" name="Cycles" value={cycles} onChange={(event)=> setCycles(event.target.value)} type="number" />
              </div>
            <br></br>
            <br></br>
              <Tooltip title="Only change if you know what you're doing" placement="left">
                <div style={{display: 'inline-block', paddingLeft:'2em'}}>
                    <h5 style={{color:'black', fontSize:'1.25em'}}>Sequence Length</h5>
                  <input className="quantity" name="sequenceLength" value={sequenceLength} onChange={(event)=> setSequenceLength(event.target.value)} type="number" step='1'/>
                </div>
              </Tooltip>
            <div style={{display: 'inline-block', paddingLeft:'2em'}}>
              <h5 style={{color:'black', fontSize:'1.25em'}}>Progression</h5>
              <select className="browser-default custom-select-small" onChange={(e)=>setProgression(e.target.value)}>
                <option value="6415">6-4-1-5</option>
              </select>
            </div>
            <div style={{display: 'inline-block', paddingLeft:'20em'}}>
              <h5 style={{color:'black', fontSize:'1.25em'}}>Scale</h5>
              <select className="browser-default custom-select-small" onChange={(e)=>setScale(e.target.value)}>
                <option>C Major</option>
              </select>
            </div>
          </div>
            <Button onClick={(event) => {
                  handleReq(event)
                  onNext(4);
              }} variant='primary'>
                Generate
            </Button>
          </div>
        </Modal.Body>
        </>}
        {index == 4 && <><Modal.Body>
          {requiredTrackType === 'Backing' && <h4 style={{color:'black'}}>Generating Backing Track</h4>}
          {requiredTrackType === 'Lead' && <h4 style={{color:'black'}}>Generating Lead Track</h4>}
          <p style={{color:'black'}}>
            Please wait while your {requiredTrackType} Track is being generated. 
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer></>}
      </Modal>
    );
  }
  

export default Generate