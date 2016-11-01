import React from "react"
import showDate from "../../lib/showDate"
import CommentVote from "./CommentVote"

export default class Comment extends React.Component {
    render() {
        let vote

        if (this.props.canVote) {
            vote = (
                <CommentVote entity={this.props.entity} />
            )
        }

        return (
            <div className="comment">
                {vote}
                <div className="comment__top">
                    <a href={this.props.entity.owner.url}
                       title="Bekijk profiel"
                       style={{"backgroundImage": "url(" + this.props.entity.owner.icon + ")"}}
                       className="comment__picture">
                    </a>
                    <div className="comment__justify">
                        <a href={this.props.entity.owner.url} title="Bekijk profiel" className="comment__name">
                            {this.props.entity.owner.name}
                        </a>
                        <div className="comment__date">
                            {showDate(this.props.entity.timeCreated)}
                        </div>
                    </div>
                </div>
                <div className="comment__body">
                    {this.props.entity.description}
                </div>
            </div>
        )
    }
}