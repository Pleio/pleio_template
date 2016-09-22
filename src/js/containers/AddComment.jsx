import React from "react"
import classNames from "classnames"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import AddCommentForm from "./AddCommentForm"

class AddComment extends React.Component {
    render() {
        let viewer = this.props.data.viewer || null

        return (
            <div className={classNames({"comment-add__wrapper": true, "___is-open": this.props.isOpen})} style={{maxHeight: this.props.isOpen ? "329px" : "0px"}}>
                <AddCommentForm viewer={viewer} object={this.props.object} onSuccess={this.props.onSuccess} />
            </div>
        )
    }
}

const QUERY = gql`
    query AddComment {
        viewer {
            name
            icon
            url
        }
    }
`;

export default graphql(QUERY)(AddComment);