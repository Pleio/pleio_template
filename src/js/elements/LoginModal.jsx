import React from "react"
import ReactDOM from "react-dom"
import { connect } from "react-redux"
import { hideModal } from "../lib/actions"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Errors from "./Errors"
import classNames from "classnames"

const MODAL_NAME = "login"

class LoginModal extends React.Component {
    constructor(props) {
        super(props)

        this.onChangeUsername = this.onChangeUsername.bind(this)
        this.onChangePassword = this.onChangePassword.bind(this)
        this.onClose = this.onClose.bind(this)
        this.onLogin = this.onLogin.bind(this)

        this.state = {
            username: "",
            password: "",
            errors: null
        }
    }

    onClose(e) {
        if (e) {
            e.preventDefault()
        }

        this.props.dispatch(hideModal())
    }

    componentDidUpdate(prevProps) {
        if (this.props.modal == MODAL_NAME && prevProps.modal !== this.props.modal) {
            setTimeout(() => {
                this.refs['username'].focus()
            }, 100)
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
                this.onClose()
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
            <div id="login" tabIndex="0" className={classNames({"modal ___small": true, "___is-open": this.props.modal == MODAL_NAME})}>
                <div className="modal__wrapper">
                    <div data-modal-toggle="#login" className="modal__background" />
                    <div data-modal-toggle="#login" className="modal__close" onClick={this.onClose} />
                    <div className="modal__box">
                        {errors}
                        <h3 className="modal__title">Welkom op Leraar.nl</h3>
                        <form className="form login" onSubmit={this.onLogin}>
                            <input name="username" ref="username" type="text" placeholder="E-mailadres" className="form__input" onChange={this.onChangeUsername} />
                            <input type="password" placeholder="Wachtwoord" className="form__input" onChange={this.onChangePassword} />
                            <button className="button ___block ___large ___primary">Inloggen</button>
                            <div className="form__actions"><a href="#" data-modal-toggle="#register" className="form__link ___block-mobile">Registreren</a><a href="#" data-modal-toggle="#forgot-password" className="form__link ___block-mobile">Wachtwoord vergeten?</a></div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

const stateToProps = (state) => {
    return {
        modal: state.modal
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
export default connect(stateToProps)(withLogin(LoginModal))