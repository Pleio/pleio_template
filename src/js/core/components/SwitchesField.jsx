import React from "react"
import classnames from "classnames"
import Validator from "validatorjs"
import Switch from "./Switch"
import { Set } from "immutable"
import PropTypes from "prop-types"

class SwitchesField extends React.Component {
    constructor(props) {
        super(props)

        this.onChange = this.onChange.bind(this)

        this.state = {
            checked: this.props.values || []
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!(new Set(nextProps.values).equals(new Set(this.props.values)))) {
            this.setState({
                checked: nextProps.values || []
            })
        }
    }

    componentWillMount() {
        if (this.context.attachToForm) {
            this.context.attachToForm(this)
        }
    }

    componentWillUnmount() {
        if (this.context.detachFromForm) {
            this.context.detachFromForm(this)
        }
    }

    onChange(name, checked) {
        let newState

        if (checked) {
            newState = [ ...this.state.checked, name ]
        } else {
            newState = this.state.checked.filter((i) => i !== name )
        }

        this.setState({
            checked: newState
        })

        if (this.props.onChange) {
            this.props.onChange(name, checked)
        }
    }

    isValid() {
        return true
    }

    getValue() {
        return this.state.checked
    }

    clearValue() {
        this.setState({
            checked: []
        })
    }

    render() {
        let switches = Object.keys(this.props.options).map((tag, i) => {
            return (
                <Switch
                    key={i}
                    name={tag}
                    label={this.props.options[tag]}
                    onChange={this.onChange}
                    checked={this.state.checked.includes(tag)}
                />
            )
        })

        let label
        if (this.props.label) {
            label = (
                <div className="form__label">{this.props.label}</div>
            )
        }

        return (
            <div className="form__item">
                {label}
                {switches}
            </div>
        )
    }
}

SwitchesField.contextTypes = {
    attachToForm: PropTypes.func,
    detachFromForm: PropTypes.func
}

export default SwitchesField