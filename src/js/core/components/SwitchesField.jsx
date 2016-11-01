import React from "react"
import classnames from "classnames"
import Validator from "validatorjs"
import Switch from "./Switch"

class SwitchesField extends React.Component {
    constructor(props) {
        super(props)

        this.onChange = this.onChange.bind(this)

        this.state = {
            checked: this.props.values || []
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.values !== this.props.values) {
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

        return (
            <div>{switches}</div>
        )
    }
}

SwitchesField.contextTypes = {
    attachToForm: React.PropTypes.func,
    detachFromForm: React.PropTypes.func
}

export default SwitchesField