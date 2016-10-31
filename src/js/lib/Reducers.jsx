export const currentLanguage = (state = {}, action) => {
    switch (action.type) {
        case "CHANGE_LANG":
            return action.lang
        default:
            return state
    }
}

export const modal = (state = {}, action) => {
    switch (action.type) {
        case "SHOW_MODAL":
            document.body.classList.add("modal__open")
            return action.name
        case "HIDE_MODAL":
            document.body.classList.remove("modal__open")
            return null
        default:
            return state
    }
}

export const search = (state = {}, action) => {
    switch (action.type) {
        case "SEARCH":
            return action.q
        default:
            return state
    }
}