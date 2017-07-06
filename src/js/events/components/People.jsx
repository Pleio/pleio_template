import React from "react"

export default class People extends React.Component {
    render() {
        const { users } = this.props

        if (!users || users.total === 0) {
            return (
                <div className="people" />
            )
        }

        const userList = users.edges.map((user) => (
            <div key={user.guid} className="face" style={{backgroundImage:`url(${user.icon})`}} />
        ))

        let more
        if (users.edges.length > users.total) {
            more = (
                <div className="people__more">+{users.total - users.edges.length}</div>
            )
        }

        return (
            <div className="people">
                {userList}
                {more}
            </div>
        )
    }
}