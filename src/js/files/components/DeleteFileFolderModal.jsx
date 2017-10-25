import React from "react"
import Modal from "../../core/components/NewModal"
import Errors from "../../core/components/Errors"
import Form from "../../core/components/Form"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { logErrors } from "../../lib/helpers"

class DeleteFileFolder extends React.Component {
    constructor(props) {
        super(props)
        
        this.onSubmit = this.onSubmit.bind(this)

        this.state = {
            errors: []
        }
    }

    onSubmit(e) {
        const { entities } = this.props

        this.setState({
            errors: []
        })

        Promise.all(entities.map((entity) => {
            return this.props.mutate({
                variables: {
                    input: {
                        clientMutationId: 1,
                        guid: entity.guid
                    }
                }
            })
        })).then(({data}) => {
            location.reload()
        }).catch((errors) => {
            logErrors(errors)
            this.setState({
                errors: errors
            })
        })
    }

    render() {
        let message

        if (this.props.entities.size === 1) {
            message = (
                <p>Weet je zeker dat je <b>{this.props.entities.first().title}</b> wilt verwijderen?</p>
            )
        } else {
            message = (
                <p>Weet je zeker dat je {this.props.entities.size} items wilt verwijderen?</p>
            )
        }

        return (
            <Form ref="form" onSubmit={this.onSubmit}>
                <Errors errors={this.state.errors} />
                <div className="form">
                    {message}
                    <button className="button" type="submit">
                        Verwijderen
                    </button>
                </div>
            </Form>
        )
    }
}

const Mutation = gql`
    mutation deleteEntity($input: deleteEntityInput!) {
        deleteEntity(input: $input) {
            entity {
                guid
            }
        }
    }
`
const DeleteFileFolderWithMutation = graphql(Mutation)(DeleteFileFolder)

export default class DeleteFileFolderModal extends React.Component {
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

    render () {
        const { entity } = this.props

        return (
            <Modal ref="modal" title="Verwijderen" medium>
                <DeleteFileFolderWithMutation {...this.props} onComplete={this.onComplete} />
            </Modal>
        )
    }
}