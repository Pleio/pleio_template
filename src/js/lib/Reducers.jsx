export const currentLanguage = (state = {}, action) => {
    switch (action.type) {
        case 'CHANGE_LANG':
            return action.lang
        default:
            return state
    }
}

export const modal = (state = {}, action) => {
    switch (action.type) {
        case 'SHOW_MODAL':
            return action.name
        case 'HIDE_MODAL':
            return null
        default:
            return state
    }
}