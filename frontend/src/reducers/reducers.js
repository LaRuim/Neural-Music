let defaultState = {
    hasUserLoggedIn: false,
    showLogin: true,
    playeropen: true,
    generateopen: false,
    profilepageopen: false,
    mode: 'light',
    path: './hello.mp3'
}

const reducers = (state = defaultState, action) => {
    let newState = JSON.parse(JSON.stringify(state))
    switch(action.type){
        case 'login':
            newState['hasUserLoggedIn'] = action.payload;
            return newState;
        case 'registered':
            newState['showLogin'] = action.payload;
            return newState;
        case 'openplayer':
            newState['generateopen'] = false
            newState['backingopen'] = false
            newState['profilepageopen'] = false
            newState['playeropen'] = true
            return newState;
        case 'opengen':
            newState['playeropen'] = false
            newState['backingopen'] = false
            newState['profilepageopen'] = false
            newState['generateopen'] = true
            return newState;
        case 'openprofile':
            newState['profilepageopen'] = true
            newState['playeropen'] = false
            newState['backingopen'] = false
            newState['generateopen'] = false
            return newState;
        case 'mode':
            newState['mode'] = action.payload;
            return newState;
        case 'path':
            newState['path'] = action.payload;
            return newState;
        default:
            return state;
    }
    
}

export default reducers