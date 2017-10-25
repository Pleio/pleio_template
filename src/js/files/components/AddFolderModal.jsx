import React from "react"
import Modal from "../../core/components/NewModal"
import Form from "../../core/components/Form"
import Errors from "../../core/components/Errors"
import AccessField from "../../core/components/AccessField"
import InputField from "../../core/components/InputField"
import { logErrors } from "../../lib/helpers"
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
            },
            refetchQueries: ["FilesList"]
        }).then(({data}) => {
            this.refs.form.clearValues()
            this.props.onComplete()
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

        let permissions
        if (window.__SETTINGS__['advancedPermissions']) {
            permissions = (
                <div>
                    <AccessField name="accessId" label="Leesrechten" />
                    <AccessField name="writeAccessId" label="Schrijfrechten" value="0" />
                </div>
            )
        }

        return (
            <Form ref="form" onSubmit={this.onSubmit}>
                <div className="container">
                    {errors}
                    <div className="form">
                        <InputField label="Naam" name="title" type="text" className="form__input" rules="required" autofocus />
                        {permissions}
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
        this.onComplete = this.onComplete.bind(this)
        this.toggle = this.toggle.bind(this)
    }

    onComplete() {
        this.props.onComplete()
        this.toggle()
    }

    toggle() {
        this.refs.modal.toggle()
    }

    render() {
        return (
            <Modal ref="modal" title="Nieuwe map" medium>
                <AddFolderWithMutation {...this.props} onComplete={this.onComplete} />
            </Modal>
        )
    }
}