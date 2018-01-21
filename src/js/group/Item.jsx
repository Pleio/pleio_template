import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { Link } from "react-router-dom"
import GroupContainer from "./components/GroupContainer"
import Document from "../core/components/Document"
import Card from "../activity/components/Card"
import Introduction from "./components/Introduction"
import StatusUpdate from "./components/StatusUpdate"
import MembersCard from "./components/MembersCard"
import EventsCard from "./components/EventsCard"
import ActivityList from "./components/ActivityList"
import JoinGroupButton from "./components/JoinGroupButton"

class Item extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { entity } = this.props.data

        if (!entity) {
            // Loading...
            return (
                <div></div>
            )
        }

        if (entity.status == 404) {
            return (
                <NotFound />
            )
        }

        return (
            <GroupContainer match={this.props.match}>
                <Document title={entity.name} />
                <section className="section ___grow">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-12 col-lg-4 last-lg top-lg">
                                <div className="row">
                                    <div className="col-sm-6 col-lg-12">
                                        <MembersCard entity={entity} />
                                    </div>
                                    <div className="col-sm-6 col-lg-12">
                                        <EventsCard entity={entity} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-12 col-lg-8">
                                <Introduction entity={entity} />
                                <StatusUpdate containerGuid={entity.guid} />
                                <ActivityList containerGuid={entity.guid} containerClassName="" childClass={Card} offset={0} limit={20} tags={[]} />
                            </div>
                        </div>
                    </div>
                </section>
            </GroupContainer>
        )
    }
}

const Query = gql`
    query GroupItem($guid: Int!) {
        viewer {
            guid
            loggedIn
            user {
                guid
                name
                icon
                url
            }
        }
        entity(guid: $guid) {
            guid
            status
            ... on Group {
                name
                url
                plugins
                description
                introduction
                icon
                featured {
                    video
                    image
                    positionY
                }
                isClosed
                canEdit
                membership
                members(limit: 5) {
                    total
                    edges {
                        role
                        email
                        user {
                            guid
                            username
                            url
                            name
                            icon
                        }
                    }
                }
            }
        }
    }
`

const Settings = {
    options: (ownProps) => {
        return {
            variables: {
                guid: ownProps.match.params.groupGuid
            }
        }
    }
}

export default graphql(Query, Settings)(Item)