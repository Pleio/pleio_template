import React from "react"
import ReactDOM from "react-dom"
import { connect } from "react-redux"
import { showModal, hideModal } from "../lib/actions"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Errors from "../components/Errors"
import client from "../lib/client"
import Modal from "../components/Modal"

class RegisterModal extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            errors: null,
            success: false,
            step: 1
        }

        this.gotoStep = (number) => (this.setState({step: number}))

        this.changeName = (e) => this.setState({name: e.target.value})
        this.changeEmail = (e) => this.setState({email: e.target.value})
        this.changePassword = (e) => this.setState({password: e.target.value})
        this.changePasswordAgain = (e) => this.setState({passwordAgain: e.target.value})
        this.changeTerms = (e) => this.setState({terms: e.checked})
        this.changeNewsletter = (e) => this.setState({newsletter: e.checked})

        this.showLogin = this.showLogin.bind(this)
        this.onRegister = this.onRegister.bind(this)
    }

    showLogin(e) {
        e.preventDefault()
        this.props.dispatch(showModal('login'))
    }

    gotoStep(number) {
        this.setState
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
                    name: this.state.name,
                    email: this.state.email,
                    password: this.state.password,
                    newsletter: this.state.newsletter,
                    terms: this.state.terms
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
        let content = ""

        if (this.state.success) {
            content = (
                <p className="___small">Controleer je e-mail voor de activatielink.</p>
            )
        }

        if (this.state.step == 1) {
            content = (
                <div>
                    <p className="___small">Registreren is niet noodzakelijk indien je al een Pleio account hebt.</p>
                    <form className="form login" onSubmit={(e) => {e.preventDefault(); this.gotoStep(2)}}>
                        <label className="form__item">
                            <div className="form__label">Voor- en achternaam*</div>
                            <input type="text" required placeholder="Voor- en achternaam" className="form__input" value={this.state.name} onChange={this.changeName} />
                        </label>
                        <label className="form__item">
                            <div className="form__label">E-mailadres*</div>
                            <input type="email" required placeholder="E-mailadres" className="form__input" value={this.state.email} onChange={this.changeEmail} />
                        </label>
                        <label className="form__item">
                            <div className="form__label">Wachtwoord*</div>
                            <input type="password" required placeholder="Minimaal 6 karakters" className="form__input" value={this.state.password} onChange={this.changePassword} />
                        </label>
                        <label className="form__item">
                            <div className="form__label">Wachtwoord verificatie*</div>
                            <input type="password" required placeholder="Vul je wachtwoord nogmaals in" className="form__input" value={this.state.passwordAgain} onChange={this.changePasswordAgain} />
                        </label>
                        <div className="form__actions ___space-between">
                            <a href="#" onClick={this.showLogin} className="form__link">Inloggen</a>
                            <button className="button" type="submit">Volgende</button>
                        </div>
                    </form>
                </div>
            )
        } else {
            content = (
                <form className="form login" onSubmit={this.onRegister}>
                    <div className="form__conditions">
                        <div className="checkbox">
                            <input id="condition-1" name="condition-1" type="checkbox" required value={this.state.terms} onChange={this.changeTerms} />
                            <label htmlFor="condition-1">Ik ga akkoord met de Algemene Voorwaarden</label>
                        </div>
                        <div className="checkbox">
                            <input id="condition-2" name="condition-2" type="checkbox" value={this.state.newsletter} onChange={this.changeNewsletter} />
                            <label htmlFor="condition-2">Ik wil de nieuwsbrief ontvangen</label>
                        </div>
                    </div>
                    <div className="form__actions ___end">
                        <div href="#" onClick={() => gotoStep(1)} className="button__underline">Vorige</div>
                        <button className="button ___primary" type="submit">Registreer</button>
                    </div>
                </form>
            )
        }


        return (
            <Modal id="register" title="Registreren" steps={[1,2]} small={true}>
                {content}
            </Modal>
        )
    }
}

const REGISTER = gql`
    mutation register($input: registerInput!) {
        register(input: $input) {
            viewer {
                guid
                loggedIn
                name
                username
            }
        }
    }
`
const withRegister = graphql(REGISTER)
export default connect()(withRegister(RegisterModal))