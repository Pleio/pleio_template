import React from "react"
import { logErrors } from "../../lib/helpers"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Modal from "../../core/components/Modal"
import Form from "../../core/components/Form"
import Errors from "../../core/components/Errors"
import SelectField from "../../core/components/SelectField"
import TextSettings from "./widgets/TextSettings"

const widgetOptions = {
    "Leader": "Volledige afbeelding",
    "Text": "Tekst",
    "Recommended": "Aanbevolen",
    "Trending": "Trending",
    "Top": "Top bloggers"
}

class AddWidgetModal extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            errors: []
        }

        this.onSubmit = this.onSubmit.bind(this)
    }

    onSubmit(e) {
        e.preventDefault()

        this.setState({
            errors: []
        })

        const values = this.refs.form.getValues()

        this.props.mutate({
            variables: {
                input: {
                    clientMutationId: 1,
                    pageGuid: this.props.entity.guid,
                    type: values.type,
                    settings: []
                }
            }
        }).then(({data}) => {
            this.refs.form.clearValues()
        }).catch((errors) => {
            logErrors(errors)
            this.setState({
                errors: errors
            })
        })
    }

    render() {
        return (
            <Modal id="addWidget" title="Widget toevoegen">
                <Form ref="form" onSubmit={this.onSubmit}>
                    <SelectField label="Type" name="type" className="form__input" options={widgetOptions} rules="required" />
                    <div className="buttons">
                        <button className="button" onClick={this.onSubmit}>
                            Toevoegen
                        </button>
                    </div>
                </Form>
            </Modal>
        )
    }
}

const Mutation = gql`
    mutation addWidget($input: addWidgetInput!) {
        addWidget(input: $input) {
            entity {
                guid
                ... on Page {
                    widgets {
                        guid
                        type
                        row
                        settings {
                            key
                            value
                        }
                    }
                }
            }
        }
    }
`
export default graphql(Mutation)(AddWidgetModal)