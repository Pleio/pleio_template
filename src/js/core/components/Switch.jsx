import React from "react"

export default class Switch extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            checked: this.props.checked || false
        }

        this.onClick = (e) => this.setState({checked: !this.state.checked})
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            checked: nextProps.checked
        })
    }

    render() {
        return (
            <div className="switch" onClick={this.onClick}>
                <input tabIndex={0} type="checkbox" id={this.props.id} name={this.props.name} onChange={this.props.onChange} checked={this.state.checked} />
                <label htmlFor={this.props.id}>
                    {this.props.label}
                </label>
            </div>
        )
    }
}