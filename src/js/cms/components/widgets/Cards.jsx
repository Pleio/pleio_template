import React from "react"
import { Link } from "react-router-dom"
import autobind from "autobind-decorator"
import Form from "../../../core/components/Form"
import InputField from "../../../core/components/InputField"
import SwitchField from "../../../core/components/SwitchField"
import TagsField from "../../../core/components/TagsField"

export default class Cards extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            visible: true,
            height: "auto"
        }
    }

    @autobind
    onSave() {
        const values = this.refs.form.getValues()

        this.props.onSave([
            { key: "image", value: values.image },
            { key: "title", value: values.title },
            { key: "link", value: values.link }
        ])
    }

    render() {
        const { entity, isEditing } = this.props

        if (isEditing) {
            return (
                <Form ref="form" className="form">
                    <div className="row">
                        <div className="col-sm-6">
                            <SwitchField ref="switch" name="name" label="Blog" value="" onChange="" disabled="" />
                        </div>
                        <div className="col-sm-6">
                            <SwitchField ref="switch" name="name" label="Nieuws" value="" onChange="" disabled="" />
                        </div>
                        <div className="col-sm-6">
                            <SwitchField ref="switch" name="name" label="Discussies" value="" onChange="" disabled="" />
                        </div>
                        <div className="col-sm-6">
                            <SwitchField ref="switch" name="name" label="Agenda" value="" onChange="" disabled="" />
                        </div>
                        <div className="col-sm-6">
                            <SwitchField ref="switch" name="name" label="Groepen" value="" onChange="" disabled="" />
                        </div>
                        <div className="col-sm-6">
                            <SwitchField ref="switch" name="name" label="Vragen" value="" onChange="" disabled="" />
                        </div>
                    </div>
                    <br />
                    <TagsField label="Filteren op steekwoorden (tags)" name="tags" type="text" value={[]} />
                </Form>
            )
        }

        return (
            <div>
                viewing
            </div>
        )
    }
}
