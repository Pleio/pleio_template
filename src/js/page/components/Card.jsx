import React from "react"
import { Link } from "react-router-dom"
import { getClassFromTags } from "../../lib/helpers"
import classnames from "classnames"

export default class Card extends React.Component {
    render() {
        const { url, title } = this.props.entity

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