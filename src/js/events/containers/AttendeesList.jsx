import React from "react"
import { Link } from "react-router-dom"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

class AttendeesList extends React.Component {
    render() {
        if (this.props.data.loading) {
            return (
                <div />
            )
        }

        const attendees = this.props.data.entity.attendees.edges.map((attendee) => (
            <div key={attendee.guid} className="col-sm-6">
                <Link to={attendee.url}>
                    <div className="list-members__member">
                        <div className="list-members__picture" style={{backgroundImage: `url(${attendee.icon})`}} />
                        <div className="list-members__name"><b>{attendee.name}</b></div>
                    </div>
                </Link>
            </div>
        ))

        return (
            <div className="list-members">
                <div className="row">
                    {attendees}
                </div>
            </div>
        )
    }
}

const Query = gql`
    query AttendeesList($guid: Int!, $state: String) {
        entity(guid: $guid) {
            guid
            ... on Object {
                attendees(offset: 0, limit: 50, state: $state) {
                    total
                    totalMaybe
                    totalReject
                    edges {
                        guid
                        icon
                        url
                        username
                        name
                    }
                }
            }
        }
    }
`

export default graphql(Query)(AttendeesList)