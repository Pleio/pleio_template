import React from "react"
import ReactDOM from "react-dom"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Errors from "./components/Errors"
import Modal from "./components/Modal"
import AccessSelect from "./containers/AccessSelect"

class DeleteForm extends React.Component {
    constructor(props) {
        super(props)

        this.state = Object.assign({}, {errors: []}, this.props.entity)
        this.onSubmit = this.onSubmit.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.entity) {
            this.setState(nextProps.entity)
        }
    }

    onSubmit(e) {
        e.preventDefault()

        this.setState({errors: null})

        this.props.mutate({
            variables: {
                input: {
                    clientMutationId: 1,
                    guid: this.state.guid
                }
            },
            refetchQueries: this.props.refetchQueries
        }).then(({data}) => {
            if (this.props.afterDelete) {
                this.props.afterDelete()
            }
        })
    }

    render() {
        let title = ""
        if (this.props.entity) {
            if (this.props.entity.title) {
                title = this.props.entity.title
            } else if (this.props.entity.name) {
                title = this.props.entity.name
            }
        }
        return (
            <form className="form" onSubmit={this.onSubmit}>
                <p>Weet je zeker dat je het item {title} wil verwijderen?</p>
                <button className="button">Verwijder</button>
            </form>
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
const DeleteFormWithMutation = graphql(Mutation)(DeleteForm)

export default class DeleteModal extends React.Component {
    constructor(props) {
        super(props)
        this.toggle = this.toggle.bind(this)
    }

    toggle() {
        this.refs.deleteModal.toggle()
    }

    render() {
        return (
            <Modal ref="deleteModal" id="delete" title={this.props.title}>
                <DeleteFormWithMutation entity={this.props.entity} refetchQueries={this.props.refetchQueries} afterDelete={this.props.afterDelete} />
            </Modal>
        )
    }
}