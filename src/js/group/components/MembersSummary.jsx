import React from "react"
import { Link } from "react-router-dom"
import MemberItem from "./MemberItem"
import MembersModal from "./MembersModal"

export default class MembersSummary extends React.Component {
    render () {
        const { entity } = this.props

        const members = entity.members.edges.map((member, i) => (
            <MemberItem key={i} member={member} />
        ))

        return (
            <div className="card-list-members">
                <div className="card-list-members__title">{entity.members.total}{(entity.members.total === 1) ? " lid" : " leden"}</div>
                <div className="card-list-members__items">
                    <div>
                        {members}
                        <div className="card-list-members__more" onClick={() => this.refs.modal.toggle()}>Alle</div>
                    </div>
                </div>
                <MembersModal ref="modal" entity={entity} />
            </div>
        )
    }
}

