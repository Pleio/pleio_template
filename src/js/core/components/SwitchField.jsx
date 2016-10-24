import React from "react"
import classnames from "classnames"
import Validator from "validatorjs"
import Switch from "./Switch"

class SwitchField extends React.Component {
    constructor(props) {
        super(props)

        this.onChange = this.onChange.bind(this)

        this.state = {
            checked: this.props.checked || ""
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value !== this.props.value) {
            this.setState({
                checked: nextProps.checked
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

    onChange(e) {
        this.setState({
            checked: e.target.checked
        })

        if (this.props.onChange) {
            this.props.onChange(e)
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
            />
        )
    }
}

SwitchField.contextTypes = {
    attachToForm: React.PropTypes.func,
    detachFromForm: React.PropTypes.func
}

export default SwitchField