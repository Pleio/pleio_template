import React from "react"
import autobind from "autobind-decorator"

export default class Switch extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            checked: this.props.checked || false
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.checked !== this.props.checked) {
            this.setState({
                checked: nextProps.checked
            })
        }
    }

    @autobind
    onChange(e) {
        e.preventDefault()

        const newState = !this.state.checked

        this.setState({ checked: newState })

        if (this.props.onChange) {
            this.props.onChange(this.props.name, newState)
        }
    }

    render() {
        return (
            <div className="switch" onClick={this.onChange}>
                <input tabIndex={0} ref="checkbox" type="checkbox" id={this.props.id} name={this.props.name} checked={this.state.checked} readOnly={true} />
                <label htmlFor={this.props.id}>
                    {this.props.label}
                </label>
            </div>
        )
    }
}