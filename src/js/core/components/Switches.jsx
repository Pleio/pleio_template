import React from "react"
import classnames from "classnames"
import Switch from "./Switch"

export default class Switches extends React.Component {
    constructor(props) {
        super(props)

        this.onChange = this.onChange.bind(this)
    }

    onChange(name, checked) {
        if (this.props.onChange) {
            this.props.onChange(name, checked)
        }
    }

    render() {
        let switches = Object.keys(this.props.options).map((tag, i) => {
            return (
                <Switch
                    key={i}
                    name={tag}
                    label={this.props.options[tag]}
                    onChange={this.onChange}
                    checked={this.props.values.includes(tag)}
                />
            )
        })

        return (
            <div>{switches}</div>
        )
    }
}