import React from "react"
import Modal from "../../core/components/NewModal"
import Form from "../../core/components/Form"
import Errors from "../../core/components/Errors"
import FileField from "../../core/components/FileField"
import { logErrors } from "../../lib/helpers"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

class AddFile extends React.Component {
    constructor(props) {
        super(props)
        this.onSubmit = this.onSubmit.bind(this)

        this.state = {
            errors: []
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

        Promise.all(this.convertFileListToArray(values.files).map((file) => {
            return this.props.mutate({
                variables: {
                    input: {
                        clientMutationId: 1,
                        containerGuid: containerGuid,
                        file
                    }
                }
            })
        })).then(({data}) => {
            location.reload()
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
                        <FileField label="Naam" name="files" className="form__input" rules="required" multiple={true} autofocus />
                        <div className="buttons ___end ___margin-top">
                            <button className="button" type="submit">
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
        this.toggle = this.toggle.bind(this)
    }

    toggle() {
        this.refs.modal.toggle()
    }

    render() {
        return (
            <Modal ref="modal" title="Nieuw bestand" medium>
                <AddFileWithMutation {...this.props} />
            </Modal>
        )
    }
}