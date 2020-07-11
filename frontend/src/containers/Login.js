import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { loguserin } from '../actions/actions.js'

import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/styles/Login.css'

const LoginPage = () => {

  const [username, setUser] =  useState('');
  const [password, setPassword] =  useState('');

  const hasUserLoggedIn = useSelector(state => state.hasUserLoggedIn);
  const dispatch = useDispatch();

  const handleSubmit = e => {
    e.preventDefault();
    
    var request = new FormData();
    request.append("username", username);
    request.append("password", password);
      
    fetch('http://localhost:5000/login', {
      method: 'POST',
      body: request,
      credentials: 'include'
    }).then(response => {
      console.log(response)
      if (response['status'] == 200){
        dispatch(loguserin(true));
      }
      else{
        alert('The username and/or password you entered was wrong. Please try again.');
      }
    })
  }

  return(
  <div>
    <main className="container p-5">
      <div className="Login">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input autoComplete="off" autoFocus className="form-control" name="username" placeholder="Username" type="text" value={username} onChange={event => setUser(event.target.value)} required/>
          </div>
          <div className="form-group">
            <input className="form-control" name="password" placeholder="Password" type="password" value={password} onChange={event => setPassword(event.target.value)} required/>
          </div>
            <button className="btn btn-primary" type="submit">Log In</button>
        </form>
      </div>
    </main>
  </div>
  );
}

export default LoginPage



