import React from "react"
import classnames from "classnames"

export default class ImageContextualMenu extends React.Component {
    render() {
        return (
            <div className={classnames({"contextual": true, "___is-visible":this.props.isVisible})} style={{left: this.props.left}}>
                <div className="contextual__tool ___delete" onClick={this.props.onDelete}></div>
                <div className="contextual__tool ___info" onClick={() => this.props.onClickInfo()} />
            </div>
        )
    }
}