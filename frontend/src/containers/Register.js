import React, { useState } from 'react';

import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { show_login } from '../actions/actions.js'

import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/styles/Login.css'

const RegisterPage = () => {

  const [username, setUser] =  useState('');
  const [password, setPassword] =  useState('');
  const [passwordConfirm, setPasswordConfirm] =  useState('');

  const showLogin = useSelector(state => state.hasUserLoggedIn);
  const dispatch = useDispatch();

  const handleSubmit = e => {
    e.preventDefault();
    if (password != passwordConfirm){
      alert('Password entered is different from confirmation!')
      return
    }

    var request = new FormData();
    request.append("username", username);
    request.append("password", password);
    request.append("confirmation", passwordConfirm);
      
    fetch('http://localhost:5000/register', {
      method: 'POST',
      body: request,
      credentials: 'include'
    }).then((response) => response.json()).then(
      (responseJSON) => {
        var response = responseJSON;
        if (response['body'] == 'OK'){
          alert('You have succesfully registered. Please login with your details to continue.');
          dispatch(show_login(true))
        }
        else{
          alert('Sorry, this user already exists. If that\'s you, try logging in.');
          window.location.reload();
        }
    })
  } 

  return (
    <div>
      <main className="container p-5">
        <div className="Login">
          <form id='register' onSubmit={handleSubmit}>
            <div className="form-group">
              <input autoComplete="off" autoFocus className="form-control" name="username" placeholder="Username" type="text" value={username} onChange={event => setUser(event.target.value)} required/>
            </div>
            <div className="form-group">
              <input className="form-control" name="password" placeholder="Password" type="password" value={password} onChange={event => setPassword(event.target.value)} required/>
            </div>
            <div className="form-group">
              <input className="form-control" name="passwordConfirm" placeholder="Confirm Password" type="password" value={passwordConfirm} onChange={event => setPasswordConfirm(event.target.value)} required />
            </div>
              <button className="btn btn-primary" type="submit">Register</button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default RegisterPage



