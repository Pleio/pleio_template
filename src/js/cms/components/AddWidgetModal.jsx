import React from "react"
import { logErrors } from "../../lib/helpers"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Modal from "../../core/components/Modal"
import Form from "../../core/components/Form"
import Errors from "../../core/components/Errors"
import SelectField from "../../core/components/SelectField"

const widgetOptions = {
    "Leader": "Volledige afbeelding",
    "Text": "Tekst",
    "Recommended": "Aanbevolen",
    "Trending": "Trending",
    "Top": "Top bloggers",
    "Objects": "Lijst met objecten",
}

class AddWidget extends React.Component {
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
            if (this.props.afterAdd) {
                this.props.afterAdd()
            }
        }).catch((errors) => {
            logErrors(errors)
        })
    }

    render() {
        return (
            <Form ref="form" onSubmit={this.onSubmit}>
                <SelectField label="Type" name="type" className="form__input" options={widgetOptions} rules="required" />
                <div className="buttons">
                    <button className="button" onClick={this.onSubmit}>
                        Toevoegen
                    </button>
                </div>
            </Form>
        )
    }
}

const Mutation = gql`
    mutation addWidget($input: addWidgetInput!) {
        addWidget(input: $input) {
            entity {
                guid
                status
                ... on Page {
                    title
                    canEdit
                    widgets {
                        guid
                        type
                        width
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

const AddWidgetWithMutation = graphql(Mutation)(AddWidget)

export default class AddWidgetModal extends React.Component {
    constructor(props) {
        super(props)
        this.toggle = () => this.refs.modal.toggle()
    }

    render() {
        return (
            <Modal ref="modal" title="Widget toevoegen">
                <AddWidgetWithMutation afterAdd={this.toggle} {...this.props} />
            </Modal>
        )
    }
}