import React from "react"
import Comment from "./Comment"

export default class CommentList extends React.Component {
    render() {
        let comments
        if (this.props.comments) {
            comments = this.props.comments.map((comment) => (
                <Comment key={comment.guid} {...comment} />
            ))
        }

        let loadMore = (
            <div className="button__text article-comments__more">Alle reacties</div>
        )

        return (
            <div className="article-comments">
                {comments}
            </div>
        )
    }
}