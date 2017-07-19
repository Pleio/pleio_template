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
        const { entity } = this.props
        const { owner } = entity

        return (
            <div className="card-blog-post">
                <Link to={owner.url} title={owner.name} style={{backgroundImage: `url(${owner.icon})`}} className="card-blog-post__picture" />
                <div className="card-blog-post__post">
                    <div className="card-blog-post__meta">
                        <Link to={owner.url} className="card-blog-post__user">
                            {owner.name}
                        </Link>

                        { entity.tags.length > 0 ? ( <span>&nbsp;over&nbsp;</span> ) : "" }
                        <Link to={entity.url} className="card-blog-post__subject">
                            {displayTags(entity.tags)}
                        </Link>

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