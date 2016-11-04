import React from "react"
import classnames from "classnames"

export default class ImageContextualInfoModal extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isOpen: false,
            text: this.props.text || ""
        }

        this.toggle = (e) => this.setState({isOpen: !this.state.isOpen})
        this.changeText = (e) => this.setState({text: e.target.value})
        this.onSubmit = this.onSubmit.bind(this)
        this.onClose = this.onClose.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.text !== this.props.text) {
            this.setState({
                text: nextProps.text
            })
        }
    }

    onSubmit(e) {
        this.toggle()

        if (this.props.onSubmit) {
            this.props.onSubmit(this.state.text)
        }
    }

    onClose(e) {
        this.toggle()

        if (this.props.onClose) {
            this.props.onClose()
        }
    }

    render() {
        return (
            <div tabIndex="0" className={classnames({"modal ___small ___middle": true, "___is-open": this.state.isOpen})}>
                <div className="modal__wrapper">
                    <div data-modal-toggle="#editor-image-text" className="modal__background"></div>
                        <div className="modal__box">
                            <div className="modal__close" onClick={this.onClose}></div>
                                <h3 className="modal__title">Alternatieve tekst</h3>
                                <div className="form">
                                    <label className="form__item">
                                        <input type="text" placeholder="Omschrijving van afbeelding" onChange={this.changeText} value={this.state.text} />
                                    </label>
                                    <div className="buttons ___end">
                                        <div className="button" onClick={this.onSubmit}>Bijwerken</div>
                                    </div>
                                </div>
                        </div>
                </div>
            </div>
        )
    }
}