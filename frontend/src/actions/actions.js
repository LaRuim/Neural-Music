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

export const openGen = (bool) => (
    {
        type: 'opengen',
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