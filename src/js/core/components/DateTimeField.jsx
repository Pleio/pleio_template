import React from "react"
import classnames from "classnames"
import Validator from "validatorjs"
import PropTypes from "prop-types"

class DateTimeField extends React.Component {
    constructor(props) {
        super(props)
        this.onChange = this.onChange.bind(this)

        let date
        if (this.props.value) {
            date = new Date(this.props.value)
        } else {
            date = new Date()
        }

        this.state = {
            day: date.getDate(),
            month: date.getMonth() + 1,
            year: date.getFullYear(),
            hour: date.getHours(),
            minute: date.getMinutes()
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

    onChange(field, value) {
        this.setState({
            [field]: value
        })

        if (this.props.onChange) {
            this.props.onChange(field, value)
        }
    }

    isValid() {
        return true
    }

    getValue() {
        const date = new Date()
        date.setFullYear(this.state.year, (this.state.month - 1), this.state.day)
        date.setHours(this.state.hour, this.state.minute)
        return date.toISOString()
    }

    clearValue() {
        this.setState({
            value: ""
        })
    }

    render() {
        return (
            <div>
                <input type="number" onChange={(e) => this.onChange("day", e.target.value)} name={this.props.name + "_date[]"} style={{width:"3em"}} min={1} max={31} value={this.state.day} />-
                <input type="number" onChange={(e) => this.onChange("month", e.target.value)} name={this.props.name + "_date[]"} style={{width:"3em"}} min={1} max={12} value={this.state.month}/>-
                <input type="number" onChange={(e) => this.onChange("year", e.target.value)} name={this.props.name + "_date[]"} style={{width:"5em"}} min={1900} max={3000} value={this.state.year} />&nbsp;
                <input type="number" onChange={(e) => this.onChange("hour", e.target.value)} name={this.props.name + "_time[]"} style={{width:"3em"}} min={0} max={24} value={this.state.hour} />:
                <input type="number" onChange={(e) => this.onChange("minute", e.target.value)} name={this.props.name + "_time[]"} style={{width:"3em"}} min={0} max={60} value={this.state.minute} />
            </div>
        )
    }
}

DateTimeField.contextTypes = {
    attachToForm: PropTypes.func,
    detachFromForm: PropTypes.func
}

export default DateTimeField