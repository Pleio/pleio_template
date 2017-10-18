import React from "react"
import Form from "../../../core/components/Form"
import InputField from "../../../core/components/InputField"
import RichTextField from "../../../core/components/RichTextField"
import RichTextView from "../../../core/components/RichTextView"
import { convertToRaw } from "draft-js"
import autobind from "autobind-decorator"

export default class Text extends React.Component {
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
            { key: "description", value: values.description.getPlainText()},
            { key: "richDescription", value: JSON.stringify(convertToRaw(values.description))}
        ])
    }

    render() {
        const { entity, isEditing } = this.props

        if (isEditing) {
            return (
                <Form ref="form" className="form">
                    <RichTextField name="description" placeholder="Hier komt de tekst..." value={this.getSetting("description")} richValue={this.getSetting("richDescription")} isInline />
                </Form>
            )
        }

        return (
            <RichTextView value={this.getSetting("description", "Hier komt een tekst")} richValue={this.getSetting("richDescription")} />
        )
    }
}