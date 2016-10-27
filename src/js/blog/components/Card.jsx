import React from "react"
import { Link } from "react-router"
import { getClassFromTags } from "../../lib/helpers"
import classnames from "classnames"
import showDate from "../../lib/showDate"

export default class Card extends React.Component {
    render() {
        const { guid, featuredImage, title, excerpt, timeCreated, tags, owner } = this.props.entity

        let featured
        if (featuredImage) {
            featured = (
                <Link to={`/blog/${guid}`} style={{backgroundImage: "url(" + featuredImage + ")"}} className="card-blog-post__image" />
            )
        }

        return (
            <div className="card-blog-post">
                <a href="#" title="Merel Beijersbergen" style={{backgroundImage: "url(" + owner.icon + ")"}} className="card-blog-post__picture"></a>
                <div className="card-blog-post__post">
                    <div className="card-blog-post__meta">
                        <a href="#" className="card-blog-post__user">
                            {owner.name}
                        </a>

                        { tags.length > 0 ? ( <span>&nbsp;over&nbsp;</span> ) : "" }
                        <a href="#" className="card-blog-post__subject">
                            {tags}
                        </a>

                        <div href="#" className="card-blog-post__date">
                            {showDate(timeCreated)}
                        </div>
                    </div>

                    {featured}

                    <Link to={`/blog/${guid}`} className="card-blog-post__title">
                        {title}
                    </Link>

                    <div className="card-blog-post__content">
                        {excerpt}
                    </div>
                </div>

                <div className="card-blog-post__actions">
                    <div data-toggle-like="" className="button__text ___likes">
                        <span data-toggle-like="number">14</span>&nbsp;likes
                    </div>
                </div>
            </div>
       )
    }
}