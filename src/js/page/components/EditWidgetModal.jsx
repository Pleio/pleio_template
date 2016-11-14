import React from "react"
import classnames from "classnames"

export default class EditWidgetModal extends React.Component {
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
            <div tabIndex="0" className={classnames({"modal ___small ___middle": true, "___is-open": this.state.isOpen})}>
                <div className="modal__wrapper">
                    <div className="modal__background"></div>
                    <div className="modal__box">
                        <div className="modal__close" onClick={this.toggle}></div>
                        <h3 className="modal__title">
                            Widget wijzigen
                        </h3>
                        {this.props.children}
                        <div className="buttons ___space-between">
                                <button className="button ___link" onClick={this.props.toggleDelete}>
                                    Verwijderen
                                </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

