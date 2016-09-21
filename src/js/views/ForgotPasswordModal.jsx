import React from "react"
import Modal from "../components/Modal"
import { connect } from "react-redux"
import { showModal } from "../lib/actions"

class ForgotPasswordModal extends React.Component {

    constructor(props) {
        super(props)

        this.showLogin = this.showLogin.bind(this)
        this.onSubmit = this.onSubmit.bind(this)

        this.state = {
            success: false
        }
    }

    showLogin(e) {
        e.preventDefault()
        this.props.dispatch(showModal("login"))
    }

    onSubmit(e) {
        e.preventDefault()
        this.setState({
            success: true
        })
    }

    render() {
        let body = ""
        if (!this.state.success) {
            body = (
                <form className="form login" onSubmit={this.onSubmit}>
                    <label className="form__label">Gebruikersnaam of e-mail</label>
                    <input type="text" placeholder="Gebruikersnaam of e-mail" className="form__input" />
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
                    <p>Binnen enkele minuten ontvang je een e-mail met een link naar een unieke verificatiepagina. Klik op de link in het bericht en een nieuw wachtwoord zal naar je worden opgestuurd</p>
                    <div className="form__actions ___end ___margin-top">
                        <div data-modal-toggle="#login" className="button__underline" onClick={this.showLogin}>
                            Terug naar inloggen
                        </div>
                    </div>
                </form>
            )
        }



        return (
            <Modal ref="modal" id="forgotPassword" title="Wachtwoord vergeten?" small={true}>
                {body}
            </Modal>
        )
    }
}

export default connect()(ForgotPasswordModal)