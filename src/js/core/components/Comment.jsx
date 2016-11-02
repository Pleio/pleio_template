import React from "react"
import showDate from "../../lib/showDate"
import CommentVote from "./CommentVote"
import CommentEdit from "./CommentEdit"
import classnames from "classnames"

export default class Comment extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            editing: false
        }

        this.toggleEdit = (e) => this.setState({editing: !this.state.editing})
    }

    render() {
        let vote, editButton, editWrapper

        if (this.props.entity.canEdit) {
            editButton = (
                <div className="comment__edit" onClick={this.toggleEdit}><span>Wijzig</span></div>
            )
        }

        if (this.props.canVote) {
            vote = (
                <CommentVote entity={this.props.entity} />
            )
        }

        if (this.state.editing) {
            return (
                <div className="comment-container">
                    <div className="comment-edit__wrapper ___is-open" style={{maxHeight:"100%"}}>
                        <CommentEdit entity={this.props.entity} toggleEdit={this.toggleEdit} />
                    </div>
                </div>
            )
        } else {
            return (
                <div className="comment-container">
                    <div className={classnames({comment: true, "___can-edit": this.props.entity.canEdit})}>
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
                                <div>
                                    <div className="comment__date">{showDate(this.props.entity.timeCreated)}</div>
                                    {editButton}
                                </div>
                            </div>
                        </div>
                        <div className="comment__body">
                            {this.props.entity.description}
                        </div>
                    </div>
                </div>
            )
        }
   }
}