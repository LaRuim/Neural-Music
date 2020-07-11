import React from 'react'
import { func, string } from 'prop-types';
import styled from "styled-components"
import PropTypes from 'prop-types';

const CheckBoxLabel = styled.label`
  position: absolute;
  width: 42px;
  height: 26px;
  border-radius: 15px;
  background: #bebebe;
  cursor: pointer;
  &::after {
    content: "";
    display: block;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    margin: 3px;
    background: #ffffff;
    box-shadow: 1px 3px 3px 1px rgba(0, 0, 0, 0.2);
    transition: 0.2s;
  }
`;

const CheckBox = styled.input`
  opacity: 0;
  z-index: 1;
  border-radius: 15px;
  
  &:checked + ${CheckBoxLabel} {
    background: #4fbe79;
    &::after {
      content: "";
      display: block;
      border-radius: 50%;
      margin-left: 21px;
      transition: 0.2s;
    }
  }
`;

const Toggle = ({theme,  toggleTheme, defaultChecked }) => {
    return (
      <div>
        <em>Toggle Dark Mode! &nbsp;</em>
        <CheckBox id="checkbox" type="checkbox" onClick = {toggleTheme} defaultChecked={defaultChecked}/>
        <CheckBoxLabel htmlFor="checkbox" />
      </div>
    );
};
Toggle.propTypes = {
    theme: string.isRequired,
    toggleTheme: func.isRequired,
    defaultChecked: PropTypes.bool.isRequired
}
export default Toggle;