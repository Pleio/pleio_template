import React from "react"
import classNames from "classnames"
import { withRouter } from "react-router-dom"

let now = new Date().getTime()

class Modal extends React.Component {
    constructor(props) {
        super(props)

        this.onClose = this.onClose.bind(this)

        this.state = {
            isOpen: false
        }
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }

    onClose(e) {
        const { history } = this.props

        if (e) {
            e.preventDefault()
        }

        if (this.props.onClose) {
            this.props.onClose()
        } else {
            if (this.props.noParent) {
                history.goBack()
            } else {
                this.toggle()
            }
        }
    }

    render() {
        let steps, title, modal
        if (this.props.steps) {
            steps = (
                <span>
                    {this.props.steps[0]}/{this.props.steps[1]}
                </span>
            )
        }

        if (this.props.title) {
            title = (
                <h3 className="modal__title">
                    {this.props.title}
                    &nbsp;{steps}
                </h3>
            )
        }

        if (this.props.small) {
            modal = (
                <div className="modal__wrapper">
                    <div className="modal__background" onClick={this.onClose} />
                    <div className="modal__box">
                        {title}
                        {this.props.children}
                    </div>
                </div>
            )
        } else if (this.props.full) {
            modal = (
                <div className="modal__wrapper">
                    <div className="modal__box">
                        <div className="container relative">
                            {title}
                        </div>
                        {this.props.children}
                    </div>
                </div>
            )
        } else {
            modal = (
                <div className="modal__wrapper">
                    <div className="modal__background" onClick={this.onClose} />
                    <div className="modal__box">
                        {title}
                        {this.props.children}
                    </div>
                </div>
            )
        }

        return (
            <div id={this.props.id} ref="modal" tabIndex="0" className={classNames({"modal":true, "___full":this.props.full, "___blue":this.props.isBlue, "___small": this.props.small, "___is-open": this.state.isOpen || this.props.noParent })}>
                <div className="modal__close" onClick={this.onClose} />
                {modal}
            </div>
        )
    }
}

export default Modal