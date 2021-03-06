import React from "react"
import Modal from "./components/Modal"
import { logErrors } from "../lib/helpers"
import { graphql } from "react-apollo"
import { Link } from "react-router-dom"
import gql from "graphql-tag"
import Form from "./components/Form"
import InputField from "./components/InputField"

class ForgotPassword extends React.Component {

    constructor(props) {
        super(props)
        this.onSubmit = this.onSubmit.bind(this)

        this.state = {
            success: false
        }
    }

    onSubmit(e) {
        let values = this.refs.form.getValues()

        this.props.mutate({
            variables: {
                input: {
                    clientMutationId: 1,
                    username: values.username
                }
            }
        }).then(({data}) => {
            this.setState({
                success: true,
                username: ""
            })
        }).catch((errors) => {
            logErrors(errors)
            this.setState({
                errors: errors
            })
        })
    }

    render() {
        let errors;
        if (this.state.errors) {
            errors = ( <Errors errors={this.state.errors} /> );
        }

        let body = ""
        if (!this.state.success) {
            body = (
                <Form ref="form" className="form login" onSubmit={this.onSubmit}>
                    <InputField name="username" type="text" placeholder="Gebruikersnaam of e-mail" className="form__input" rules="required" />
                    <div className="buttons ___end">
                        <button type="submit" className="button ___large ___primary">
                            Aanvragen
                        </button>
                    </div>
                </Form>
            )
        } else {
            body = (
                <form className="form">
                    <p>Binnen enkele minuten ontvang je een e-mail met een link naar een unieke verificatiepagina. Klik op de link in het bericht en een nieuw wachtwoord zal naar je worden opgestuurd</p>
                    <div className="buttons ___end ___margin-top">
                        <Link to="/login">
                            <div className="button__underline">
                                Terug naar inloggen
                            </div>
                        </Link>
                    </div>
                </form>
            )
        }

        return (
            <Modal ref="modal" id="forgotPassword" title="Wachtwoord vergeten?" steps={[1,2]} small={true} isBlue={true} noParent={true} history={this.props.history}>
                {errors}
                {body}
            </Modal>
        )
    }
}

const Query = gql`
    mutation forgotPassword($input: forgotPasswordInput!) {
        forgotPassword(input: $input) {
            status
        }
    }
`

export default graphql(Query)(ForgotPassword)
