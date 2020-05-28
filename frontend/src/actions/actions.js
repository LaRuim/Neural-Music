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