import React from "react"
import { Link } from "react-router-dom"
import { getClassFromTags } from "../../lib/helpers"
import classnames from "classnames"
import showDate from "../../lib/showDate"
import Likes from "../../core/components/Likes"
import Bookmark from "../../bookmarks/components/Bookmark"
import { displayTags } from "../../lib/helpers"

export default class Card extends React.Component {
    render() {
        const { guid, featuredImage, title, excerpt, timeCreated, url, tags, owner } = this.props.entity

        let featured
        if (featuredImage) {
            featured = (
                <Link to={url} style={{backgroundImage: "url(" + featuredImage + ")"}} className="card-blog-post__image" />
            )
        }

        return (
            <div className="card-blog-post">
                <Link to={owner.url} title={owner.name} style={{backgroundImage: "url(" + owner.icon + ")"}} className="card-blog-post__picture"></Link>
                <div className="card-blog-post__post">
                    <div className="card-blog-post__meta">
                        <Link to={owner.url} className="card-blog-post__user">
                            {owner.name}
                        </Link>

                        { tags.length > 0 ? ( <span>&nbsp;over&nbsp;</span> ) : "" }
                        <Link to={url} className="card-blog-post__subject">
                            {displayTags(tags)}
                        </Link>

                        <div className="card-blog-post__date">
                            {showDate(timeCreated)}
                        </div>
                    </div>

                    {featured}

                    <Link to={url} className="card-blog-post__title">
                        {title}
                    </Link>

                    <div className="card-blog-post__content">
                        {excerpt}
                    </div>
                </div>

                <div className="card-blog-post__actions">
                    <Likes entity={this.props.entity} />
                    <Bookmark entity={this.props.entity} />
                </div>
            </div>
       )
    }
}