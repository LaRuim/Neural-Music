import React, { useState, useEffect } from 'react';
//import Sidebar from "react-sidebar";
import 'bootstrap/dist/css/bootstrap.min.css';
//import './App.css';
import * as Tone from "tone";

const AudioPlayer = () => {
    
    const startmusic = () => {
        var buffer = new Tone.Buffer('./N.mp3', () => { // N.mp3 must exist in /public, public is the root directory of this appliaction simply because index.html lies in /public, remove this comment after you read it
            // New Tone.buffer is an async function, the buffer wasn't loaded when you invoked Tone.Player earlier because you had to wait for Tone.Buffer to finish whatever it was doing, remove this comment after you read it too
            var player = new Tone.Player(buffer).toMaster();
            player.start();
        });                
    }

    const playTone = async () => {
        await Tone.start();
        startmusic();
    }

    return(
        <button className="btn btn-primary" type="input" onClick = {() => playTone()}>Play</button>
    )
}

export default AudioPlayer