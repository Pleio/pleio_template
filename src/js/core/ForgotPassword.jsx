import React from "react"
import Modal from "./components/Modal"
import { connect } from "react-redux"
import { showModal } from "../lib/actions"
import { logErrors } from "../lib/helpers"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Form from "./components/Form"
import InputField from "./components/InputField"

class ForgotPassword extends React.Component {

    constructor(props) {
        super(props)
        this.showLogin = this.showLogin.bind(this)
        this.onSubmit = this.onSubmit.bind(this)

        this.state = {
            success: false
        }
    }

    showLogin(e) {
        e.preventDefault()

        this.setState({
            success: false
        })

        this.props.dispatch(showModal("login"))
    }

    onSubmit(e) {
        e.preventDefault()

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
                        <div className="button__underline" onClick={this.showLogin}>
                            Terug naar inloggen
                        </div>
                    </div>
                </form>
            )
        }

        return (
            <Modal ref="modal" id="forgotPassword" title="Wachtwoord vergeten?" steps={[1,2]} small={true} isBlue={true}>
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
const withQuery = graphql(Query)
export default connect()(withQuery(ForgotPassword))
