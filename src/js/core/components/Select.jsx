import React from 'react'
import classNames from 'classnames'

export default class Select extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isOpen: false,
            value: this.props.value ? this.props.value : null
        }

        this.onSelect = this.onSelect.bind(this)
        this.onBlur = this.onBlur.bind(this)
        this.onToggle = this.onToggle.bind(this)
        this.isMobile = this.isMobile.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value !== this.props.value) {
            this.setState({
                value: nextProps.value
            })
        }
    }

    onToggle(e) {
        e.preventDefault()

        this.setState({
            isOpen: !this.state.isOpen
        })
    }

    onBlur(e) {
        this.setState({
            isOpen: false
        })
    }

    onSelect(e, value) {
        e.preventDefault()

        this.setState({
            isOpen: false
        })

        if (!value) {
            return
        }

        if (this.props.onChange) {
            this.props.onChange(this.props.name, value)
        } else {
            this.setState({ value })
        }
    }

    render() {
        let options = {};
        if (this.props.options) {
            options = this.props.options;
        }

        let selectOptions = Object.keys(options).map(option => (
            <option key={option} value={option}>
                {options[option]}
            </option>
        ))

        let ulOptions = Object.keys(options).map(option => (
            <li
                key={option}
                className={classNames({ "selector__option": true, "___is-selected": option == this.state.value, "___is-disabled": option == "disabled" })}
                onClick={(e) => this.onSelect(e, option)}
            >
                {options[option]}
            </li>
        ))

        let selected = "Maak een keuze"
        if (typeof(this.state.value) !== "undefined") {
            selected = options[this.state.value]
        }

        let placeholder
        if (this.props.placeholder) {
            placeholder = (
                <li className="selector__option ___is-disabled">
                    {this.props.placeholder}
                </li>
            )
        }

        return (
            <div className={classNames({ "selector": true, [this.props.className]: true, "___is-open": this.state.isOpen, "___is-mobile": this.isMobile() })}>
                <select onChange={(e) => this.onSelect(e, e.target.value)} value={ this.state.value || "disabled" } readOnly>
                    {selectOptions}
                </select>
                <div className={classNames({ "selector__select": true, "___not-selected": (this.state.value ? false : true) })} tabIndex="0" onClick={this.onToggle} onBlur={this.onBlur}>
                    {selected}
                </div>
                <ul className="selector__options">
                    {placeholder}
                    {ulOptions}
                </ul>
            </div>
        )
    }

    isMobile() {
        let userAgent = (window.navigator.userAgent||window.navigator.vendor||window.opera),
            isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(userAgent);

        return isMobile ? true : false;
    }
}
