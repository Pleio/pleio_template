import React from "react"
import PropTypes from "prop-types"
import autobind from "autobind-decorator"

class RadioField extends React.Component {
    constructor(props) {
        super(props)
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

    @autobind
    onChange(e) {
        this.setState({ value: e.target.value })

        if (this.props.onChange) {
            this.props.onChange(e)
        }
    }

    isValid() {
        return true
    }

    @autobind
    forceUpdate() {
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

    @autobind
    getValue() {
        return this.state.value
    }

    @autobind
    clearValue() {
        this.setState({ value: this.props.value })
    }

    render() {
        const options = this.props.options.map((option, i) => (
            <div key={i} className="radio">
                <input type="radio" name={this.props.name} id={option.value} onChange={this.onChange} checked={this.state.value == option.value} value={option.value} />
                <label htmlFor={option.value}>{option.name}</label>
                <div className="radio__check" />
            </div>
        ))

        return (
            <div className="row">
                <div className="col-sm-6">
                    {options}
                </div>
            </div>
        )
    }
}


RadioField.contextTypes = {
    attachToForm: PropTypes.func,
    detachFromForm: PropTypes.func
}

export default RadioField