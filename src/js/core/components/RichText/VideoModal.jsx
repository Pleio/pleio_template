import React from "react"
import classnames from "classnames"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import AddImage from "./AddImage"

export default class VideoModal extends React.Component {
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
        const regex = /youtube.com\/watch\?v=([a-zA-Z0-9]*)/.exec(this.state.url)

        if (!regex) {
            this.setState({
                hasError: true
            })

            return
        }

        this.props.onSubmit("VIDEO", {
            platform: "youtube",
            guid: regex[1]
        })

        this.setState({
            url: "",
            hasError: false,
            isOpen: false
        })
    }

    render() {
        return (
            <div tabIndex="0" className={classnames({"modal ___small ___middle": true, "___is-open": this.state.isOpen})}>
                <div className="modal__wrapper">
                    <div className="modal__background" onClick={this.toggle}></div>
                    <div className="modal__box">
                        <div className="modal__close" onClick={this.toggle}></div>
                        <h3 className="modal__title">Video invoegen</h3>
                        <p>Plaats hieronder de link van de Youtube video die je wilt toevoegen.</p>
                        <div className="form">
                            <input type="text" ref="url" placeholder="Link"  onKeyPress={this.onKeyPress} onChange={this.onChangeUrl} value={this.state.url} />
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