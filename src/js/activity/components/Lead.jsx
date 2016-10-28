import React from "react"
import { connect } from "react-redux"
import { Link } from "react-router"
import { showModal } from "../../lib/actions"

class Lead extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            visible: true,
            height: "auto"
        }

        this.onClose = this.onClose.bind(this)
        this.openRegister = this.openRegister.bind(this)
    }

    openRegister(e) {
        e.preventDefault()
        this.props.dispatch(showModal("register"))
    }

    onClose(e) {
        this.setState({
            height: this.refs.lead.offsetHeight
        })

        setTimeout(() => {
            this.setState({
                visible: false
            })
        }, 10)
    }

    render() {
        let style = {
            height: this.state.height,
            backgroundImage: "url(" + this.props.image + ")"
        }

        if (!this.state.visible) {
            style.marginTop = 0;
            style.opacity = 0;
            style.height = 0;
        }

        return (
            <div style={style} className="lead ___home" ref="lead">
                <div className="lead__close" onClick={this.onClose}>
                </div>
                <div className="lead__justify">
                    <div className="container">
                        <h1 className="lead__title">
                            {this.props.title}
                        </h1>
                        <h2 className="lead__sub-title">
                            {this.props.subtitle}
                        </h2>
                        <div className="buttons ___margin-top ___gutter ___center">
                            <div className="button ___large" onClick={this.openRegister}>
                                Aan de slag
                            </div>
                            <Link to='/campagne'>
                                <div className="button ___large">
                                    Over Leraar.nl
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect()(Lead)