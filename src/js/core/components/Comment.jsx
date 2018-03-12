import React from "react"
import showDate from "../../lib/showDate"
import Likes from "./Likes"
import CommentEdit from "./CommentEdit"
import classnames from "classnames"
import RichTextView from "../../core/components/RichTextView"
import CommentVote from "./CommentVote"
import CommentBestAnswer from "./CommentBestAnswer"

export default class Comment extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            editing: false
        }

        this.toggleEdit = (e) => this.setState({editing: !this.state.editing})
    }

    render() {
        let { entity, canUpvote } = this.props

        let editButton
        if (entity.canEdit) {
            editButton = (
                <div className="comment__edit" onClick={this.toggleEdit}><span>Wijzig</span></div>
            )
        }

        let vote
        if (entity.canVote && !canUpvote) {
            vote = (
                <Likes entity={entity} />
            )
        }

        let upvote
        if (canUpvote) {
            upvote = (
                <CommentVote entity={entity} />
            )
        }

        if (this.state.editing) {
            return (
                <div className="comment-container">
                    <div className="comment-edit__wrapper ___is-open" style={{maxHeight:"100%"}}>
                        <CommentEdit entity={entity} toggleEdit={this.toggleEdit} />
                    </div>
                </div>
            )
        } else {
            return (
                <div className={classnames({"comment-container": true, " ___is-editable": entity.canEdit})}>
                    <div className="comment__side">
                        {upvote}
                        <CommentBestAnswer entity={entity} />
                    </div>
                    <div className={classnames({comment: true, "___can-edit": entity.canEdit})}>
                        <div className="comment__top">
                            <a href={entity.owner.url}
                               title="Bekijk profiel"
                               style={{"backgroundImage": "url(" + entity.owner.icon + ")"}}
                               className="comment__picture">
                            </a>
                            <div className="comment__justify">
                                <a href={entity.owner.url} title="Bekijk profiel" className="comment__name">
                                    {entity.owner.name}
                                </a>
                                <div>
                                    <div className="comment__date">{showDate(entity.timeCreated)}</div>
                                    {editButton}
                                </div>
                            </div>
                        </div>
                        <div className="comment__body">
                            <RichTextView richValue={entity.richDescription} value={entity.description} />
                        </div>
                        {vote}
                    </div>
                </div>
            )
        }
   }
}