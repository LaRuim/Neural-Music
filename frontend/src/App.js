import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";

import LoginPage from './containers/Login'
import RegisterPage from './containers/Register'
import AudioPlayer from './containers/AudioPlayer'
import GenMusic from './containers/GenMusic'
import ProfilePage from './containers/ProfilePage'
import Generate from './containers/Generate'

import * as actions from './actions/actions' ;

import  {useDarkMode} from "./components/modes/darkMode"
import { GlobalStyles } from "./components/styles/globalStyle";
import Burger from './components/burger/Burger'
import Menu from  './components/menu/Menu'

import { OnClickOutside } from './helpers/clickClose';
import Authenticator from './helpers/Authenticator'
import logout from './helpers/logout'


import 'bootstrap/dist/css/bootstrap.min.css';
import './components/styles/App.css';
import { lightTheme, darkTheme } from './components/styles/theme'
import { ThemeProvider } from 'styled-components';

import { BrowserRouter as Router } from "react-router-dom";
import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavItem,
  MDBLink,
  MDBNavbarToggler,
  MDBCollapse,
  MDBContainer,
} from "mdbreact";


const App = () => {
  
  const hasUserLoggedIn = useSelector(state => state.hasUserLoggedIn); // This is analogous to mapstatetoprops
  const showLogin = useSelector(state => state.showLogin);  
  const playeropen = useSelector(state => state.playeropen)
  const generateopen = useSelector(state => state.generateopen);
  const profilepageopen = useSelector(state => state.profilepageopen)

  const dispatch = useDispatch(); // Analogous to mapstatetodispatch
  const [open, setOpen] = useState(false);

  const [theme, themeToggler] = useDarkMode();
  const themeMode = theme === 'light' ? lightTheme : darkTheme;
  const [showGen, setshowGen] = useState(false);
  
  const Generator = () => {
    return (
      <>
        <Generate
          show={showGen}
          onHide={() => setshowGen(false)}
          />
      </>
    )
  }
  const [collapseID, toggleCollapse] = useState('')
  const generateAccompaniment = Generator() 
  const login = LoginPage();
  const register = RegisterPage(); 
  const player = AudioPlayer(themeMode);
  const genmusic = GenMusic()
  const profilepage = ProfilePage(theme, themeToggler);
  const Overlay = () => {
    return(
    <div
      id="sidenav-overlay"
      style={{ backgroundColor: "transparent" }}
      onClick={() => toggleCollapse("navbarCollapse")}
    />
    )
  }
  const overlay = Overlay()

  const hamburger = useRef(); 
  OnClickOutside(hamburger, () => setOpen(false));
  Authenticator(hasUserLoggedIn, dispatch)

  if (!hasUserLoggedIn){
    return (
          <div id="app">
            <Router>
              <div>
                <MDBNavbar dark expand="md" fixed="top">
                  <MDBContainer>
                    <MDBNavbarBrand>
                      <strong className="white-text">Neural Moosic</strong>
                    </MDBNavbarBrand>
                    <MDBNavbarToggler
                      onClick={() => toggleCollapse("navbarCollapse")}
                    />
                    <MDBCollapse
                      id="navbarCollapse"
                      isOpen={collapseID}
                      navbar
                    >
                      <MDBNavbarNav right>
                        <MDBNavItem>
                          <MDBLink onClick = {() => dispatch(actions.show_login(true))}>Login</MDBLink>
                        </MDBNavItem>
                        <MDBNavItem>
                          <MDBLink onClick = {() => dispatch(actions.show_login(false))}>Register</MDBLink>
                        </MDBNavItem>
                      </MDBNavbarNav>
                    </MDBCollapse>
                  </MDBContainer>
                </MDBNavbar>
                {collapseID && overlay}
              </div>
            </Router>
            
            {!showLogin && register}
            {showLogin && login}
          </div>
    )
  }

  else{ 

    var checked;
    fetch('http://localhost:5000/userdetails', {
      method: 'GET',
      credentials: 'include'
    }).then(response => response.json()).then(responseJSON => {
      if (responseJSON['status'] == 200){
        checked = responseJSON['darkmode'] === 'False'
      }
      else{
        console.log(responseJSON);
      }
    })

    return(
      <div id='app'>
      <ThemeProvider theme={themeMode}>
      <>
      <GlobalStyles/>
            <nav className="navbar" style={{
                    background: themeMode.navbar,
                    opacity: 0.8,
                    position: 'sticky',
                    top: '0',
                    padding:'1em'}}>
              <div className="navbar-brand">
                {theme === 'light' && <img onClick = {()=>dispatch(actions.openPlayer(true))} style = {{position: 'absolute', top:'0.4em', left: '30em'}} src='./static/moosiclight.png'></img>}
                {theme === 'dark' && <img onClick = {()=>dispatch(actions.openPlayer(true))} style = {{position: 'absolute', top:'0.4em', left: '30em'}} src='./static/moosicdark.png'></img>}
                <a className="navbar-brand" onClick = {()=>dispatch(actions.openPlayer(true))} id='Heading' >Neural Moosic</a>
                <a className='navbar-brand' id='Logout' onClick = {() => {
                  logout(dispatch)}}>Logout</a> 
              </div>
            </nav>
          <nav ref={hamburger}>
            <Burger open={open} setOpen={setOpen} />
            <Menu open={open} setOpen={setOpen} />
            {playeropen && <nav>
              <nav style={{marginLeft: '30em', marginTop: '30px'}}>
                <p>This page allows you to use a feature filled Audio Player.
                Drag and drop your audio file into the box to play around with it and edit it.
                </p>
                <p>
                  If you require an accompaniment to the piece you just dropped, 
                  <a style={{color: themeMode.linkcolor}} href onClick = {()=>setshowGen(true)}> click here.</a>
                </p>
              </nav>
            </nav>
            }

            {showGen && generateAccompaniment}

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
            
            {profilepageopen && <nav>
              <nav style={{marginLeft: '300px', marginTop: '30px'}}>
                <div className='navbar'><h2>Profile Page</h2></div>
              </nav>
            </nav>
              }
            <nav className='myNav' style={{marginLeft: '10em'}}>
              {playeropen && player}
              {generateopen && genmusic}
              {profilepageopen && profilepage}
            </nav>
          </nav>
          </>
      </ThemeProvider>
      </div>
    ) 
  }
}


export default App;


