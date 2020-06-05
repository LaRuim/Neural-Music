import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import LoginPage from './containers/Login.js'
import RegisterPage from './containers/Register.js'
import AudioPlayer from './containers/AudioPlayer.js'
import GenMusic from './containers/GenMusic.js'
import { useDispatch, useSelector } from "react-redux";
import * as actions from './actions/actions.js' ;
import { ThemeProvider } from 'styled-components';
import { theme } from './theme';
import Burger from './components/burger/Burger'
import Menu from  './components/menu/Menu'

const App = () => {
  // These are analogous to mapstatetoprops
  const hasUserLoggedIn = useSelector(state => state.hasUserLoggedIn);
  const showLogin = useSelector(state => state.showLogin);  
  const playeropen = useSelector(state => state.playeropen)
  const generateopen = useSelector(state => state.generateopen);

  const dispatch = useDispatch(); // Analogous to mapstatetodispatch
  const [open, setOpen] = useState(false);

  // These are hooks
  const register = RegisterPage(); 
  const login = LoginPage();
  const player = AudioPlayer();
  const genmusic = GenMusic()

  if (!hasUserLoggedIn){
    return (
          <div className="App">
            <nav className="navbar navbar-expand-md navbar-light bg-light border">
                <a className="navbar-brand" href="/"><span className="red">Neural Music</span></a>
                <button aria-controls="navbar" aria-expanded="false" aria-label="Toggle navigation" className="navbar-toggler" data-target="#navbar" data-toggle="collapse" type="button">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbar">
                  <ul className="navbar-nav ml-auto mt-2">
                      <li className="nav-item"><a className="nav-link" onClick = {() => dispatch(actions.show_login(false))}>Register</a></li>
                      <li className="nav-item"><a className="nav-link" onClick = {() => dispatch(actions.show_login(true))}>Log In</a></li>
                  </ul>
                </div>
            </nav>
            {!showLogin && register}
            {showLogin && login}
          </div>
    )
  }
  return(
    <nav>
    <ThemeProvider theme={theme}>
        
          <nav style= {{marginLeft: '180px'}} className="navbar navbar-dark bg-dark">
          <div className="container-fluid">
            <div className="navbar-header">
              <a style={{paddingLeft: '500px'}} className="navbar-brand" href="#">Neural Music</a>
            </div>
          </div>
          </nav>
        <nav>
          <Burger open={open} setOpen={setOpen} />
          <Menu open={open} setOpen={setOpen} />
          {playeropen && <nav>
            <nav style={{marginLeft: '300px', marginTop: '30px'}}>
              <p>This page allows you to play a main track with a backing track. 
                The main track can be played standalone, or with the backing track. 
                As of now, there is no upload feature, and only 1 backing track exists.
              </p>
              <p>
                To play the main track standalone, use the Audio player. 
              </p>
              <p>
                To connect the backing track, click 'Initialize Backing Track'. This merges the audio with the
                main track. (UNMERGE and separate volume-control not yet possible)
              </p>
            </nav>
          </nav>
          }

          {generateopen && <nav>
            <nav style={{marginLeft: '300px', marginTop: '30px'}}>
              <p>This page allows you to generate music via the trained model we possess. The model itself has been
                 trained on a set of 247 midi files, each from an OST or a composition by itself.
              </p>
              <p>
                To initialize the generation, click on the 'Generate' Button. 
              </p>
              <p>
                Please be patient while our model generates the song for you, and converts it to an mp3.  
              </p>
            </nav>
          </nav>
          }
          
          <nav className='myNav'>
            {playeropen && player}
            {generateopen && genmusic}
          </nav>
        </nav>
    </ThemeProvider>
    </nav>
  ) 
}


export default App;


