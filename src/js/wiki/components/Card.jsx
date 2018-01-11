import React from "react"
import { Link } from "react-router-dom"
import { getClassFromTags } from "../../lib/helpers"
import classnames from "classnames"

export default class Card extends React.Component {
    render() {
        const { entity } = this.props

        return (
            <div className="card">
                <div className="card__title">
                    <Link to={entity.url} className="card-blog-post__title">
                        {entity.title}
                    </Link>
                </div>

                <div className="card__content">
                    {entity.excerpt}
                </div>
            </div>
        )
    }
}