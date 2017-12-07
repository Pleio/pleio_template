import React from "react"
import { Link } from "react-router-dom"
import showDate from "../../lib/showDate"
import classnames from "classnames"

export default class UserCard extends React.Component {
    render() {
        const { entity } = this.props

        return (
            <Link to={entity.url} className="card-group">
                <div style={{ backgroundImage: `url('${entity.icon}')` }} className="card-group__picture" />
                <div className="card-group__title">
                    {entity.name}
                </div>
            </Link>
        )
    }
}