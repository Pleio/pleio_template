import React from "react"
import Modal from "../../core/components/NewModal"
import Errors from "../../core/components/Errors"
import Form from "../../core/components/Form"
import FolderField from "../../core/components/InputField"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { logErrors } from "../../lib/helpers"

class MoveFileFolder extends React.Component {
    constructor(props) {
        super(props)

        this.onSubmit = this.onSubmit.bind(this)

        this.state = {
            errors: []
        }
    }

    onSubmit(e) {
        const { entity } = this.props

        this.setState({
            errors: []
        })

        const values = this.refs.form.getValues()

        this.props.mutate({
            variables: {
                input: {
                    clientMutationId: 1,
                    guid: entity.guid,
                    title: values.title,
                    file: values.file
                }
            }
        }).then(({data}) => {
            this.props.onComplete()
        }).catch((errors) => {
            logErrors(errors)
            this.setState({
                errors: errors
            })
        })
    }

    render() {
        return (
            <Form ref="form" onSubmit={this.onSubmit}>
                <Errors errors={this.state.errors} />
                <div className="form">
                    <FolderField name="folder" className="form__input" />
                    <button className="button" type="submit">
                        Verplaatsen
                    </button>
                </div>
            </Form>
        )
    }
}

const Mutation = gql`
    mutation editFileFolder($input: editFileFolderInput!) {
        editFileFolder(input: $input) {
            entity {
                guid
                ... on Object {
                    title
                }
            }
        }
    }
`
const MoveFileFolderWithMutation = graphql(Mutation)(MoveFileFolder)

export default class MoveFileFolderModal extends React.Component {
    constructor(props) {
        super(props)
        this.toggle = this.toggle.bind(this)
    }

    toggle() {
        this.refs.modal.toggle()
    }

    render () {
        return (
            <Modal ref="modal" title="Verplaatsen" medium>
                <MoveFileFolderWithMutation {...this.props} />
            </Modal>
        )
    }
}