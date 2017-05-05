import React from "react"
import Modal from "../../core/components/Modal"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

class DeleteWidget extends React.Component {
    constructor(props) {
        super(props)

        this.onSubmit = this.onSubmit.bind(this)
    }

    onSubmit(e) {
        e.preventDefault()

        this.setState({errors: null})

        this.props.mutate({
            variables: {
                input: {
                    clientMutationId: 1,
                    guid: this.props.entity.guid
                }
            },
            refetchQueries: ["PageItem"]
        }).then(({data}) => {
            this.props.afterDelete()
        })
    }

    render() {
        return (
            <form className="form" onSubmit={this.onSubmit}>
                <p>Weet je zeker dat je dit widget wil verwijderen?</p>
                <button className="button" type="submit">Verwijder</button>
            </form>
        )
    }
}

const Mutation = gql`
    mutation deleteEntity($input: deleteEntityInput!) {
        deleteEntity(input: $input) {
            entity {
                guid
                ... on Object {
                    status
                }
            }
        }
    }
`

const DeleteWidgetWithMutation = graphql(Mutation)(DeleteWidget)

export default class DeleteWidgetModal extends React.Component {
    constructor(props) {
        super(props)
        this.toggle = () => this.refs.modal.toggle()
    }
    
    render() {
        return (
            <Modal ref="modal" title="Widget verwijderen">
                <DeleteWidgetWithMutation {...this.props} />
            </Modal>
        )
    }
}