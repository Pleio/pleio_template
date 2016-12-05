import React from "react"
import classnames from "classnames"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import AddImage from "./AddImage"

export default class MediaModal extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isOpen: false,
            tab: "upload",
            url: ""
        }

        this.onChangeUrl = (e) => this.setState({ url: e.target.value })
        this.toggle = () => this.setState({ isOpen: !this.state.isOpen })
        this.toggleTab = (tab) => this.setState({tab})
        this.onAddImage = this.onAddImage.bind(this)
        this.onAddUrl = this.onAddUrl.bind(this)
    }

    onAddImage(url) {
        if (this.props.onSubmit) {
            this.props.onSubmit(url, 200);
        }

        this.toggle()
    }

    onAddUrl(e) {
        if (this.props.onSubmit) {
            this.props.onSubmit(this.state.url, 200);
        }

        this.setState({
            url: "",
            isOpen: false
        })
    }

    render() {
        return (
            <div tabIndex="0" className={classnames({"modal ___small ___middle": true, "___is-open": this.state.isOpen})}>
                <div className="modal__wrapper">
                    <div className="modal__background"></div>
                    <div className="modal__box">
                        <div className="modal__close" onClick={this.toggle}></div>
                        <h3 className="modal__title">Media invoegen</h3>
                        <div className="form">
                            <div className="mini-tabmenu">
                                <div className="mini-tabmenu__tabs">
                                    <div className={classnames({"mini-tabmenu__tab ___upload": true, "___is-active": (this.state.tab === "upload")})} onClick={() => this.toggleTab("upload")} />
                                    <div className={classnames({"mini-tabmenu__tab ___hyperlink": true, "___is-active": (this.state.tab === "link")})} onClick={() => this.toggleTab("link")} />
                                </div>
                                <div data-tab-slides="2" className={classnames({"mini-tabmenu__slides": true, " ___slide-2": (this.state.tab === "link")})}>
                                    <div className="mini-tabmenu__slide">
                                        <AddImage onSubmit={this.onAddImage} />
                                    </div>
                                    <div className="mini-tabmenu__slide">
                                        <label className="form__item">
                                            <input type="text" ref="url" placeholder="Link" onChange={this.onChangeUrl} value={this.state.url} />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="buttons ___end">
                                <div className="button" onClick={this.onAddUrl}>
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