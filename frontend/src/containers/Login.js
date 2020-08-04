import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { loguserin } from '../actions/actions.js'

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

const LoginPage = () => {

  const [username, setUser] =  useState('');
  const [password, setPassword] =  useState('');

  const hasUserLoggedIn = useSelector(state => state.hasUserLoggedIn);
  const dispatch = useDispatch();

  const handleSubmit = event => {
    event.preventDefault();
    
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
    <MDBView>
          <MDBMask className="d-flex justify-content-center align-items-center gradient">
            <MDBContainer>
              <MDBRow>
                <MDBAnimation
                  type="flash"
                  delay=".3s"
                  className="white-text text-center text-md-left col-md-6 mt-xl-5 mb-5"
                >
                  <h1 className="h1-responsive font-weight-bold">
                    Sign in to Neural Moosic
                  </h1>
                  <hr className="hr-light" />
                  <h6 className="mb-4">
                    Have an account? Well what are you waiting for, log in then!
                  </h6>
                </MDBAnimation>

                <MDBCol md="6" xl="5" className="mb-4">
                  <MDBAnimation type="zoomIn" delay=".3s">
                    <MDBCard id="classic-card">
                      <MDBCardBody className="white-text">
                        <form onSubmit={handleSubmit}>
                        <h3 className="text-center">
                          <MDBIcon icon="user" /> Login:
                        </h3>
                        <hr className="hr-light" />
                        <MDBInput
                          className="white-text"
                          iconClass="white-text"
                          name='username'
                          onChange={(event) => setUser(event.target.value)}
                          label="Username"
                          icon="user"
                        />
                        <MDBInput
                          className="white-text"
                          iconClass="white-text"
                          name='password'
                          onChange={(event) => setPassword(event.target.value)}
                          label="Password"
                          icon="lock"
                          type="password"
                        />
                        <div className="text-center mt-4 black-text">
                          <MDBBtn color="indigo" type='submit'>Sign In</MDBBtn>
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

export default LoginPage



