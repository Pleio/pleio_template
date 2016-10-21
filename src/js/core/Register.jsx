import React from "react"
import ReactDOM from "react-dom"
import { connect } from "react-redux"
import { showModal, hideModal } from "../lib/actions"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Errors from "./components/Errors"
import client from "../lib/client"
import Modal from "./components/Modal"
import Form from "./components/Form"
import InputField from "./components/InputField"

class Register extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            errors: null,
            success: false,
            step: 1
        }

        this.gotoStep = (number) => (this.setState({step: number}))

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
                    <Form className="form login" onSubmit={(e) => {e.preventDefault(); this.gotoStep(2)}}>
                        <InputField type="text" name="name" placeholder="Voor- en achternaam" className="form__input" value={this.state.name} rules="required" autofocus />
                        <InputField type="text" name="email" placeholder="E-mailadres" className="form__input" value={this.state.email} rules="required|email" />
                        <InputField type="password" name="password" placeholder="Minimaal 8 karakters" className="form__input" value={this.state.password} rules="required|min:8" />
                        <InputField type="password" name="passwordAgain" placeholder="Vul je wachtwoord nogmaals in" className="form__input" value={this.state.passwordAgain} rules="required|min:8" />

                        <div className="form__actions ___space-between">
                            <a href="#" onClick={this.showLogin} className="form__link">Inloggen</a>
                            <button className="button" type="submit">Volgende</button>
                        </div>
                    </Form>
                </div>
            )
        } else {
            content = (
                <Form className="form login" onSubmit={this.onRegister}>
                    <div className="form__conditions">
                        <div className="checkbox">
                            <InputField id="condition-1" name="terms" type="checkbox" rules="required" />
                            <label htmlFor="condition-1">Ik ga akkoord met de Algemene Voorwaarden</label>
                        </div>
                        <div className="checkbox">
                            <InputField id="condition-2" name="condition-2" type="checkbox" />
                            <label htmlFor="condition-2">Ik wil de nieuwsbrief ontvangen</label>
                        </div>
                    </div>
                    <div className="form__actions ___end">
                        <div href="#" onClick={() => this.gotoStep(1)} className="button__underline">Vorige</div>
                        <button className="button ___primary" type="submit">Registreer</button>
                    </div>
                </Form>
            )
        }


        return (
            <Modal id="register" title="Registreren" steps={[1,2]} small={true} isBlue={true}>
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
            }
        }
    }
`
const withRegister = graphql(REGISTER)
export default connect()(withRegister(Register))