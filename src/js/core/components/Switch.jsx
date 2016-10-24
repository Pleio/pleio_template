import React from "react"

export default class Switch extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            checked: this.props.checked || false
        }

        this.onChange = this.onChange.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.checked !== this.props.checked) {
            this.setState({
                checked: nextProps.checked
            })
        }
    }

    onChange(e) {
        const newState = !this.state.checked

        this.setState({
            checked: newState
        })

        if (this.props.onChange) {
            this.props.onChange(this.props.name, newState)
        }
    }

    render() {
        return (
            <div className="switch" onClick={this.onChange}>
                <input ref="checkbox" tabIndex={0} type="checkbox" id={this.props.id} name={this.props.name} checked={this.state.checked} readOnly={true} />
                <label htmlFor={this.props.id}>
                    {this.props.label}
                </label>
            </div>
        )
    }
}