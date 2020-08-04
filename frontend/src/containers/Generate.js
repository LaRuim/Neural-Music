import React, { useState, useEffect, useRef } from 'react';

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
    const [offset, setOffset] = useState(0)
    const [chordProgression, setProgression] = useState(null)
    const [scale, setScale] = useState(null)
    const onNext = (VAL) => {
        setIndex(VAL);
    }

    const handleReq = (event, RequiredTrackType, TrackPath, BPM, offset) => {
        event.preventDefault();
        
        var request = new FormData();
        request.append("generate", RequiredTrackType);
        request.append('path', TrackPath)
        request.append('BPM', BPM)
        request.append('Offset', offset)

        fetch('http://localhost:5000/generate', {
            method: 'POST',
            body: request,
            credentials: 'include'
            }).then(response => {
            console.log(response)
            if (response['status'] == 200){
              window.location.reload();
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
            Choose a BPM and offset.
          </p>
          <div className='text-center'>
            
            <div className="def-number-input number-input">
              <div>
                <h5 style={{color:'black'}}>BPM</h5>
                <input className="quantity" name="BPM" value={BPM} onChange={(event)=> setBPM(event.target.value)} type="number" />
              </div>
              <div>
                <h5 style={{color:'black'}}>Offset</h5>
                <input className="quantity" name="offset" value={offset} onChange={(event)=> setOffset(event.target.value)} type="number" step="any"/>
              </div> 
            </div>
                <Button onClick={(event) => {
                var tracks = store.getState().userTracks
                var trackPath = tracks[tracks.length-1][0].src
                handleReq(event, requiredTrackType, trackPath, BPM, offset)
                onNext(4);
            }} variant='primary'>Generate</Button>
          </div>
        </Modal.Body>
        </>}
        {index == 3 && <><Modal.Body> 
          <h4 style={{color:'black'}}>Track Details</h4>
          <p style={{color:'black'}}>
            Choose a chord progression, a scale and BPM.
          </p>
          <div className='text-center'>
            
          <div>
            <select className="browser-default custom-select">
              <option>Chord Progression:</option>
              <option value="1">Option 1</option>
              <option value="2">Option 2</option>
              <option value="3">Option 3</option>
            </select>
          </div>
          <div>
            <select className="browser-default custom-select">
              <option>Scale</option>
              <option value="1">Option 1</option>
              <option value="2">Option 2</option>
              <option value="3">Option 3</option>
            </select>
          </div>
          <div className="def-number-input number-input">
              <div>
                <h5 style={{color:'black'}}>BPM</h5>
                <input className="quantity" name="BPM" value={BPM} onChange={(event)=> setBPM(event.target.value)} type="number" />
              </div>
          </div>
                <Button onClick={(event) => {
                var tracks = store.getState().userTracks
                var trackPath = tracks[tracks.length-1][0].src
                handleReq(event, requiredTrackType, trackPath, BPM, offset)
                onNext(4);
            }} variant='primary'>Generate</Button>
          </div>
        </Modal.Body>
        </>}
        {index == 4 && <><Modal.Body>
          {requiredTrackType === 'Backing' && <h4 style={{color:'black'}}>Generating Backing Track</h4>}
          {requiredTrackType === 'Lead' && <h4>Generating Lead Track</h4>}
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