import React from "react"
import classnames from "classnames"

class InputField extends React.Component {
    constructor(props) {
        super(props)

        this.onChange = this.onChange.bind(this)

        this.state = {
            checked: false
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.checked !== this.props.checked) {
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
        e.preventDefault()

        this.setState({
            checked: !this.state.checked
        })

        if (this.props.onChange) {
            this.props.onChange(e)
        }
    }

    isValid() {
        if (this.props.rules) {
            return this.state.checked
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
            <div className="checkbox" onClick={this.onChange}>
                <input
                    id={this.props.id}
                    ref="checkbox"
                    name={this.props.name}
                    type={this.props.type}
                    className={this.props.className}
                    placeholder={this.props.placeholder}
                    checked={this.state.checked}
                    readOnly={true}
                />
                <label htmlFor={this.props.id}>
                    {this.props.label}
                </label>
            </div>
        )
    }
}

InputField.contextTypes = {
    attachToForm: React.PropTypes.func,
    detachFromForm: React.PropTypes.func
}

export default InputField