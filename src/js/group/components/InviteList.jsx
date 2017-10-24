import React from "react"
import InviteItem from "./InviteItem"

export default class InviteAutoCompleteList extends React.Component {
    render() {
        const list = this.props.users.toJS().map((user, i) => (
            <InviteItem key={i} group={this.props.group} user={user} added onDeselect={this.props.onDeselect} />
        ))

        let placeholder
        if (list.length === 0) {
            placeholder = "Gebruik het zoekveld om een gebruiker te zoeken..."
        }

        return (
            <div className="list-members" style={{height: "300px", paddingTop:"1em"}}>
                {placeholder}
                {list}
            </div>
        )
    }
}