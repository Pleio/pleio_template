import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { Link } from "react-router-dom"
import GroupContainer from "./components/GroupContainer"
import Document from "../core/components/Document"
import Card from "../activity/components/Card"
import MembersCard from "./components/MembersCard"
import EventsCard from "./components/EventsCard"
import ActivityList from "./components/ActivityList"

class Item extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { entity, viewer } = this.props.data

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

        let join, leave, edit, invite
        if (((viewer.loggedIn && !entity.isClosed) || entity.canEdit) && entity.membership === "not_joined") {
            join = (
                <JoinGroupButton entity={entity} />
            )
        }

        if (!entity.canEdit && entity.membership === "joined") {
            leave = (
                <div className="button" onClick={() => this.refs.leaveGroupModal.toggle()}>Verlaat groep</div>
            )
        }

        if (entity.canEdit) {
            edit = (
                <Link to={`/groups/edit/${entity.guid}`} >
                    <div className="button ___large ___line">
                        <span>Groep bewerken</span>
                    </div>
                </Link>
            )
        }

        if (entity.membership === "joined" && entity.canEdit) {
            invite = (
                <div className="button ___large" onClick={() => this.refs.inviteModal.toggle()}>
                    Leden uitnodigen
                </div>
            )
        }

        return (
            <GroupContainer match={this.props.match}>
                <Document title={entity.name} />
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
                            <ActivityList containerGuid={entity.guid} containerClassName="" childClass={Card} offset={0} limit={20} tags={[]} />
                        </div>
                    </div>
                </div>
            </GroupContainer>
        )
    }
}

const Query = gql`
    query GroupItem($guid: String!) {
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