import React from "react"
import classnames from "classnames"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import AddImage from "./AddImage"

export default class SocialModal extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isOpen: false,
            code: ""
        }

        this.onKeyPress = this.onKeyPress.bind(this)
        this.onChangeCode = (e) => this.setState({ code: e.target.value })
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
        const regex = /instagram.com\/p\/(.*?)\//.exec(this.state.code)

        if (!regex) {
            // error
            return
        }

        this.props.onSubmit("SOCIAL", {
            platform: "instagram",
            guid: regex[1]
        })

        this.setState({
            code: ""
        })
        
        this.toggle()
    }

    render() {
        return (
            <div tabIndex="0" className={classnames({"modal ___small ___middle": true, "___is-open": this.state.isOpen})}>
                <div className="modal__wrapper">
                    <div className="modal__background"></div>
                    <div className="modal__box">
                        <div className="modal__close" onClick={this.toggle}></div>
                        <h3 className="modal__title">Social media post invoegen</h3>
                        <div className="form">
                            <textarea type="text" ref="code" placeholder="Code" onKeyPress={this.onKeyPress} onChange={this.onChangeCode} value={this.state.code} />
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