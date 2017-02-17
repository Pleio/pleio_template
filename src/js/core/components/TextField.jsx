import React from "react"
import classnames from "classnames"
import Validator from "validatorjs"

class TextField extends React.Component {
    constructor(props) {
        super(props)
        this.onChange = this.onChange.bind(this)
        this.forceUpdate = this.forceUpdate.bind(this)
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

    forceUpdate() {
        this.setState({
            value: this.refs.field.value
        })
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
            <textarea
                ref="field"
                name={this.props.name}
                type={this.props.type}
                className={this.props.className}
                placeholder={this.props.placeholder}
                onChange={this.onChange}
                value={this.state.value}
            />
        )
    }
}

TextField.contextTypes = {
    attachToForm: React.PropTypes.func,
    detachFromForm: React.PropTypes.func
}

export default TextField