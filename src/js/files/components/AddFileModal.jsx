import React from "react"
import Modal from "../../core/components/NewModal"
import Form from "../../core/components/Form"
import Errors from "../../core/components/Errors"
import FileField from "../../core/components/FileField"
import AccessField from "../../core/components/AccessField"
import { logErrors } from "../../lib/helpers"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

class AddFile extends React.Component {
    constructor(props) {
        super(props)
        this.onSubmit = this.onSubmit.bind(this)

        this.state = {
            errors: [],
            isUploading: false
        }
    }

    convertFileListToArray(input) {
        let files = []

        for (var i = 0; i < input.length; i++) {
            files.push(input[i])
        }

        return files
    }

    onSubmit(e) {
        const values = this.refs.form.getValues()
        const { containerGuid } = this.props

        this.setState({
            errors: [],
            isUploading: true
        })

        Promise.all(this.convertFileListToArray(values.files).map((file) => {
            return this.props.mutate({
                variables: {
                    input: {
                        clientMutationId: 1,
                        containerGuid: containerGuid,
                        accessId: values.accessId,
                        writeAccessId: values.writeAccessId,
                        file
                    }
                }
            })
        })).then(({data}) => {
            location.reload()
        }).catch((errors) => {
            logErrors(errors)
            this.setState({
                errors: errors,
                isUploading: false
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
                    <AccessField write name="writeAccessId" label="Schrijfrechten" />
                </div>
            )
        }

        return (
            <Form ref="form" onSubmit={this.onSubmit}>
                <div className="container">
                    {errors}
                    <div className="form">
                        <FileField label="Naam" name="files" className="form__input" rules="required" multiple={true} isUploading={this.state.isUploading} autofocus />
                        {permissions}
                        <div className="buttons ___end ___margin-top">
                            <button className="button" type="submit" disabled={this.state.isUploading}>
                                Uploaden
                            </button>
                        </div>
                    </div>
                </div>
            </Form>
        )
    }
}

const Mutation = gql`
    mutation addFile($input: addFileInput!) {
        addFile(input: $input) {
            entity {
                guid
            }
        }
    }
`
const AddFileWithMutation = graphql(Mutation)(AddFile)

export default class AddFileModal extends React.Component {
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
            <Modal ref="modal" title="Nieuw bestand" medium>
                <AddFileWithMutation {...this.props} onComplete={this.toggle} />
            </Modal>
        )
    }
}