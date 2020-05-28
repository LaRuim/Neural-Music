import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import LoginPage from '../containers/Login.js'
import RegisterPage from '../containers/Register.js'
import HomePage from '../containers/Homepage.js'
import { useDispatch, useSelector } from "react-redux";
import * as actions from '../actions/actions.js' ;

const App = () => {
  // These are analogous to mapstatetoprops
  const hasUserLoggedIn = useSelector(state => state.hasUserLoggedIn);
  const showLogin = useSelector(state => state.showLogin);  

  const dispatch = useDispatch(); // Analogous to mapstatetodispatch

  // These are hooks
  const register = RegisterPage(); 
  const login = LoginPage();

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
  else{
    // Dummy Hello World
    return(
      <div>
        {HomePage()} 
      </div>
    )
  }
}


export default App;


