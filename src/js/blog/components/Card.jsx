import React from "react"
import { Link } from "react-router-dom"
import { getClassFromTags } from "../../lib/helpers"
import classnames from "classnames"
import showDate from "../../lib/showDate"
import Featured from "../../core/components/Featured"
import Likes from "../../core/components/Likes"
import Bookmark from "../../bookmarks/components/Bookmark"
import { displayTags } from "../../lib/helpers"

export default class Card extends React.Component {
    render() {
        const { entity, group } = this.props
        const { owner } = entity

        let comments
        if (entity.commentCount > 0) {
            comments = (
                <Link to={entity.url} className="card-topic__comments">
                    {entity.commentCount} {(entity.commentCount === 1) ? " reactie" : " reacties"}
                </Link>
            )
        }

        const meta = (
            <div className="card-topic__meta">
                <span>
                    Blog gemaakt door&nbsp;
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
            <div className="card-blog-post">
                <Link to={owner.url} title={owner.name} style={{backgroundImage: `url(${owner.icon})`}} className="card-blog-post__picture" />
                <div className="card-blog-post__post">
                    <Link to={entity.url} className="card-blog-post__title">
                        {entity.title}
                    </Link>
                    {meta}
                    <Featured entity={entity} inCard="blog" to={entity.url} />
                    
                    <div className="card-blog-post__content">
                        {entity.excerpt}
                    </div>
                </div>

                <div className="card-blog-post__actions">
                    <Bookmark entity={entity} />
                    {comments}                    
                </div>
            </div>
       )
    }
}