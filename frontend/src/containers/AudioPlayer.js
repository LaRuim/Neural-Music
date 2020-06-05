import React, { useState, useEffect } from 'react';
//import Sidebar from "react-sidebar";
import ReactAudioPlayer from 'react-audio-player';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import * as Tone from "tone";
import { Start, Play, Pause } from '../components/Buttons/Buttons'

const AudioPlayer = () => {
    
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

    const [playing, changePlay] = useState(false);
    const [started, setStarted] = useState(false);

    const initPlayer = () => {
        var player = new Tone.Player('./M.mp3').toMaster();
        return player
    }      

    var player = initPlayer();
    //const playing = player.state;
    const pauseTone = () => {
        if (started){
            Tone.Transport.pause();
            changePlay(false);
        }
    }

    const playTone = () => {
        if (started){
            Tone.Transport.start()
            changePlay(true);
        }
    }

    const initTone = async () => {
        if (!started){
            await Tone.start();
            player.sync().start();
        }
        //Tone.Transport.start()
        setStarted(true);
        changePlay(true);
    }
    //Tone.Transport.schedule(playTone, 0)

    const setPos = (time) => {
        if (started){
            Tone.Transport.seconds = time; 
            changePlay(true);
        }
    }

    const start = Start(initTone)
    return(
        <div>
        <nav style={{marginTop: '45px'}}>
            <ReactAudioPlayer
                src="./N.mp3"
                controls
                onPlay = {() => playTone()}
                onPause = {() => pauseTone()}
                onSeeked = {(e) => setPos(e.target.currentTime)}
            />
        </nav>
        <div>
            {!started && start}
        </div>
        </div>
        
    )
}

export default AudioPlayer