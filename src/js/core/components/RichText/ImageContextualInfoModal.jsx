import React from "react"
import classnames from "classnames"

export default class ImageContextualInfoModal extends React.Component {
    constructor(props) {
        super(props)

        const { data } = this.props

        this.state = {
            isOpen: false,
            alt: data.alt || ""
        }

        this.toggle = (e) => this.setState({isOpen: !this.state.isOpen})
        this.changeAlt = (e) => this.setState({alt: e.target.value})
        this.onKeyPress = this.onKeyPress.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.onClose = this.onClose.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data) {
            this.setState({
                alt: nextProps.data.alt
            })
        }
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

        if (this.props.onSubmit) {
            this.props.onSubmit(this.state.alt)
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
                                        <input type="text" name="alt" placeholder="Omschrijving van afbeelding" onKeyPress={this.onKeyPress} onChange={this.changeAlt} value={this.state.alt} />
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