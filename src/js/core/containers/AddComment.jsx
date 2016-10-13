import React from "react"
import classNames from "classnames"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import AddCommentForm from "./AddCommentForm"

export default class AddComment extends React.Component {
    render() {
        let user = this.props.viewer.user || null

        return (
            <div className={classNames({"comment-add__wrapper": true, "___is-open": this.props.isOpen})} style={{maxHeight: this.props.isOpen ? "450px" : "0px"}}>
                <AddCommentForm user={user} object={this.props.object} onSuccess={this.props.onSuccess} />
            </div>
        )
    }
}