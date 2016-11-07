import React from "react"
import classnames from "classnames"
import Validator from "validatorjs"

class InputField extends React.Component {
    constructor(props) {
        super(props)

        this.onInput = this.onInput.bind(this)
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

    onInput(e) {
        if (!this.props.name === "username" && !this.props.name === "password") {
            return
        }

        this.onChange(e)
    }

    onChange(e) {
        this.setState({
            value: e.target.value
        })

        if (this.props.onChange) {
            this.props.onChange(e)
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
            <input
                name={this.props.name}
                type={this.props.type}
                className={this.props.className}
                placeholder={this.props.placeholder}
                onChange={this.onChange}
                onInput={this.onInput}
                value={this.state.value}
            />
        )
    }
}

InputField.contextTypes = {
    attachToForm: React.PropTypes.func,
    detachFromForm: React.PropTypes.func
}

export default InputField