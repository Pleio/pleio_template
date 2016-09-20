import React from "react"
import ReactDOM from "react-dom"
import { connect } from "react-redux"
import { hideModal } from "../lib/actions"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Errors from "../elements/Errors"
import Modal from "../elements/Modal"
import RichText from "../elements/RichText"

class AddModal extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            errors: null
        }

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
                    username: this.state.username,
                    password: this.state.password,
                    rememberMe: this.state.rememberMe
                }
            }
        }).then(({data}) => {
            this.props.dispatch(hideModal())
        }).catch((errors) => {
            this.setState({
                errors: errors
            })
        })
    }

    render() {
        return (
            <Modal id="add" title={this.props.title}>
                <form className="form login">
                    <label className="form__item">
                        <input type="text" placeholder="Titel" className="form__input" />
                    </label>
                    <label className="form__item">
                        <RichText placeholder="Beschrijving" />
                    </label>

                    <button data-modal-toggle="#register-2" className="button">Toevoegen</button>
                </form>
            </Modal>
        )
    }
}

const ADD = gql`
    mutation addObject($input: addObjectInput!) {
        addObject(input: $input) {
            object {
                guid
            }
        }
    }
`
const withAdd = graphql(ADD)
export default connect()(withAdd(AddModal))