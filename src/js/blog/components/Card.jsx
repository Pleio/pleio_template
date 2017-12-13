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

        let inGroup
        if (group) {
            inGroup = (
                <span>&nbsp;in <Link to={group.url}>{group.name}</Link></span>
            )
        }

        return (
            <div className="card-blog-post">
                <Link to={owner.url} title={owner.name} style={{backgroundImage: `url(${owner.icon})`}} className="card-blog-post__picture" />
                <div className="card-blog-post__post">
                    <div className="card-blog-post__meta">
                        <Link to={owner.url} className="card-blog-post__user">
                            {owner.name}
                        </Link>

                        {inGroup}

                        <div className="card-blog-post__date">
                            {showDate(entity.timeCreated)}
                        </div>
                    </div>

                    <Featured entity={entity} inCard="blog" to={entity.url} />

                    <Link to={entity.url} className="card-blog-post__title">
                        {entity.title}
                    </Link>

                    <div className="card-blog-post__content">
                        {entity.excerpt}
                    </div>
                </div>

                <div className="card-blog-post__actions">
                    <Likes entity={entity} />
                    <Bookmark entity={entity} />
                </div>
            </div>
       )
    }
}