import React from "react"
import classnames from "classnames"

export default class LinkModal extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isOpen: false,
            url: "",
            isTargetBlank: false
        }

        this.toggle = () => this.setState({ isOpen: !this.state.isOpen })
        this.changeUrl = (e) => this.setState({ url: e.target.value })
        this.changeTarget = (e) => this.setState({ isTargetBlank: !this.state.isTargetBlank })
        this.onKeyPress = this.onKeyPress.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    onKeyPress(e) {
        const keyCode = e.keyCode ? e.keyCode : e.which
        if (keyCode !== 13) { // Enter button
            return;
        }

        e.preventDefault()
        this.onSubmit(e)
    }

    onSubmit(e) {
        this.toggle()

        this.setState({
            url: "",
            isTargetBlank: false
        })

        if (this.props.onSubmit) {
            this.props.onSubmit(this.state.url, this.state.isTargetBlank)
        }
    }

    render() {
        return (
            <div tabIndex="0" ref="hyperlink-modal" className={classnames({"modal ___small ___middle": true, "___is-open": this.state.isOpen})}>
                <div className="modal__wrapper">
                    <div className="modal__background"></div>
                    <div className="modal__box">
                        <div className="modal__close" onClick={this.toggle}></div>
                        <h3 className="modal__title">
                            Hyperlink toevoegen
                        </h3>
                        <div className="form">
                            <label className="form__item">
                                <input type="text" name="url" placeholder="Url" onKeyPress={this.onKeyPress} onChange={this.changeUrl} value={this.state.url} />
                            </label>
                            <div className="checkbox" onClick={this.changeTarget}>
                                <input readOnly name="condition-hyperlink" type="checkbox" checked={this.state.isTargetBlank} />
                                <label htmlFor="condition-hyperlink">Openen in nieuw tabblad</label>
                            </div>
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

