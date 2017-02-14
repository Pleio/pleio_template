import React from "react"
import classnames from "classnames"
import Switch from "./Switch"
import { Set } from "immutable"

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
        const value = Set(this.props.value)

        let switches = this.props.options.map((tag, i) => {
            return (
                <Switch
                    key={i}
                    name={tag}
                    label={tag}
                    onChange={this.onChange}
                    checked={value.includes(tag)}
                />
            )
        })

        return (
            <div>{switches}</div>
        )
    }
}