import React from "react"
import classnames from "classnames"
import { isMobile } from "../../lib/helpers"

export default class Select extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isOpen: false
        }

        this.onBlur = this.onBlur.bind(this)
        this.toggle = this.toggle.bind(this)
        this.chooseOption = this.chooseOption.bind(this)
    }

    onBlur(e) {
        this.setState({
            isOpen: false
        })
    }

    toggle(e) {
        e.preventDefault()
        this.setState({ isOpen: !this.state.isOpen })
    }

    chooseOption(e, value) {
        e.preventDefault()
        this.setState({
            isOpen: false
        })

        if (this.props.onChange) {
            this.props.onChange(value)
        } else {
            console.error("No onChange handler for select")
        }
    }

    render() {
        const value = this.props.value ? this.props.options[this.props.value] : null

        const selectOptions = Object.keys(this.props.options).map((value, i) => (
            <option key={i} value={value}>{this.props.options[value]}</option>
        ))

        const options = Object.keys(this.props.options).map((value, i) => (
            <li key={i} onClick={(e) => this.chooseOption(e, value)} className={classnames({"selector__option": true, "___is-open": (this.props.value == value)})}>
                {this.props.options[value]}
            </li>
        ))

        let selectPlaceholder, placeholder
        if (this.props.placeholder) {
            selectPlaceholder = (
                <option disabled>{this.props.placeholder}</option>
            )
            placeholder = (
                <li className="selector__option ___is-disabled">{this.props.placeholder}</li>
            )
        }


        let select
        if (isMobile()) {
            select = (
                <select onChange={(e) => this.chooseOption(e, e.target.value)} value={this.props.value}>
                    {selectPlaceholder}
                    {selectOptions}
                </select>
            )
        }

        let className = classnames({"selector": true, "___is-open": this.state.isOpen, "___is-mobile": isMobile()})
        if (this.props.className) {
            className += " " + this.props.className
        }

        return (
            <div className={className}>
                {select}
                <div tabIndex="0" className={classnames({"selector__select":true, "___not-selected":!this.props.value})} onClick={this.toggle} onBlur={this.onBlur}>
                    <span>{value || (this.props.placeholder || "Maak een keuze")}</span>
                </div>
                <ul className="selector__options">
                    {placeholder}
                    {options}
                </ul>
            </div>
        )
    }
}