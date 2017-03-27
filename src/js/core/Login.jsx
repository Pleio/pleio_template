import React from "react"
import ReactDOM from "react-dom"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Errors from "./components/Errors"
import client from "../lib/client"
import { logErrors } from "../lib/helpers"
import Modal from "./components/Modal"
import Form from "./components/Form"
import { Link } from "react-router"
import InputField from "./components/InputField"
import { showModal, hideModal } from "../lib/actions"

class Login extends React.Component {
    constructor(props) {
        super(props)

        this.onSubmit = this.onSubmit.bind(this)

        this.state = {
            errors: null
        }
    }

    onSubmit(e) {
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
                    rememberMe: false
                }
            }
        }).then(({data}) => {
            if (data.login.viewer.loggedIn === true) {
                window.location.href = '/'
            }
        }).catch((errors) => {
            logErrors(errors)
            this.setState({
                errors: errors
            })
        })

    }

    render() {
        const { site } = this.props.data
        let title, errors

        if (site) {
            title = `Welkom op ${site.name}`
        } else {
            title = "Welkom"
        }

        if (this.state.errors) {
            errors = ( <Errors errors={this.state.errors} /> );
        }

        return (
            <Modal ref="modal" id="login" title={title} small={true} isBlue={true} noParent={true}>
                {errors}
                <Form ref="form" className="form login" onSubmit={this.onSubmit}>
                    <InputField name="username" type="text" placeholder="E-mailadres" className="form__input" rules="required" />
                    <InputField name="password" type="password" placeholder="Wachtwoord" className="form__input" rules="required" />

                    <button className="button ___block ___large ___primary" type="submit">
                        Inloggen
                    </button>

                    <div className="buttons ___vertical-mobile">
                        <Link to="/register" className="form__link ___block-mobile">
                            Registreren
                        </Link>
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
export default graphql(Query)(graphql(Mutation)(Login))