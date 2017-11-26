import React from "react"

export default class Logout extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        window.location.href = "/action/logout"

        return (
            <div />
        )
    }
}
