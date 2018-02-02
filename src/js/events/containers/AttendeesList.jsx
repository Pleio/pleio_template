import React from "react"
import autobind from 'autobind-decorator'
import { Link } from "react-router-dom"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

let isFetchingMore = false

class AttendeesList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            offset: 0
        }
    }

    @autobind
    onScroll(e) {
        if (!this.refs.list) {
            return
        }

        if (this.props.data.loading || isFetchingMore) {
            return
        }

        if (this.props.data.entity.attendees.total === 0) {
            return
        }

        if (this.props.data.entity.attendees.total === this.props.data.entity.attendees.edges.length) {
            return
        }

        if ((e.target.scrollHeight - (e.target.scrollTop + e.target.offsetHeight)) > 200) {
            return
        }

        isFetchingMore = true
        this.fetchMore()
    }

    @autobind
    fetchMore() {
        let offset = this.state.offset + 50

        this.setState({ offset })

        this.props.data.fetchMore({
            variables: { offset },
            updateQuery: (previousResult, { fetchMoreResult }) => {
                isFetchingMore = false

                return Object.assign({}, previousResult, {
                    entity: Object.assign({}, previousResult.entity, {
                        attendees: Object.assign({}, previousResult.entity.attendees, {
                            edges: [...previousResult.entity.attendees.edges, ...fetchMoreResult.entity.attendees.edges]
                        })
                    })
                })
            }
        })
    }

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

        let placeholder
        if (attendees.length === 0) {
            placeholder = "Er zijn geen leden gevonden."
        }

        return (
            <div ref="list" className="list-members ___scrollable" onScroll={this.onScroll}>
                {placeholder}
                {attendees}
            </div>
        )
    }
}

const Query = gql`
    query AttendeesList($guid: Int!, $state: String, $offset: Int) {
        entity(guid: $guid) {
            guid
            ... on Object {
                attendees(offset: $offset, limit: 50, state: $state) {
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