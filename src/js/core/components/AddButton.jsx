import React from "react"

export default class AddButton extends React.Component {
    render() {
        if (!this.props.data.entities || !this.props.data.entities.canWrite) {
            return (
                <div></div>
            )
        }

        const title = this.props.title ? this.props.title : "Voeg toe"

        return (
            <div className="right-lg">
                <div className="button ___large ___add" onClick={this.props.onClick}><span>{title}</span></div>
            </div>
        )
    }
}