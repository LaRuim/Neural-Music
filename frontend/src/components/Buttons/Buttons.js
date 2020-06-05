import React, { useState, useEffect } from 'react';

export const Start = (initTone) => {
    return (<button style={{marginLeft:'55px', marginTop: '10px'}} className="btn btn-primary" type="input" onClick = {() => initTone()}>Initialize Backing Track</button>)
   }

export const Play = (playTone) => {
 return (<button className="btn btn-primary" type="input" onClick = {() => playTone()}>Initialize Backing Track</button>)
}

export const Pause = (pauseTone) => {
    return(<button className="btn btn-primary" type="input" onClick = {() => pauseTone()}>Pause</button>)
}

export const GenButton = (genMusic) => {
    return (<button className="btn btn-primary" type="input" onClick = {() => genMusic()}>Generate Music</button>)
   }