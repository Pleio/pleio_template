import React from "react"

export default class AddButton extends React.Component {
    render() {
        const { viewer } = this.props.data

        const title = this.props.title ? this.props.title : "Voeg toe"
        
        if (!viewer || !viewer.canWriteToContainer) {
            return (
                <div />
            )
        }

        return (
            <div className="right-lg">
                <div className="button ___large ___add" onClick={this.props.onClick}><span>{title}</span></div>
            </div>
        )
    }
}