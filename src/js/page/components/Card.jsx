import React from "react"
import { Link } from "react-router-dom"
import { getClassFromTags } from "../../lib/helpers"
import classnames from "classnames"

export default class Card extends React.Component {
    render() {
        const { inActivityFeed } = this.props
        const { guid, url, title, excerpt, isFeatured, featuredImage } = this.props.entity

        let featured
        if (featuredImage) {
            featured = (
                <Link to={url} style={{backgroundImage: "url(" + featuredImage + ")"}} className="card-blog-post__image" />
            )
        }

        return (
            <div className="card-blog-post">
                <div className="card-blog-post__post">
                    <Link to={url} className="card-blog-post__title">
                        {title}
                    </Link>
                </div>
            </div>
        )
    }
}