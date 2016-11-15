import React from "react"
import RichTextField from "../../../core/components/RichTextField"
import Form from "../../../core/components/Form"

export default class TextSettings extends React.Component {
    render() {
        return (
            <Form ref="form">
                <RichTextField name="text" className="form__input" rules="required" />
            </Form>
        )
    }
}