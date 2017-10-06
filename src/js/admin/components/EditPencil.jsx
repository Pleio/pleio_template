import React from "react"

export default class EditPencil extends React.Component {
    render() {
        const { viewer } = this.props

        // disable this functionality for now, until it is ready
        return (
            <div />
        )

        if (viewer.isAdmin) {
            return (
                <div className="navigation__cms"></div>
            )
        }
    }
}