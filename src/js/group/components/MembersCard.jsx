import React from "react"
import { Link } from "react-router-dom"
import MemberItem from "./MemberItem"
import MembersModal from "./MembersModal"
import People from "../../core/components/People"

export default class MembersCard extends React.Component {
    render () {
        const { entity } = this.props

        if (!entity.members) {
            return (
                <div />
            )
        }

        const users = {
            edges: entity.members.edges.map((membership) => membership.user)
        }

        return (
            <div className="card ___side ___members ___last">
                <div onClick={() => this.refs.modal.toggle()}>
                    <People users={users} />
                    <div className="card__title">{`${entity.members.total} ${(entity.members.total === 1) ? " lid" : " leden"}`}</div>
                </div>
                <MembersModal ref="modal" entity={entity} />
            </div>
        )
    }
}

