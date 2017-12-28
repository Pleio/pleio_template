import React from "react"
import InviteItem from "./InviteItem"

export default class InviteAutoCompleteList extends React.Component {
    render() {
        const list = this.props.users.toJS().map((user, i) => (
            <InviteItem key={i} group={this.props.group} user={user} added onDeselect={this.props.onDeselect} />
        ))

        return (
            <div className="list-members">
                {list}
            </div>
        )
    }
}