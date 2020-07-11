import React, { useState, useEffect } from 'react';

export const GenButton = (genMusic) => {
    return (<button className="btn btn-primary" type="input" onClick = {() => genMusic()}>Generate Music</button>)
   }

export const ClearButton = (gen) => {
    return (<div><button className="btn btn-primary" type="input" onClick = {() => gen(false)}>Clear Music</button></div>)
  }