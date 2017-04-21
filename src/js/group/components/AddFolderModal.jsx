import React from "react"
import Modal from "../../core/components/NewModal"
import Form from "../../core/components/Form"
import Errors from "../../core/components/Errors"
import InputField from "../../core/components/InputField"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

class AddFolder extends React.Component {
    constructor(props) {
        super(props)
        this.onSubmit = this.onSubmit.bind(this)

        this.state = {
            errors: []
        }
    }

    onSubmit(e) {
        const { containerGuid } = this.props

        const values = this.refs.form.getValues()

        this.props.mutate({
            variables: {
                input: {
                    clientMutationId: 1,
                    type: "object",
                    subtype: "folder",
                    title: values.title,
                    description: "",
                    containerGuid: containerGuid
                }
            }
        }).then(({data}) => {
            location.reload()
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
                    {errors}
                    <div className="form">
                        <InputField label="Naam" name="title" type="text" className="form__input" rules="required" autofocus />
                        <div className="buttons ___end ___margin-top">
                            <button className="button" type="submit">
                                Toevoegen
                            </button>
                        </div>
                    </div>
                </div>
            </Form>
        )
    }
}

const Mutation = gql`
    mutation addFolder($input: addEntityInput!) {
        addEntity(input: $input) {
            entity {
                guid
            }
        }
    }
`
const AddFolderWithMutation = graphql(Mutation)(AddFolder)

export default class AddFolderModal extends React.Component {
    constructor(props) {
        super(props)
        this.toggle = this.toggle.bind(this)
    }

    toggle() {
        this.refs.modal.toggle()
    }

    render() {
        return (
            <Modal ref="modal" title="Nieuwe map">
                <AddFolderWithMutation {...this.props} />
            </Modal>
        )
    }
}