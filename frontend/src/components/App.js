import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import LoginPage from '../containers/Login.js'
import RegisterPage from '../containers/Register.js'
import AudioPlayer from '../containers/AudioPlayer.js'
import { useDispatch, useSelector } from "react-redux";
import * as actions from '../actions/actions.js' ;
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from '../global';
import { theme } from '../theme';
import Burger from './burger/Burger'
import Menu from  './menu/Menu'

const App = () => {
  // These are analogous to mapstatetoprops
  const hasUserLoggedIn = useSelector(state => state.hasUserLoggedIn);
  const showLogin = useSelector(state => state.showLogin);  

  const dispatch = useDispatch(); // Analogous to mapstatetodispatch
  const [open, setOpen] = useState(false);

  // These are hooks
  const register = RegisterPage(); 
  const login = LoginPage();
  const player = AudioPlayer();

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
    <ThemeProvider theme={theme}>
      <>
        <GlobalStyles />
          <nav>
            <Burger open={open} setOpen={setOpen} />
            <Menu open={open} setOpen={setOpen} />
            {player}
          </nav>
      </>
    </ThemeProvider>
  ) 
}


export default App;


