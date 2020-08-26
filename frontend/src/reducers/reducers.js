let defaultState = {
    hasUserLoggedIn: false,
    showLogin: true,
    playerOpen: true,
    profilePageOpen: false,
    showAccompanimentModal: false,
    mode: 'light',
    path: './hello.mp3',
    userTracks: [[]]
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
            newState['profilePageOpen'] = false
            newState['playerOpen'] = true
            return newState;
        case 'openprofile':
            newState['profilePageOpen'] = true
            newState['playerOpen'] = false
            return newState;
        case 'mode':
            newState['mode'] = action.payload;
            return newState;
        case 'path':
            newState['path'] = action.payload;
            return newState;
        case 'addUserTrack':
            if (!state.userTracks[0].length){
                newState['userTracks'] = [action.payload]
            }
            else{
                newState['userTracks'] = [...state.userTracks, action.payload]
            }
            return newState
        case 'clearUserTracks':
            newState['userTracks'] = [[]]
            return newState
        case 'setAccompanimentModal':
            newState['showAccompanimentModal'] = true
            return newState
        default:
            return state;
    }
    
}

export default reducers