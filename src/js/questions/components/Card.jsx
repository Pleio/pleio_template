import React from "react"
import { Link } from "react-router-dom"
import Likes from "../../core/components/Likes"
import Bookmark from "../../bookmarks/components/Bookmark"
import showDate from "../../lib/showDate"
import { displayTags } from "../../lib/helpers"
import classnames from "classnames"

export default class Card extends React.Component {
    render () {
        const { entity, group, inActivityFeed } = this.props

        let comments
        if (entity.commentCount > 0) {
            comments = (
                <Link to={entity.url} className="card-topic__comments">
                    {entity.commentCount} {(entity.commentCount === 1) ? " reactie" : " reacties"}
                </Link>
            )
        }

        let actions = (
            <div className="card-topic__actions">
                <Bookmark entity={entity} />
                {comments}                
            </div>
        )

        const meta = (
            <div className="card-topic__meta">
                <span>
                    Vraag gesteld door&nbsp;
                </span>
                <Link to={entity.owner.url} className="card-topic__user">
                    {entity.owner.name}
                </Link>
                <span>, op {showDate(entity.timeCreated)}</span>
                {group &&
                    <span>, in <Link to={group.url}>{group.name}</Link></span>
                }
            </div>
        )

        return (
            <div className="card-topic ___feed">
                <Link to={entity.owner.url} title={entity.owner.name} style={{backgroundImage: "url(" + entity.owner.icon + ")"}} className="card-topic__picture"></Link>
                <div className="card-topic__post">
                    <Link to={entity.url} className="card-topic__title">
                        {entity.title}
                    </Link>
                    {meta}
                    <div className="card-topic__content">
                        {entity.excerpt}
                    </div>
                </div>
                {actions}
            </div>
        )
    }
}

