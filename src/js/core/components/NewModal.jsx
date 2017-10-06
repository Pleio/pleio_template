import React from "react"
import classNames from "classnames"

export default class Modal extends React.Component {
    constructor(props) {
        super(props)

        this.toggle = this.toggle.bind(this)

        this.state = {
            isOpen: false
        }
    }

    toggle() {
        const newState = !this.state.isOpen

        if (newState) {
            document.body.classList.add("modal__open")
        } else {
            document.body.classList.remove("modal__open")
        }

        this.setState({ isOpen: newState })
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
                    <div className="modal__background" onClick={this.toggle} />
                    <div className="modal__box">
                        <div className="modal__close" onClick={this.toggle} />
                        {title}
                        {this.props.children}
                    </div>
                </div>
            )
        } else if (this.props.full) {
            modal = (
                <div className="modal__wrapper">
                    <div className="modal__box">
                        <div className="modal__close" onClick={this.toggle} />
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
                    <div className="modal__background" onClick={this.toggle} />
                    <div className="modal__box">
                        <div className="modal__close" onClick={this.toggle} />
                        {title}
                        {this.props.children}
                    </div>
                </div>
            )
        }

        return (
            <div id={this.props.id} ref="modal" tabIndex="0" className={classNames({"modal":true, "___full":this.props.full, "___blue":this.props.isBlue, "___small": this.props.small, "___square": this.props.square, "___is-open": this.state.isOpen })}>
                {modal}
            </div>
        )
    }
}