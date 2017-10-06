const initialState = {
    adminEditing: false
}

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case "start_editing":
            return Object.assign({}, state, {
                adminEditing: true
            })
        case "stop_editing":
            return Object.assign({}, state, {
                adminEditing: false
            })
        default:
            return state
    }
}