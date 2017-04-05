import React from "react"
import { Link } from "react-router"

export default class MemberItem extends React.Component {
    render() {
        const { member } = this.props

        return (
            <Link to={member.url} className="card-list-members__item">
                <div style={{backgroundImage: `url('${member.icon}')`}} className="card-list-members__picture" />
                <div className="card-list-members__name">{member.name}</div>
            </Link>
        )
    }
}