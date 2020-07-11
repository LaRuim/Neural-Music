import React, { useState, useEffect } from 'react';

import { GenButton, ClearButton } from '../components/Buttons/Buttons'
import ReactAudioPlayer from 'react-audio-player';
import { useDispatch } from 'react-redux';
import * as actions from '../actions/actions'
import 'bootstrap/dist/css/bootstrap.min.css';

const GenMusic = () => {
    
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
    const dispatch = useDispatch();
    const [generated, gen] = useState(false);

    const genMusic = () => {
        fetch('http://localhost:5000/generate', {
            method: 'POST',
        }).then((response) => response.json()).then(
            (responseJSON) => {
                var response = responseJSON;
                if (response['body'] == 'OK'){
                    dispatch(actions.pathSong('./generatedMusic/output.mp3'))
                    //window.location.reload()
                    gen(true);
                }
                else{
                    console.log('WHAT HAPP')
                }
            })
    }

    const genbutton = GenButton(genMusic)

    const clearbutton = ClearButton(gen)

    return (
      <div>
        <br/><br/>
        {!generated && genbutton}
        {generated && 
          <ReactAudioPlayer
            src='./generatedMusic/output.mp3'
            controls
          />
        }
        {generated && clearbutton}
      </div>
    )
}

export default GenMusic