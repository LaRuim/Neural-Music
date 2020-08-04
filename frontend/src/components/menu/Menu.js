import React, { useState, useEffect } from 'react';
import { StyledMenu } from './Menu.styled';
import { useDispatch, useSelector } from "react-redux";
import * as actions from '../../actions/actions.js' ;
import '../styles/App.css'

const Menu = ({ open }) => {
  const dispatch = useDispatch();
  
  return (
    <StyledMenu open={open}>
      <br></br>
      <h3>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MENU</h3> 
      <hr></hr>
      <a onClick = {() => dispatch(actions.openProfile(true))}>My Profile</a>
      <hr style={{height:'2px', color: 'gray'}}></hr>
      <a  onClick = {() => dispatch(actions.openPlayer(true))}>Audio Editor</a>
      <a>About us</a>
    </StyledMenu>
  )
}

export default Menu;