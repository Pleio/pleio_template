import React from "react"
import { Link } from "react-router-dom"
import { getClassFromTags } from "../../lib/helpers"
import classnames from "classnames"

export default class Card extends React.Component {
    getRootURL() {
        const { match } = this.props

        if (!match || !match.params.groupGuid || !match.params.groupSlug) {
            return ""
        }

        return `/groups/view/${match.params.groupGuid}/${match.params.groupSlug}`
    }

    render() {
        const { guid, title, excerpt } = this.props.entity

        return (
            <div className="card">
                <div className="card__title">
                    <Link to={`${this.getRootURL()}/wiki/view/${guid}/${title}`} className="card-blog-post__title">
                        {title}
                    </Link>
                </div>

                <div className="card__content">
                    {excerpt}
                </div>
            </div>
        )
    }
}