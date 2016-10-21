import React from "react"
import classnames from "classnames"

export default class Accordeon extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isOpen: false
        }

        this.toggleOpen = (e) => this.setState({isOpen: !this.state.isOpen})
        this.calculateHeight = this.calculateHeight.bind(this)
    }

    calculateHeight() {
        if (this.state.isOpen) {
            return this.refs["items"].firstChild.offsetHeight;
        }

        return 0
    }

    render() {
        return (
            <div className={this.props.className + " " + classnames({"___is-open": this.state.isOpen})}>
                <div className={this.props.className + "__title"} onClick={this.toggleOpen}>
                    {this.props.title}
                </div>
                <div ref="items" className={this.props.className + "__items"} style={this.calculateHeight() ? {height: this.calculateHeight()} : {}}>
                    <div>
                        {this.props.children}
                    </div>
                </div>
            </div>
        )
    }
}