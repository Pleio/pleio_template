import React from "react"
import { Link } from "react-router-dom"
import autobind from "autobind-decorator"
import classnames from "classnames"

export default class DropdownButton extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isOpen: false
        }
    }

    @autobind
    toggle(e) {
        this.setState({ isOpen: !this.state.isOpen })
    }

    @autobind
    onBlur(e) {
        this.setState({ isOpen: false })
    }

    render() {
        const options = this.props.options.map((option, i) => {
            if (option.onClick) {
                return ( <span key={i} onClick={option.onClick}>{option.name}</span> )
            } else if (option.to) {
                return (<Link key={i} to={option.to}>{option.name}</Link>)
            } else {
                return (<a key={i} href={option.href}>{option.name}</a>)
            }
        })

        return (
            <div tabIndex="0" className={classnames({"button ___large ___dropdown": true, "___is-open": this.state.isOpen, "___line": this.props.line, "___colored": this.props.colored})} onBlur={this.onBlur}>
                <span onClick={this.toggle}>{this.props.name}</span>
                <div className="option-list">
                    {options}
                </div>
            </div>
        )
    }
}