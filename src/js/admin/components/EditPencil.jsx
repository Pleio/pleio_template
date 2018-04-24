import React from "react"

export default class EditPencil extends React.Component {

    render() {
        return (
            <button
                className="navigation__cms"
                onClick={this.props.toggleEditMode}
            />
        )
    }
}