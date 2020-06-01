import React, { useState, useEffect } from 'react';
//import Sidebar from "react-sidebar";
import 'bootstrap/dist/css/bootstrap.min.css';
//import './App.css';
import * as Tone from "tone";

const AudioPlayer = () => {
    
    const startmusic = () => {
        var buffer = new Tone.Buffer('ANYPATHIPUTHEREFAILS')
        console.log(buffer)
        var player = new Tone.Player(buffer).toMaster();
        player.start();
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