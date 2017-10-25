import React from "react"
import Modal from "../../core/components/NewModal"
import Errors from "../../core/components/Errors"
import Form from "../../core/components/Form"
import FolderField from "./FolderField"
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
        const { entities } = this.props

        this.setState({
            errors: []
        })

        const values = this.refs.form.getValues()

        Promise.all(entities.map((entity) => {
            return this.props.mutate({
                variables: {
                    input: {
                        clientMutationId: 1,
                        guid: entity.guid,
                        containerGuid: values.folder
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
        return (
            <Form ref="form" onSubmit={this.onSubmit}>
                <Errors errors={this.state.errors} />
                <div className="form">
                    <FolderField name="folder" className="form__input" excludeGuids={this.props.entities.map((entity) => entity.guid).toJS()} containerGuid={this.props.containerGuid} />
                    <button className="button" type="submit">
                        Verplaatsen
                    </button>
                </div>
            </Form>
        )
    }
}

const Mutation = gql`
    mutation MoveFileFolderModal($input: moveFileFolderInput!) {
        moveFileFolder(input: $input) {
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
            <Modal ref="modal" title="Verplaatsen naar" medium>
                <MoveFileFolderWithMutation {...this.props} />
            </Modal>
        )
    }
}