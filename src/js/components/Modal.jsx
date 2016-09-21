import React from "react"
import { connect } from "react-redux"
import classNames from "classnames"
import { hideModal } from "../lib/actions"

class Modal extends React.Component {

    constructor(props) {
        super(props)

        this.onClose = this.onClose.bind(this)
    }

    onClose(e) {
        if (e) {
            e.preventDefault()
        }

        this.props.dispatch(hideModal())
    }

    render() {
        let steps = ""
        if (this.props.steps) {
            steps = (
                <span>
                    {this.props.steps[0]}/{this.props.steps[1]}
                </span>
            )
        }

        let modal = ""
        if (this.props.small) {
            modal = (
                <div className="modal__wrapper">
                    <div className="modal__close" onClick={this.onClose} />
                    <div className="modal__background" />
                    <div className="modal__box">
                        <h3 className="modal__title">
                            {this.props.title}
                            &nbsp;{steps}
                        </h3>
                        {this.props.children}
                    </div>
                </div>
            )
        } else {
            modal = (
                <div className="modal__wrapper">
                    <div className="modal__background" />
                    <div className="modal__box">
                        <div className="modal__close" onClick={this.onClose} />
                        <h3 className="modal__title">
                            {this.props.title}
                            &nbsp;{steps}
                        </h3>
                        {this.props.children}
                    </div>
                </div>
            )
        }

        return (
            <div id={this.props.id} tabIndex="0" className={classNames({"modal": true, "___small": this.props.small, "___is-open": this.props.modal == this.props.id})}>
                {modal}
            </div>
        )
    }
}

const stateToProps = (state) => {
    return {
        modal: state.modal
    }
}

export default connect(stateToProps)(Modal)