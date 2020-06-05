import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { GenButton } from '../components/Buttons/Buttons'
import ReactAudioPlayer from 'react-audio-player';

const GenMusic = () => {
    
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

    const [generated, gen] = useState(false);

    const genMusic = () => {
        fetch('http://localhost:5000/generate', {
            method: 'POST',
        }).then((response) => response.json()).then(
            (responseJSON) => {
                var response = responseJSON;
                if (response['status'] == 200){
                    gen(true);
                }
                else{
                    console.log('WHAT HAPP')
                }
            })
    }

    const genbutton = GenButton(genMusic)

    return(
        <nav>
            {!generated && genbutton}
            {generated && 
            <nav>
                <ReactAudioPlayer src="./generatedMusic/output.mp3" controls/>
            </nav>}
        </nav>
    )
}

export default GenMusic