let defaultState = {
    hasUserLoggedIn: false,
    showLogin: true,
    playeropen: true,
    generateopen: false
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
            newState['playeropen'] = true
            newState['generateopen'] = false
            return newState;
        case 'opengen':
            newState['playeropen'] = false
            newState['generateopen'] = true
            return newState;
        default:
            return state;
    }
    
}

export default reducers