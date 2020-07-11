import React, { useState, useEffect, useRef } from 'react';

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/styles/App.css';

const Generate = (props) => {
    
    const [index, setIndex] = useState(1)
    const [genReq, setGenReq] = useState(null)
    const onNext = () => {
        setIndex(2);
    }

    const handleReq = (e, req) => {
        e.preventDefault();
        
        var request = new FormData();
        request.append("generate", req);

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
            Generate accompaniment
          </Modal.Title>
        </Modal.Header>
        {index == 1 && <><Modal.Body>
          <h4>Track Type</h4>
          <p>
            What kind of track did you drop?
          </p>
          <div className='text-center'>
              <ButtonGroup className='mr-5' size='lg'>
              <Button onClick={(e) => {
                    setGenReq('Backing')
                    handleReq(e, 'Backing')
                    onNext();
                }} variant='primary'>Lead Track</Button>

              </ButtonGroup>
              <ButtonGroup className='mr-5'  size='lg'>
                <Button onClick={(e) => {
                    setGenReq('Lead')
                    handleReq(e, 'Lead')
                    onNext();
                }} variant='secondary'>Backing Track</Button>
              </ButtonGroup>
          </div>
        </Modal.Body>
        </>}
        {index == 2 && <><Modal.Body>
          {genReq === 'Backing' && <h4>Generating Backing Track</h4>}
          {genReq === 'Lead' && <h4>Generating Lead Track</h4>}
          <p>
            Please wait while your {genReq} Track is being generated. 
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer></>}
      </Modal>
    );
  }
  

export default Generate