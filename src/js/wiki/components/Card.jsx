import React from "react"
import { Link } from "react-router-dom"
import { getClassFromTags } from "../../lib/helpers"
import classnames from "classnames"

export default class Card extends React.Component {
    render() {
        const { guid, title, excerpt } = this.props.entity

        return (
            <div className="card-blog-post">
                <div className="card-blog-post__post">
                    <Link to={`wiki/view/${guid}/${title}`} className="card-blog-post__title">
                        {title}
                    </Link>

                    <div className="card-blog-post__content">
                        {excerpt}
                    </div>
                </div>
            </div>
        )
    }
}