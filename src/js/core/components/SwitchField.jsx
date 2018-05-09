import React from "react"
import classnames from "classnames"
import Validator from "validatorjs"
import Switch from "./Switch"
import PropTypes from "prop-types"

class SwitchField extends React.Component {
    constructor(props) {
        super(props)

        this.onChange = this.onChange.bind(this)

        this.state = {
            checked: this.props.value || false
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value !== this.props.value) {
            this.setState({
                checked: nextProps.value
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
        this.setState({
            checked: checked
        })

        if (this.props.onChange) {
            this.props.onChange(checked)
        }
    }

    isValid() {
        if (this.props.rules) {
            let validation = new Validator({field: this.state.checked}, {field: this.props.rules})
            return validation.passes()
        }

        return true
    }

    getValue() {
        return this.state.checked
    }

    clearValue() {
        this.setState({
            checked: false
        })
    }

    render() {
        return (
            <Switch
                name={this.props.name}
                onChange={this.onChange}
                checked={this.state.checked}
                label={this.props.label}
                disabled={this.props.disabled}
            />
        )
    }
}

SwitchField.contextTypes = {
    attachToForm: PropTypes.func,
    detachFromForm: PropTypes.func
}

export default SwitchField