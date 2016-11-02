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
import SelectField from "./components/SelectField"
import SwitchesField from "./components/SwitchesField"
import CheckField from "./components/CheckField"
import ModalWithSlides from "./components/ModalWithSlides"
import { sectorOptions, categoryOptions } from "../lib/filters"

class SlideOne extends React.Component {
    constructor(props) {
        super(props)
        this.getForm = () => this.refs.form
    }

    render() {
        return (
            <div>
                <p className="___small">Registreren is niet noodzakelijk indien je al een Pleio account hebt.</p>
                <Form ref="form" className="form login" onSubmit={(e) => {e.preventDefault(); this.props.nextSlide()}}>
                    <InputField type="text" name="name" placeholder="Voor- en achternaam" className="form__input" rules="required" autofocus />
                    <InputField type="text" name="email" placeholder="E-mailadres" className="form__input" rules="required|email" />
                    <InputField type="password" name="password" placeholder="Minimaal 8 karakters" className="form__input" rules="required|min:8" />
                    <InputField type="password" name="passwordAgain" placeholder="Vul je wachtwoord nogmaals in" className="form__input" rules="required|min:8" />

                    <div className="buttons ___space-between ___margin-top">
                        <a href="#" onClick={this.props.showLogin} className="form__link">Inloggen</a>
                        <button className="button" type="submit">Volgende</button>
                    </div>
                </Form>
            </div>
        )
    }
}

class SlideTwo extends React.Component {
    constructor(props) {
        super(props)
        this.getForm = () => this.refs.form
    }

    render() {
        if (!this.props.success) {
            return (
                <Form ref="form" className="form login" onSubmit={this.props.onRegister}>
                    <Errors errors={this.props.errors} />
                    <SelectField name="sector" label="Je onderwijssector" options={sectorOptions} rules="required" placeholder="Maak een keuze" />
                    <SwitchesField name="category" label="Je interesses" options={categoryOptions} />
                    <div className="form__conditions">
                        <CheckField id="terms" name="terms" type="checkbox" label="Ik ga akkoord met de Algemene Voorwaarden*" rules="required" />
                        <CheckField id="newsletter" name="newsletter" type="checkbox" label="Ik wil de nieuwsbrief ontvangen" />
                    </div>
                    <div className="buttons ___margin-top ___end ___gutter">
                        <div href="#" onClick={() => this.props.previousSlide()} className="button__underline">Vorige</div>
                        <button className="button ___primary" type="submit">Registreer</button>
                    </div>
                </Form>
            )
        } else {
            return (
                <div>
                    We hebben een unieke activatielink naar jouw e-mailadres gestuurd. Volg deze activatielink om direct in te loggen.
                </div>
            )
        }
    }
}

class Register extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            errors: [],
            success: false
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
            errors: []
        })

        const values = Object.assign(
            {},
            this.refs.slideOne.getForm().getValues(),
            this.refs.slideTwo.getForm().getValues()
        )

        this.props.mutate({
            variables: {
                input: {
                    clientMutationId: 1,
                    name: values.name,
                    email: values.email,
                    password: values.password,
                    newsletter: values.newsletter,
                    terms: values.terms,
                    tags: [ ...values.category, values.sector ]
                }
            }
        }).then(({data}) => {
            this.setState({
                success: true
            })

            this.refs.slideOne.getForm().clearValues()
            this.refs.slideTwo.getForm().clearValues()
        }).catch((errors) => {
            this.setState({
                errors: errors
            })
        })
    }

    render() {
        let content = ""

        return (
            <ModalWithSlides id="register" title="Registreren" steps={[1,2]} small={true} isBlue={true}>
                <SlideOne ref="slideOne" showLogin={this.showLogin} />
                <SlideTwo ref="slideTwo" onRegister={this.onRegister} errors={this.state.errors} success={this.state.success} />
            </ModalWithSlides>
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