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
        let icon
        if (this.props.className === "card-list-trending") {
            icon = (
                <div className="card-list-trending__icon" />
            )
        }

        return (
            <div className={this.props.className + " " + classnames({"___is-open": this.state.isOpen})}>
                <div className={this.props.className + "__title accordion__trigger ___tablet"} onClick={this.toggleOpen}>
                    {this.props.title}
                    {icon}
                </div>
                <div ref="items" className={this.props.className + "__items accordion__content"} style={this.calculateHeight() ? {height: this.calculateHeight()} : {}} data-accordion-content>
                    <div>
                        {this.props.children}
                    </div>
                </div>
            </div>
        )
    }
}