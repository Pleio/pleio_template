import React from "react"
import classnames from "classnames"

export default class Select extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isOpen: false
        }

        this.toggle = this.toggle.bind(this)
        this.chooseOption = this.chooseOption.bind(this)
    }

    toggle(e) {
        this.setState({ isOpen: !this.state.isOpen })
    }

    chooseOption(e, value) {
        this.toggle(e)

        if (this.props.onChange) {
            this.props.onChange(value)
        } else {
            console.error("No onChange handler for select")
        }
    }

    render() {
        const value = this.props.value ? this.props.options[this.props.value] : this.props.options[Object.keys(this.props.options)[0]]
        const options = Object.keys(this.props.options).map((value, i) => (
            <li key={i} onClick={(e) => this.chooseOption(e, value)} className={classnames({"selector__option": true, "___is-open": (this.props.value == value)})}>
                {this.props.options[value]}
            </li>
        ))

        return (
            <div className={classnames({"selector": true, "___is-open": this.state.isOpen})}>
                <div tabIndex="0" className="selector__select" onClick={this.toggle}>
                    {value}
                </div>
                <ul className="selector__options">
                    {options}
                </ul>
            </div>
        )
    }
}