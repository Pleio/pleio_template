import React from "react"
import classnames from "classnames"
import Validator from "validatorjs"
import Select from "./Select"

class SelectField extends React.Component {
    constructor(props) {
        super(props)

        this.onChange = this.onChange.bind(this)

        this.state = {
            value: this.props.value || ""
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value !== this.props.value) {
            this.setState({
                value: nextProps.value
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

    onChange(e, value) {
        this.setState({
            value: value
        })

        if (this.props.onChange) {
            this.props.onChange(e, value)
        }
    }

    isValid() {
        if (this.props.rules) {
            let validation = new Validator({field: this.state.value}, {field: this.props.rules})
            return validation.passes()
        }

        return true
    }

    getValue() {
        return this.state.value
    }

    clearValue() {
        this.setState({
            value: ""
        })
    }

    render() {
        return (
            <Select
                name={this.props.name}
                options={this.props.options}
                className={this.props.className}
                onChange={this.onChange}
            />
        )
    }
}

SelectField.contextTypes = {
    attachToForm: React.PropTypes.func,
    detachFromForm: React.PropTypes.func
}

export default SelectField