import React from "react"
import Modal from "./components/Modal"
import { connect } from "react-redux"
import { showModal } from "../lib/actions"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

class ForgotPassword extends React.Component {

    constructor(props) {
        super(props)

        this.changeUsername = (e) => this.setState({username: e.target.value})

        this.showLogin = this.showLogin.bind(this)
        this.onSubmit = this.onSubmit.bind(this)

        this.state = {
            success: false,
            username: ""
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

        this.props.mutate({
            variables: {
                input: {
                    clientMutationId: 1,
                    username: this.state.username
                }
            }
        }).then(({data}) => {
            this.setState({
                success: true,
                username: ""
            })
        }).catch((errors) => {
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
                <form className="form login" onSubmit={this.onSubmit}>
                    <label className="form__label">Gebruikersnaam of e-mail</label>
                    <input type="text" placeholder="Gebruikersnaam of e-mail" className="form__input" value={this.state.username} onChange={this.changeUsername} />
                    <div className="form__actions ___end">
                        <button className="button ___block ___large ___primary">
                            Aanvragen
                        </button>
                    </div>
                </form>
            )
        } else {
            body = (
                <form className="form">
                    <p>Binnen enkele minuten ontvang je een e-mail met een link naar een unieke verificatiepagina. Klik op de link in het bericht en een nieuw wachtwoord zal naar je worden opgestuurd</p>
                    <div className="form__actions ___end ___margin-top">
                        <div className="button__underline" onClick={this.showLogin}>
                            Terug naar inloggen
                        </div>
                    </div>
                </form>
            )
        }

        return (
            <Modal ref="modal" id="forgotPassword" title="Wachtwoord vergeten?" steps={[1,2]} small={true}>
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
