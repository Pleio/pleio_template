import React from "react"
import Form from "../../../core/components/Form"
import TextField from "../../../core/components/TextField"
import { convertToRaw } from "draft-js"
import autobind from "autobind-decorator"
import { loadScript } from "../../../lib/helpers"

export default class HTML extends React.Component {
    @autobind
    getSetting(key, defaultValue) {
        const { entity } = this.props

        let value = defaultValue || ""
        entity.settings.forEach((setting) => {
            if (setting.key === key) {
                value = setting.value
            }
        })

        return value
    }

    @autobind
    onSave() {
        const values = this.refs.form.getValues()

        this.props.onSave([
            { key: "description", value: values.description}
        ])
    }

    @autobind
    getHTML() {
        const { entity } = this.props

        return {
            __html: this.getSetting("description")
        }
    }

    componentDidMount() {
        const el = document.createElement("html")
        el.innerHTML = this.getSetting("description")

        const scripts = el.getElementsByTagName("script")
        for (let i = 0; i < scripts.length; i++) {
            if (scripts[i].src) {
                loadScript(scripts[i].src)
            } else {
                window.eval(scripts[i].innerText)
            }
        }
    }

    componentDidUpdate() {
        this.componentDidMount()
    }

    render() {
        const { entity, isEditing } = this.props

        if (isEditing) {
            return (
                <Form ref="form" className="form">
                    <TextField name="description" placeholder="Hier komt de code..." value={this.getSetting("description")} />
                </Form>
            )
        }

        return (
            <div className="cms-block-html" dangerouslySetInnerHTML={this.getHTML()} />
        )
    }
}