import React from "react"
import classnames from "classnames"

export default class ImageModal extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isOpen: false
        }

        this.toggle = () => this.setState({isOpen: !this.state.isOpen})
    }



    render() {
        return (
            <div tabIndex="0" className={classnames({"modal ___small ___middle": true, "___is-open": this.state.isOpen})}>
                <div className="modal__wrapper">
                    <div data-modal-toggle="#editor-image" className="modal__background"></div>
                    <div className="modal__box">
                        <div className="modal__close" onClick={this.toggle}></div>
                        <h3 className="modal__title">Afbeelding invoegen</h3>
                        <div className="form">
                            <div className="mini-tabmenu">
                            <div className="mini-tabmenu__tabs">
                            <div data-tab-slide="1" className="mini-tabmenu__tab ___upload ___is-active"></div>
                            <div data-tab-slide="2" className="mini-tabmenu__tab ___hyperlink"></div>
                            </div>
                            <div data-tab-slides="2" className="mini-tabmenu__slides">
                            <div className="mini-tabmenu__slide">
                            <div data-upload-image="" className="editor__upload"><span>+ Afbeelding uploaden</span>
                            <div className="editor__upload-progress">
                            <div className="editor__progress-bar"></div><span>70%</span>
                            </div>
                            </div>
                            </div>
                            <div className="mini-tabmenu__slide">
                            <label className="form__item">
                            <input type="text" placeholder="Url" />
                            </label>
                            </div>
                            </div>
                            </div>
                            <div className="buttons ___end">
                            <div data-modal-toggle="#editor-image" className="button">
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