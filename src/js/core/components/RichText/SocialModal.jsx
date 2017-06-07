import React from "react"
import classnames from "classnames"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import AddImage from "./AddImage"

const networks = [
    { name: "twitter", regex: /twitter.com\/.+?\/status\/([0-9].+)$/ },
    { name: "instagram", regex: /instagram.com\/p\/([a-zA-Z0-9].+)/ },
    { name: "facebook", regex: /facebook.com\/.+?\/posts\/([0-9].+)/ }
]

export default class SocialModal extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isOpen: false,
            hasError: false,
            url: ""
        }

        this.onKeyPress = this.onKeyPress.bind(this)
        this.onChangeUrl = (e) => this.setState({ url: e.target.value })
        this.toggle = () => this.setState({ isOpen: !this.state.isOpen })
        this.onSubmit = this.onSubmit.bind(this)
    }

    onKeyPress(e) {
        const keyCode = e.keyCode ? e.keyCode : e.which
        if (keyCode !== 13) { // Enter button
            return;
        }

        e.preventDefault()
        this.onSubmit()
    }

    onSubmit(e) {
        let match = false

        networks.forEach((network) => {
            const result = this.state.url.match(network.regex)
            if (result) {
                match = true
                this.props.onSubmit("SOCIAL", {
                    url: this.state.url
                })

                this.setState({
                    url: ""
                })

                this.toggle()
            }
        })

        if (!match) {
            this.setState({
                hasError: true
            })
        }
    }

    render() {
        let error
        if (this.state.hasError) {
            error = (
                <div className="form__error">Dit is geen geldige link</div>
            )
        }

        return (
            <div tabIndex="0" className={classnames({"modal ___small ___middle": true, "___is-open": this.state.isOpen})}>
                <div className="modal__wrapper">
                    <div className="modal__background"></div>
                    <div className="modal__box">
                        <div className="modal__close" onClick={this.toggle}></div>
                        <h3 className="modal__title">Social media post invoegen</h3>
                        <p>Plaats hieronder de link naar de social media post (Facebook, Twitter of Instagram).</p>
                        <div className="form">
                            <label className={classnames({"form__item": true, "___error": this.state.hasError})}>
                                <input className={classnames({"___error": this.state.hasError})} type="text" placeholder="Link" onKeyPress={this.onKeyPress} onChange={this.onChangeUrl} value={this.state.url} />
                                {error}
                            </label>
                            <div className="buttons ___end">
                                <div className="button" onClick={this.onSubmit}>
                                    Invoegen
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}