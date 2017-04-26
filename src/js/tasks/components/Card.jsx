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
            <div className="card-blog-post" draggable={true}>
                <div className="card-blog-post__post">
                    <Link to={`${this.getRootURL()}/tasks/edit/${guid}`} className="card-blog-post__title">
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