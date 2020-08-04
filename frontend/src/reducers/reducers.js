let defaultState = {
    hasUserLoggedIn: false,
    showLogin: true,
    playeropen: true,
    profilepageopen: false,
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
            newState['backingopen'] = false
            newState['profilepageopen'] = false
            newState['playeropen'] = true
            return newState;
        case 'openprofile':
            newState['profilepageopen'] = true
            newState['playeropen'] = false
            newState['backingopen'] = false
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
            console.log(newState, 'inside reducer')
            return newState
        case 'clearUserTracks':
            newState['userTracks'] = [[]]
            return newState
        default:
            return state;
    }
    
}

export default reducers