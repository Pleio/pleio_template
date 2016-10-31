export const showModal = (name) => {
    return {
        type: 'SHOW_MODAL',
        name
    }
}

export const hideModal = () => {
    return {
        type: 'HIDE_MODAL'
    }
}

export const search = (q) => {
    return {
        type: 'SEARCH',
        q
    }
}