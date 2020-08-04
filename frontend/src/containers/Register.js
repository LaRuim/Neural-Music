import React, { useState } from 'react';

import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { show_login } from '../actions/actions.js'

import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/styles/Login.css'
import {
  MDBMask,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBBtn,
  MDBView,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBAnimation
} from "mdbreact";


const RegisterPage = () => {

  const [username, setUser] =  useState('');
  const [password, setPassword] =  useState('');
  const [passwordConfirm, setPasswordConfirm] =  useState('');
  const [equal, setEqual] = useState(false)

  const showLogin = useSelector(state => state.hasUserLoggedIn);
  const dispatch = useDispatch();

  const handleSubmit = event => {
    event.preventDefault();
    if (equal && username){
      event.target.className += " was-validated";
    }
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
      <MDBView>
          <MDBMask className="d-flex justify-content-center align-items-center gradient">
            <MDBContainer>
              <MDBRow>
                <MDBAnimation
                  type="fadeInLeft"
                  delay=".3s"
                  className="white-text text-center text-md-left col-md-6 mt-xl-5 mb-5"
                >
                  <h1 className="h1-responsive font-weight-bold">
                    Sign up to get help with your music!
                  </h1>
                  <hr className="hr-light" />
                  <h6 className="mb-4">
                    Neural Moosic is a tool to help you with your music. We offer help in
                    the generation of a backing track for a lead you might have, and also help
                    inspire you to create your own lead by generating a snippet for common chord
                    progressions. More to come!
                  </h6>
                </MDBAnimation>

                <MDBCol md="6" xl="5" className="mb-4">
                  <MDBAnimation type="fadeInRight" delay=".3s">
                    <MDBCard id="classic-card">
                      <MDBCardBody className="white-text">
                        <form
                         className='needs-validation'
                         onSubmit={handleSubmit}
                         noValidate>
                        <h3 className="text-center">
                          <MDBIcon icon="user" /> Register:
                        </h3>
                        <hr className="hr-light" />
                        <MDBInput
                          className="white-text"
                          iconClass="white-text"
                          name='username'
                          label="Username"
                          icon="user"
                          onChange={(event) => setUser(event.target.value)}
                        />
                        <MDBInput
                          className="form-control"
                          iconClass="white-text"
                          label="Password"
                          name='password'
                          icon="lock"
                          type="password"
                          onChange={(event) => setPassword(event.target.value)}
                        />
                        <MDBInput
                          className="form-control"
                          iconClass="white-text"
                          name='passwordConfirm'
                          label="Confirm password"
                          icon="lock"
                          type="password"
                          onChange={(event) => {
                            setPasswordConfirm(event.target.value)
                            if (password !== passwordConfirm){
                              setEqual(false)
                            }
                            else{
                              setEqual(true)
                            }
                          }}
                        />
                        <div className="invalid-feedback">Passwords don't match!</div>
                        <div className="text-center mt-4 black-text">
                          <MDBBtn color="indigo" type='submit'>Sign Up</MDBBtn>
                          <hr className="hr-light" />
                          
                        </div>
                      </form>
                      </MDBCardBody>
                    </MDBCard>
                  </MDBAnimation>
                </MDBCol>
              </MDBRow>
            </MDBContainer>
          </MDBMask>
        </MDBView>
    </div>
  );
}

export default RegisterPage



