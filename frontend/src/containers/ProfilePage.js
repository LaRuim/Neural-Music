import React, { useState, useCallback, createElement } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Toggle from "../components/Buttons/Toggler"

const ProfilePage = (theme, themeToggler) => {

    var checked = window.localStorage.getItem('theme') === 'light'
    return( <Toggle theme={theme} toggleTheme={themeToggler} defaultChecked={!checked}/>)
}

export default ProfilePage;