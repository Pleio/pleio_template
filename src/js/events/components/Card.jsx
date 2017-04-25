import React from "react"
import { Link } from "react-router-dom"
import { getClassFromTags } from "../../lib/helpers"
import showDate from "../../lib/showDate"
import classnames from "classnames"

export default class Card extends React.Component {
    render() {
        const { guid, title, excerpt, startDate, endDate, url } = this.props.entity

        return (
            <div className="card-blog-post">
                <div className="card-blog-post__post">
                    <Link to={`${url}`} className="card-blog-post__title">
                        {title}
                    </Link>

                    <i>{showDate(startDate)} - {showDate(endDate)}</i>

                    <div className="card-blog-post__content">
                        {excerpt}
                    </div>
                </div>
            </div>
        )
    }
}