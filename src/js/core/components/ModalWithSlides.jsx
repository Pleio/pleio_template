import React from "react"
import classnames from "classnames"
import { hideModal } from "../../lib/actions"
import { browserHistory } from "react-router"

class ModalWithSlides extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            slide: 1
        }

        this.onClose = this.onClose.bind(this)
        this.previousSlide = this.previousSlide.bind(this)
        this.nextSlide = this.nextSlide.bind(this)
    }

    previousSlide() {
        this.setState({
            slide: Math.max(1, this.state.slide - 1)
        })
    }

    nextSlide() {
        this.setState({
            slide: Math.min(this.props.children.length, this.state.slide + 1)
        })
    }

    onClose(e) {
        if (e) {
            e.preventDefault()
        }

        if (this.props.noParent) {
            browserHistory.push("/")
        } else {
            this.props.dispatch(hideModal())
        }
    }

    render() {
        const numberSlides = this.props.children.length
        let children = this.props.children.map((child, i) => {

            let clonedChild = React.cloneElement(child, {
                previousSlide: this.previousSlide,
                nextSlide: this.nextSlide
            })

            return (
                <div key={i} className="modal__box">
                    <h3 className="modal__title">
                        {this.props.title}
                        <span>&nbsp;{i+1}/{numberSlides}</span>
                    </h3>
                    {clonedChild}
                </div>
            )
        })

        return (
            <div id={this.props.id} tabIndex="0" className={classnames({"modal":true, "___blue":this.props.isBlue, "___small": this.props.small, "___is-open": this.props.noParent})}>
                <div className="modal__close" onClick={this.onClose}></div>
                <div data-modal-slides={numberSlides} className={classnames({"modal__wrapper":true, "___slide-2":this.state.slide === 2})}>
                    <div className="modal__background" onClick={this.onClose}></div>
                    {children}
                </div>
            </div>
        )
    }
}

export default ModalWithSlides