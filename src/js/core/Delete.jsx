import React from "react"
import ReactDOM from "react-dom"
import { connect } from "react-redux"
import { hideModal } from "../lib/actions"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Errors from "./components/Errors"
import Modal from "./components/Modal"
import AccessSelect from "./containers/AccessSelect"

class DeleteModal extends React.Component {
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
            refetchQueries: ["InfiniteList"]
        }).then(({data}) => {
            this.props.dispatch(hideModal())
        })
    }

    render() {
        let title = ""
        if (this.props.entity) {
            if (this.props.entity.title) {
                title = this.props.entity.title
            }

            if (this.props.entity.name) {
                name = this.props.entity.name
            }
        }

        return (
            <Modal id="delete" title={this.props.title}>
                <form className="form" onSubmit={this.onSubmit}>
                    <p>Weet je zeker dat je het item {title} wil verwijderen?</p>
                    <button className="button">Verwijder</button>
                </form>
            </Modal>
        )
    }
}

const DELETE = gql`
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
const withDelete = graphql(DELETE)

export default connect()(withDelete(DeleteModal))