import React from "react"
import { Link } from "react-router-dom"
import showDate from "../../lib/showDate"
import classnames from "classnames"

export default class FileCard extends React.Component {
    render() {
        const { entity } = this.props

        return (
            <Link to={entity.url}>
                <div className="card-document">
                    <div className="card-document__format" />
                    <div className="card-document__title">{entity.title}</div>
                </div>
            </Link>
        )
    }
}