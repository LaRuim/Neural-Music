let defaultState = {
    hasUserLoggedIn: false,
    showLogin: true
}

const reducers = (state = defaultState, action) => {
    let newState = JSON.parse(JSON.stringify(state))
    switch(action.type){
        case 'login':
            newState['hasUserLoggedIn'] = action.payload;
            return newState;
        case 'registered':
            newState['showLogin'] = action.payload;
            return newState
        default:
            return state;
    }
    
}

export default reducers