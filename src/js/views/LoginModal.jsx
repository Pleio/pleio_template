import React from "react"
import ReactDOM from "react-dom"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Errors from "../components/Errors"
import client from "../lib/client"
import Modal from "../components/Modal"
import { connect } from "react-redux"
import { showModal, hideModal } from "../lib/actions"

class LoginModal extends React.Component {
    constructor(props) {
        super(props)

        this.onChangeUsername = this.onChangeUsername.bind(this)
        this.onChangePassword = this.onChangePassword.bind(this)

        this.showRegister = this.showRegister.bind(this)
        this.showForgotPassword = this.showForgotPassword.bind(this)
        this.onLogin = this.onLogin.bind(this)

        this.state = {
            username: "",
            password: "",
            errors: null
        }
    }

    onChangeUsername(e) {
        this.setState({
            username: e.target.value
        })
    }

    onChangePassword(e) {
        this.setState({
            password: e.target.value
        })
    }

    showRegister(e) {
        e.preventDefault()
        this.props.dispatch(showModal("register"))
    }

    showForgotPassword(e) {
        e.preventDefault()
        this.props.dispatch(showModal("forgotPassword"))
    }

    onLogin(e) {
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
            if (data.login.viewer.loggedIn === true) {
                client.resetStore()
                this.props.dispatch(hideModal())
            }
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

        return (
            <Modal ref="modal" id="login" title="Welkom op Leraar.nl" small={true}>
                {errors}
                <form className="form login" onSubmit={this.onLogin}>
                    <input name="username" type="text" placeholder="E-mailadres" className="form__input" onChange={this.onChangeUsername} />
                    <input type="password" placeholder="Wachtwoord" className="form__input" onChange={this.onChangePassword} />
                    <button className="button ___block ___large ___primary">Inloggen</button>
                    <div className="form__actions">
                        <a href="#" onClick={this.showRegister} className="form__link ___block-mobile">
                            Registreren
                        </a>
                        <a href="#" onClick={this.showForgotPassword} className="form__link ___block-mobile">
                            Wachtwoord vergeten?
                        </a>
                    </div>
                </form>
            </Modal>
        )
    }
}

const LOGIN = gql`
    mutation login($input: loginInput!) {
        login(input: $input) {
            viewer {
                id
                loggedIn
                name
                username
            }
        }
    }
`
const withLogin = graphql(LOGIN)
export default connect()(withLogin(LoginModal))