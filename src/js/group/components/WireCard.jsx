import React from "react"
import { Link } from "react-router-dom"
import { getClassFromTags } from "../../lib/helpers"
import classnames from "classnames"
import showDate from "../../lib/showDate"
import Likes from "../../core/components/Likes"
import Bookmark from "../../bookmarks/components/Bookmark"
import { displayTags } from "../../lib/helpers"
import RichTextView from "../../core/components/RichTextView"

export default class WireCard extends React.Component {
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

                    <div className="card__content">
                        <RichTextView richValue={entity.richDescription} value={entity.description} />
                    </div>
                </div>

                <div className="card-blog-post__actions">
                    <Likes entity={entity} />
                </div>
            </div>
       )
    }
}