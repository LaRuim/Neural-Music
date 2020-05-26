import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import LoginPage from './Login.js'
import RegisterPage from './Register.js'






const App = () => {
  
  const [flag, updateState] = useState(false)
  const register = RegisterPage()
  const login = LoginPage()
   return (
    <div className="App">
      <nav className="navbar navbar-expand-md navbar-light bg-light border">
          <a className="navbar-brand" href="/"><span className="red">Neural Music</span></a>
          <button aria-controls="navbar" aria-expanded="false" aria-label="Toggle navigation" className="navbar-toggler" data-target="#navbar" data-toggle="collapse" type="button">
              <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbar">
            <ul className="navbar-nav ml-auto mt-2">
                <li className="nav-item"><a className="nav-link" onClick = {() => updateState(true)}>Register</a></li>
                <li className="nav-item"><a className="nav-link" onClick = {() => updateState(false)}>Log In</a></li>
            </ul>
          </div>
      </nav>
      {flag && register}
      {!flag && login}
    </div>
  )
}

export default App;


