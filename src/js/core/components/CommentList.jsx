import React from "react"
import Comment from "./Comment"
import CommentVote from "./CommentVote"

export default class CommentList extends React.Component {
    render() {
        let comments, commentsCount
        if (this.props.comments) {
            comments = this.props.comments.map((comment) => (
                <Comment key={comment.guid} canVote={this.props.canVote} entity={comment} />
            ))
        }

        if (this.props.comments.length > 0) {
            commentsCount = (
                <div className="article-comments__count">
                    {this.props.comments.length} {(this.props.comments.length === 1) ? "antwoord" : "antwoorden"}
                </div>
            )
        }

        let loadMore = (
            <div className="button__text article-comments__more">Alle reacties</div>
        )

        return (
            <div className="article-comments">
                {commentsCount}
                {comments}
            </div>
        )
    }
}