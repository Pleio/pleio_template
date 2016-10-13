import React from 'react'
import ContentHeader from "./components/ContentHeader"
import Modal from "./components/Modal"
import { getQueryVariable } from "../lib/helpers"
import Errors from "./components/Errors"
import { graphql } from "react-apollo"
import { connect } from "react-redux"
import gql from "graphql-tag"
import { showModal } from "../lib/actions"
import { browserHistory } from "react-router"

class ForgotPasswordConfirm extends React.Component {
    constructor(props) {
        super(props)

        this.onSubmit = this.onSubmit.bind(this)
        this.showLogin = this.showLogin.bind(this)

        this.state = {
            success: false,
            showMe: true
        }
    }

    showLogin(e) {
        e.preventDefault()

        this.setState({
            success: false,
            showMe: false
        })

        this.props.dispatch(showModal("login"))
    }

    onSubmit(e) {
        e.preventDefault()

        this.props.mutate({
            variables: {
                input: {
                    clientMutationId: 1,
                    userGuid: getQueryVariable("u"),
                    code: getQueryVariable("c")
                }
            }
        }).then(({data}) => {
            this.setState({
                success: true
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
                    <p>Klik op de knop om een nieuw wachtwoord per e-mail toegestuurd te krijgen.</p>
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
                    <p>Binnen enkele minuten ontvang je een e-mail met je nieuwe wachtwoord.</p>
                    <div className="form__actions ___end ___margin-top">
                        <div className="button__underline" onClick={this.showLogin}>
                            Terug naar inloggen
                        </div>
                    </div>
                </form>
            )
        }

        return (
            <Modal id="register" title="Wachtwoord vergeten?" steps={[2,2]} small={true} noParent={this.state.showMe}>
                {errors}
                {body}
            </Modal>
        )
    }
}


const Query = gql`
    mutation forgotPasswordConfirm($input: forgotPasswordConfirmInput!) {
        forgotPasswordConfirm(input: $input) {
            status
        }
    }
`
const withQuery = graphql(Query)
export default connect()(withQuery(ForgotPasswordConfirm))
