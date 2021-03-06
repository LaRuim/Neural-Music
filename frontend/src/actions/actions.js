export const loguserin = (loginStatus) => (
    {
        type: 'login',
        payload: loginStatus
    }
)

export const show_login = (showornot) => (
    {
        type: 'registered',
        payload: showornot
    }
)

export const openPlayer = (bool) => (
    {
        type: 'openplayer',
        payload: bool
    }
)

export const openProfile = (bool) => (
    {
        type: 'openprofile',
        payload: bool
    }
)

export const modeSetter = (themeval) => (
    {
        type: 'mode',
        payload: themeval
    }
)

export const pathSong = (path) => (
    {
        type: 'path',
        payload: path
    }
)

export const addUserTrack = (newTrack) => (
    {
        type: 'addUserTrack',
        payload: newTrack
    }
)

export const clearUserTracks = () => (
    {
        type: 'clearUserTracks',
    }
)

export const setAccompanimentModal = (bool) => (
    {
        type: 'setAccompanimentModal',
        payload: bool
    }
)