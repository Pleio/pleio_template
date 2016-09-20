import React from "react"
import ReactDOM from "react-dom"
import { connect } from "react-redux"
import { showModal } from "../lib/actions"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Errors from "../elements/Errors"
import client from "../lib/client"
import Modal from "../elements/Modal"

class RegisterModal extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            errors: null
        }

        this.showLogin = this.showLogin.bind(this)
        this.onRegister = this.onRegister.bind(this)
    }

    showLogin(e) {
        e.preventDefault()
        this.props.dispatch(showModal('login'))
    }

    onRegister(e) {
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
                this.onClose()
            }
        }).catch((errors) => {
            this.setState({
                errors: errors
            })
        })
    }

    render() {
        return (
            <Modal id="register" title="Registreren" steps={[1,2]}>
                <p className="___small">Registreren is niet noodzakelijk indien je al een Pleio account hebt.</p>
                <form className="form login">
                    <label className="form__item">
                        <div className="form__label">Voor- en achternaam*</div>
                        <input type="text" placeholder="Voor- en achternaam" className="form__input" />
                    </label>
                    <label className="form__item">
                        <div className="form__label">E-mailadres*</div>
                        <input type="email" placeholder="E-mailadres" className="form__input" />
                    </label>
                    <label className="form__item">
                        <div className="form__label">Wachtwoord*</div>
                        <input type="password" placeholder="Minimaal 6 karakters" className="form__input" />
                    </label>
                    <label className="form__item">
                        <div className="form__label">Wachtwoord verificatie*</div>
                        <input type="password" placeholder="Vul je wachtwoord nogmaals in" className="form__input" />
                    </label>
                    <div className="form__actions ___space-between"><a href="#" onClick={this.showLogin} className="form__link">Inloggen</a>
                        <button data-modal-toggle="#register-2" className="button">Volgende</button>
                    </div>
                </form>
            </Modal>
        )
    }
}

const REGISTER = gql`
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
const withRegister = graphql(REGISTER)
export default connect()(withRegister(RegisterModal))