import React from "react"
import ReactDOM from "react-dom"
import { connect } from "react-redux"
import { hideModal } from "../lib/actions"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Errors from "../components/Errors"
import Modal from "../components/Modal"
import RichText from "../components/RichText"
import AccessSelect from "../containers/AccessSelect"

class DeleteModal extends React.Component {
    constructor(props) {
        super(props)

        this.onSubmit = this.onSubmit.bind(this)
    }

    onSubmit(e) {
        e.preventDefault()

        this.setState({
            errors: null
        })

        this.props.mutate({
            variables: {
                input: {
                    clientMutationId: 1,
                    guid: this.props.object.guid,
                }
            },
            refetchQueries: ["NewsList", "NewsItem"]
        }).then(({data}) => {
            this.props.dispatch(hideModal())
        }).catch((errors) => {
            this.setState({
                errors: errors
            })
        })
    }

    render() {
        let title = this.props.object ? this.props.object.title : ""

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
            result
        }
    }
`
const withDelete = graphql(DELETE)

export default connect()(withDelete(DeleteModal))