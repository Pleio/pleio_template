import React from "react"
import Modal from "../../core/components/NewModal"
import ActionContainer from "../../core/components/ActionContainer"
import Form from "../../core/components/Form"
import InputField from "../../core/components/InputField"
import RadioField from "../../core/components/RadioField"
import RichTextField from "../../core/components/RichTextField"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { logErrors } from "../../lib/helpers"
import Errors from "../../core/components/Errors"
import { convertToRaw } from "draft-js"
import autobind from "autobind-decorator"

class Add extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            errors: []
        }
    }

    @autobind
    onSubmit(e) {
        this.setState({
            errors: []
        })

        const values = this.refs.form.getValues()

        let input = {
            clientMutationId: 1,
            title: values.title,
            containerGuid: this.props.containerGuid,
            type: "object",
            subtype: "page",
            pageType: "text"
        }

        if (values.description) {
            input['description'] = values.description.getPlainText()
            input['richDescription'] = JSON.stringify(convertToRaw(values.description))
        }

        this.props.mutate({
            variables: {
                input
            }
        }).then(({data}) => {
            window.location.href = "/cms"
        }).catch((errors) => {
            logErrors(errors)
            this.setState({
                errors: errors
            })
        })
    }

    render() {
        let errors
        if (this.state.errors) {
            errors = ( <Errors errors={this.state.errors} /> );
        }

        return (
            <Form ref="form" onSubmit={this.onSubmit}>
                <div className="container">
                    <div className="row">
                        <div className="col-sm-10 col-sm-offset-1 col-lg-8 col-lg-offset-2">
                            {errors}
                            <div className="form">
                                <InputField label="Titel" name="title" type="text" placeholder="Voeg een korte duidelijke naam toe" className="form__input" rules="required" autofocus />
                                <RichTextField ref="richText" name="description" placeholder="Beschrijving" rules="required" />
                                <div className="buttons ___end ___margin-top">
                                    <button className="button" type="submit">
                                        Aanmaken
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Form>
        )
    }
}

const Mutation = gql`
mutation addEntity($input: addEntityInput!) {
    addEntity(input: $input) {
        entity {
            guid
        }
    }
}
`

const AddWithMutation = graphql(Mutation)(Add)

export default class AddModal extends React.Component {
    @autobind
    toggle() {
        this.refs.modal.toggle()
    }

    render() {
        return (
            <Modal ref="modal" title="Subpagina toevoegen" full>
                <AddWithMutation {...this.props} />
            </Modal>
        )
    }
}