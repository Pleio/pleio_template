import React from "react"
import classnames from "classnames"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import AddDocument from "./AddDocument"

export default class DocumentModal extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isOpen: false
        }

        this.toggle = () => this.setState({ isOpen: !this.state.isOpen })
        this.onSubmit = this.onSubmit.bind(this)
    }

    onSubmit(name, data) {
        this.props.onSubmit(name, data)
        this.setState({
            isOpen: false
        })
    }

    render() {
        return (
            <div tabIndex="0" className={classnames({"modal ___small ___middle": true, "___is-open": this.state.isOpen})}>
                <div className="modal__wrapper">
                    <div className="modal__background"></div>
                    <div className="modal__box">
                        <div className="modal__close" onClick={this.toggle}></div>
                        <h3 className="modal__title">Document(en) invoegen</h3>
                        <div className="form">
                            <AddDocument onSubmit={this.onSubmit} />
                            <div className="buttons ___end">
                                <div className="button" onClick={this.onAddUrl}>
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