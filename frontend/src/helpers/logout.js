import { useDispatch, useSelector } from "react-redux";
import * as actions from '../actions/actions.js' ;
import React, { useState, useEffect } from 'react';

const logout = (dispatch) => {
  return new Promise((resolve, reject) => {
    fetch('http://localhost:5000/logout', {
      method: 'POST',
      credentials: 'include'
    }).then((response) => response.json()).then(
      (responseJSON) => {
        var response = responseJSON;
        if (response['body'] == 'OK'){
          dispatch(actions.loguserin(false));
          resolve("Logged out")
        }
        else{
          alert('Something went horribly wrong..');
          reject("We broke it.")
        }
    })
  })
}

export default logout