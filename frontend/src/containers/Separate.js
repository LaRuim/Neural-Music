import React, { useState, useEffect, useRef } from "react";
import { addUserTrack, clearUserTracks } from "../actions/actions.js";
import { useSelector, useDispatch } from "react-redux";

import Tooltip from "@material-ui/core/Tooltip";

import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import "../components/styles/App.css";
import { store } from "../store/index.js";

const Separate = (props) => {
    
    const [index, setIndex] = useState(1)
    const [trackTypes, setTracks] = useState('2')

    const onNext = (VAL) => {
        setIndex(VAL);
    }
    const dispatch = useDispatch();
    const handleReq = (event, TrackPath = "") => {
        event.preventDefault();
        console.log(trackTypes)
        var request = new FormData();
        request.append('trackPath', TrackPath)
        request.append('trackTypes', trackTypes)
        fetch("http://localhost:5000/split", {
        method: "POST",
        body: request,
        credentials: "include",
        }).then((response) => {
        console.log(response);
        if (response["status"] == 200) {
            response.json().then((responseJSON) => {
            var response = responseJSON;
            const tracks = response['body']
            for (const track in tracks){
                var newTrack = [];
                newTrack.push(tracks[track]);
                dispatch(addUserTrack(newTrack));
            }
            //window.location.reload();
            });
        } else {
            alert(
            "This part is still under development; Need backend code!",
            );
        }
        });
    };

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
              <h3 style={{color:'black'}}>Split your Audio</h3>
            </Modal.Title>
          </Modal.Header>
          {index == 1 && <><Modal.Body>
            <h4 style={{color:'black'}}>Track Type</h4>
            <p style={{color:'black'}}>
              What do you want your audio to be separated into?
            </p>
            <div style={{display: 'inline-block', paddingRight:'1em', paddingLeft:'1em'}}>
                <h5 style={{color:'black', fontSize:'1.25em'}}>Scale</h5>
                <select id='6' className="browser-default custom-select-small" onChange={(e)=>setTracks(e.target.value)}>
                  <option value='2'>Vocals and Accompaniment</option>
                  <option value='4'>Vocals, Drums, Bass and Others</option>
                  <option value='5'>Vocals, Drums, Piano, Bass and Others</option>
                </select>
              </div>
              <Button onClick={(event) => {
                    var tracks = store.getState().userTracks
                    var trackPath = tracks[tracks.length-1][0].src
                    handleReq(event, trackPath)
                    onNext(2);
                  }} variant='primary'>
                Generate
              </Button>
          </Modal.Body>
          </>}
          {index == 2 && <><Modal.Body>
            <h4 style={{color:'black'}}>Splitting your Audio</h4>
            <p style={{color:'black'}}>
              Please wait while your audio is being source-separated.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={props.onHide}>Close</Button>
          </Modal.Footer></>}
        </Modal>
      );
}

export default Separate