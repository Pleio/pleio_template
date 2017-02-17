import React from "react"
import { Link } from "react-router"

export default class MemberSummary extends React.Component {
    render () {
        const { entity } = this.props

        const members = entity.members.edges.map((member, i) => (
            <Link key={i} to="" className="card-list-members__item">
                <div style={{backgroundImage: `url('${member.icon}')`}} className="card-list-members__picture" />
                <div className="card-list-members__name">{member.name}</div>
            </Link>
        ))

        return (
            <div className="card-list-members">
                <div className="card-list-members__title">{entity.members.total} {(entity.members.total === 1) ? "lid" : "leden"}</div>
                <div className="card-list-members__items">
                    <div>
                        {members}
                    </div>
                </div>
            </div>
        )
    }
}

