import React, { useState, useEffect } from 'react';
import { StyledMenu } from './Menu.styled';
import { useDispatch, useSelector } from "react-redux";
import * as actions from '../../actions/actions.js' ;
import '../../App.css'

const Menu = ({ open }) => {
  const dispatch = useDispatch();
  
  return (
    <StyledMenu open={open}>
      <br></br>
      <h3>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MENU</h3> 
      <a>My Profile</a>
      <hr></hr>
      <a  onClick = {() => dispatch(actions.openPlayer(true))}>Audio Player</a>
      <a  onClick = {() => dispatch(actions.openGen(true))}>Generate Music</a>
      <a>About us</a>
    </StyledMenu>
  )
}

export default Menu;