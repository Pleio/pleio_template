import React from "react"
import ReactDOM from "react-dom"
import { graphql } from "react-apollo"
import { withRouter } from "react-router-dom"
import gql from "graphql-tag"
import Errors from "./components/Errors"
import { logErrors } from "../lib/helpers"
import Modal from "./components/Modal"
import Form from "./components/Form"
import { Link } from "react-router-dom"
import InputField from "./components/InputField"
import CheckField from "./components/CheckField"

class Login extends React.Component {
    constructor(props) {
        super(props)

        this.onSubmit = this.onSubmit.bind(this)

        this.state = {
            errors: null
        }
    }

    onSubmit(e) {
        const { location } = this.props

        this.setState({
            errors: null
        })

        let values = this.refs.form.getValues()

        this.props.mutate({
            variables: {
                input: {
                    clientMutationId: 1,
                    username: values.username,
                    password: values.password,
                    rememberMe: values.rememberMe
                }
            }
        }).then(({data}) => {
            if (data.login.viewer.loggedIn === true) {
                if (location.state && location.state.next) {
                    window.location.href = location.state.next
                } else {
                    window.location.href = "/"
                }
            }
        }).catch((errors) => {
            logErrors(errors)
            this.setState({
                errors: errors
            })
        })

    }

    render() {
        const { data, location } = this.props
        const { site } = this.props.data

        let title, errors

        if (window.__SETTINGS__['externalLogin']) {
            if (location.state.next) {
                window.location.href = `/login?returnto=${location.state.next}`
            } else {
                window.location.href = "/login"
            }

            return (
                <div className="please-wait__container">
                    <div className="please-wait__text">
                        Een ogenblik geduld...
                    </div>
                </div>
            )
        }

        if (data.loading) {
            return (
                <div />
            )
        }

        if (site) {
            title = `Welkom op ${site.name}`
        } else {
            title = "Welkom"
        }

        if (this.state.errors) {
            errors = ( <Errors errors={this.state.errors} /> );
        }

        let registerButton = (
            <Link to="/register" className="form__link ___block-mobile">
                Registreren
            </Link>
        )

        let message
        if (location.state && location.state.fromComment) {
            message = (
                <p>Om te reageren, dien je ingelogd te zijn op je persoonlijke profiel.</p>
            )
            registerButton = (
                <Link to="/register" className="form__link ___block-mobile">
                    Nog geen profiel? Registreer je hier!
                </Link>
            )
        }

        return (
            <Modal ref="modal" id="login" title={title} small={true} isBlue={true} noParent={true} history={this.props.history}>
                {message}
                {errors}
                <Form ref="form" className="form login" onSubmit={this.onSubmit}>
                    <InputField name="username" type="text" placeholder="E-mailadres" className="form__input" rules="required" />
                    <InputField name="password" type="password" placeholder="Wachtwoord" className="form__input" rules="required" />

                    <CheckField name="rememberMe" label="Onthoud mij" checked />

                    <button className="button ___block ___large ___primary" type="submit">
                        Inloggen
                    </button>

                    <div className="buttons ___vertical-mobile">
                        {registerButton}
                        <Link to="/forgotpassword" className="form__link ___block-mobile">
                            Wachtwoord vergeten?
                        </Link>
                    </div>
                </Form>
            </Modal>
        )
    }

    renderHelpText(message) {
        return (
            <span className="help-block">{message}</span>
        )
    }
}

const Query = gql`
    query Login {
        site {
            guid
            name
        }
    }
`

const Mutation = gql`
    mutation Login($input: loginInput!) {
        login(input: $input) {
            viewer {
                guid
                loggedIn
                user {
                    guid
                    name
                    username
                }
            }
        }
    }
`
export default graphql(Query)(graphql(Mutation)(withRouter(Login)))