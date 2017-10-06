import React from "react"
import { gql, graphql } from "react-apollo"
import Form from "../../../core/components/Form"
import InputField from "../../../core/components/InputField"
import RichTextField from "../../../core/components/RichTextField"
import RichTextView from "../../../core/components/RichTextView"
import { convertToRaw } from "draft-js"

class Text extends React.Component {
    constructor(props) {
        super(props)
        this.getSetting = this.getSetting.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

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

    onSubmit(e) {
        const { entity } = this.props

        const values = this.refs.form.getValues()

        this.props.mutate({
            variables: {
                input: {
                    clientMutationId: "1",
                    guid: entity.guid,
                    row: 1,
                    col: 1,
                    settings: [
                        { key: "title", "value": values.title },
                        { key: "description", "value": values.description.getPlainText()},
                        { key: "richDescription", "value": JSON.stringify(convertToRaw(values.description))}
                    ]
                }
            }
        }).then(({data}) => {
            this.props.toggleEdit()
        })
    }

    render() {
        const { entity, isEditing } = this.props

        if (isEditing) {
            return (
                <div className="card-list-trending">
                    <Form ref="form" className="form" onSubmit={this.onSubmit}>
                        <InputField type="text" name="title" placeholder="Titel" className="form__input" value={this.getSetting("title")} />
                        <RichTextField name="description" placeholder="Hier komt de tekst..." className="form__input" value={this.getSetting("description")} richValue={this.getSetting("richDescription")} />

                        <div className="buttons ___space-between">
                            <button className="button" type="submit">
                                Opslaan
                            </button>
                        </div>
                    </Form>
                </div>

            )
        }

        return (
            <div className="card-list-trending">
                <div className="card-list-trending__title">{this.getSetting("title", "Hier komt een titel")}</div>
                <div className="card-list-trending__items">
                    <RichTextView value={this.getSetting("description", "Hier komt een tekst")} richValue={this.getSetting("richDescription")} />
                </div>
            </div>
        )
    }
}

const Mutation = gql`
    mutation editWidget($input: editWidgetInput!) {
        editWidget(input: $input) {
            entity {
                guid
                ... on Widget {
                    settings {
                        key
                        value
                    }
                }
            }
        }
    }
`

export default graphql(Mutation)(Text)