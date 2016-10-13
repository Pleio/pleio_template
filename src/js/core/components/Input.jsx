import React from "react"
import classnames from "classnames"
import Joi from "joi-browser"

class Input extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            value: this.props.value || "",
            validationStarted: false
        }

        this.getValue = () => this.state.value
        this.isValid = this.isValid.bind(this)
        this.onChange = this.onChange.bind(this)
    }

    componentWillMount() {
        this.context.attachToForm(this)
    }

    componentWillUnmount() {
        this.context.detachFromForm(this)
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
        if (!this.props.validate) {
            return true
        }

        return Joi.validate(this.state.value, this.props.validate)
    }

    render() {
        return (
            <input type={this.props.type || "text"} placeholder={this.props.placeholder} className={this.props.className} onChange={this.onChange} value={this.state.value} />
        )
    }
}

Input.contextTypes = {
    attachToForm: React.PropTypes.func,
    detachFromForm: React.PropTypes.func
}

export default Input