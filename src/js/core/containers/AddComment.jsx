import React from "react"
import classNames from "classnames"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import AddCommentForm from "./AddCommentForm"
import autobind from "autobind-decorator"

export default class AddComment extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isOpen: false
        }
    }

    @autobind
    toggle(e) {
        this.setState({ isOpen: !this.state.isOpen })
    }

    render() {
        let user = this.props.viewer.user || null

        return (
            <div className={classNames({"comment-add__wrapper": true, "___is-open": this.state.isOpen})} style={{maxHeight: this.state.isOpen ? "450px" : "0px"}}>
                <AddCommentForm user={user} object={this.props.object} onSuccess={this.toggle} refetchQueries={this.props.refetchQueries} toggle={this.toggle} />
            </div>
        )
    }
}