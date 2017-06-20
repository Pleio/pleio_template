import React from "react"
import { Link } from "react-router-dom"
import MemberItem from "./MemberItem"
import MembersModal from "./MembersModal"
import Accordeon from "../../core/components/Accordeon"

export default class MembersSummary extends React.Component {
    render () {
        const { entity } = this.props

        const members = entity.members.edges.map((member, i) => (
            <MemberItem key={i} member={member} />
        ))

        return (
            <Accordeon className="card-list-members" title={`${entity.members.total} ${(entity.members.total === 1) ? " lid" : " leden"}`}>
                {members}
                <div className="card-list-members__more" onClick={() => this.refs.modal.toggle()}>Alle</div>
                <MembersModal ref="modal" entity={entity} />
            </Accordeon>
        )
    }
}

