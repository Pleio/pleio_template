import React from "react"
import ReactDOM from "react-dom"
import { graphql } from "react-apollo"
import { Link } from "react-router-dom"
import gql from "graphql-tag"
import Errors from "./components/Errors"
import { logErrors } from "../lib/helpers"
import Modal from "./components/Modal"
import Form from "./components/Form"
import InputField from "./components/InputField"
import SelectField from "./components/SelectField"
import SwitchesField from "./components/SwitchesField"
import CheckField from "./components/CheckField"
import ModalWithSlides from "./components/ModalWithSlides"
import ContentFiltersInputField from "./components/ContentFiltersInputField"

class SlideOne extends React.Component {
    constructor(props) {
        super(props)

        this.getForm = () => this.refs.form
        this.onSubmit = this.onSubmit.bind(this)

        this.state = {
            errors: []
        }
    }

    onSubmit(e) {
        const values = this.refs.form.getValues()
        if (values.password === values.passwordAgain) {
            this.props.nextSlide()
        } else {
            this.setState({
                errors: { message: "passwords_not_the_same" }
            })
        }
    }

    render() {
        return (
            <div>
                <p className="___small">Registreren is niet noodzakelijk indien je al een Pleio account hebt.</p>
                <Form ref="form" className="form login" onSubmit={this.onSubmit}>
                    <Errors errors={this.state.errors} />
                    <InputField type="text" name="name" label="Voor- en achternaam" placeholder="Voor- en achternaam" className="form__input" rules="required" autofocus />
                    <InputField type="text" name="email" label="E-mailadres" placeholder="E-mailadres" className="form__input" rules="required|email" />
                    <InputField type="password" name="password" label="Wachtwoord" placeholder="Minimaal 8 karakters" className="form__input" rules="required|min:8" />
                    <InputField type="password" name="passwordAgain" label="Wachtwoord verificatie" placeholder="Vul je wachtwoord nogmaals in" className="form__input" rules="required|min:8" />

                    <div className="buttons ___space-between ___margin-top">
                        <Link to="/login" className="form__link">Inloggen</Link>
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
        if (this.props.success) {
            return (
                <div>
                    We hebben een unieke activatielink naar jouw e-mailadres gestuurd. Volg deze activatielink om direct in te loggen.
                </div>
            )
        }

        let newsletter
        if (window.__SETTINGS__['newsletter']) {
            newsletter = (
                <CheckField id="newsletter" name="newsletter" type="checkbox" label="Ik wil de nieuwsbrief ontvangen" />
            )
        }

        return (
            <Form ref="form" className="form login" onSubmit={this.props.onRegister}>
                <Errors errors={this.props.errors} />
                <ContentFiltersInputField name="filters" label="Vul hier je interesses in" />
                <div className="form__conditions">
                    <CheckField id="terms" name="terms" type="checkbox" label="Ik ga akkoord met de Algemene Voorwaarden*" rules="required" />
                    {newsletter}
                </div>
                <div className="buttons ___margin-top ___end ___gutter">
                    <div href="#" onClick={() => this.props.previousSlide()} className="button__underline">Vorige</div>
                    <button className="button ___primary" type="submit">Registreer</button>
                </div>
            </Form>
        )
    }
}

class Register extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            errors: [],
            success: false
        }

        this.onRegister = this.onRegister.bind(this)
    }

    onRegister(e) {
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
                    tags: values.filters
                }
            }
        }).then(({data}) => {
            this.setState({
                success: true
            })
        }).catch((errors) => {
            logErrors(errors)
            this.setState({
                errors: errors
            })
        })
    }

    render() {
        const { data } = this.props

        if (window.__SETTINGS__['externalLogin']) {
            window.location.href = "/register"

            return (
                <div />
            )
        }

        if (data.loading) {
            return (
                <div />
            )
        }

        return (
            <ModalWithSlides id="register" title="Registreren" steps={[1,2]} small={true} isBlue={true} noParent={true} history={this.props.history}>
                <SlideOne ref="slideOne" />
                <SlideTwo ref="slideTwo" onRegister={this.onRegister} errors={this.state.errors} success={this.state.success} />
            </ModalWithSlides>
        )
    }
}

const Query = gql`
    query Register {
        site {
            guid
            name
        }
    }
`

const Mutation = gql`
    mutation register($input: registerInput!) {
        register(input: $input) {
            viewer {
                guid
                loggedIn
            }
        }
    }
`

export default graphql(Mutation)(graphql(Query)(Register))
