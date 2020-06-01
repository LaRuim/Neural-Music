import React from 'react';
import { StyledMenu } from './Menu.styled';

const Menu = ({ open }) => {
  return (
    <StyledMenu open={open}>
      <br></br>
      <h3>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MENU</h3> 
      <a>My Profile</a>
      <hr></hr>
      <a>Audio Player</a>
      <a>About us</a>
    </StyledMenu>
  )
}

export default Menu;