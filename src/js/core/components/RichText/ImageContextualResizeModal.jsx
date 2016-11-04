import React from "react"
import classnames from "classnames"

export default class ImageContextualResizeModal extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isOpen: false,
            width: this.props.width || 200,
            height: this.props.height || 200
        }

        this.toggle = (e) => this.setState({isOpen: !this.state.isOpen})
        this.changeWidth = (e) => this.setState({width: e.target.value})
        this.changeHeight = (e) => this.setState({height: e.target.value})
        this.onSubmit = this.onSubmit.bind(this)
        this.onClose = this.onClose.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.width !== this.props.width || nextProps.height !== this.props.height) {
            this.setState({
                width: nextProps.width,
                height: nextProps.height
            })
        }
    }

    onSubmit(e) {
        this.toggle()

        if (this.props.onSubmit) {
            this.props.onSubmit(this.state.width, this.state.height)
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
                                <h3 className="modal__title">Grootte</h3>
                                <div className="form">
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="form__item">
                                                <input type="text" placeholder="Breedte" onChange={this.changeWidth} value={this.state.width} />
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form__item">
                                                <input type="text" placeholder="Hoogte" onChange={this.changeHeight} value={this.state.height} />
                                            </div>
                                        </div>
                                    </div>
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