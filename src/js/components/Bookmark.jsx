import React from "react"
import classNames from "classnames"

export default class Bookmark extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isOpen: false
        }

        this.toggleState = (e) => this.setState({isOpen: !this.state.isOpen})
    }

    render() {
        return (
            <div title="Bewaar" onClick={this.toggleState} className={classNames({"button__text article-action ___bookmark": true, "___is-saved": this.state.isOpen})}>
                <span className="___saved">Bewaard</span>
                <span className="___save">Bewaren</span>
            </div>
        )
    }
}