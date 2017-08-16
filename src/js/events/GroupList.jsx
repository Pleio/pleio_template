import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { Link } from "react-router-dom"
import GroupContainer from "../group/components/GroupContainer"
import Document from "../core/components/Document"
import EventsGroupList from "./containers/EventsGroupList"
import Card from "./components/Card"

class Item extends React.Component {
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

        let add
        if (viewer.canWriteToContainer) {
            add = (
                <div className="buttons ___no-margin ___gutter ___hide-on-tablet">
                    <Link to={`events/add`} className="right-lg">
                        <div className="button ___large ___add"><span>Agenda-item toevoegen</span></div>
                    </Link>
                </div>
            )
        }

        const buttons = (
            <div className="flexer ___gutter ___top">
                {add}
            </div>
        )

        return (
            <GroupContainer buttons={buttons} match={this.props.match}>
                <Document title={entity.name} />
                <section className="section ___grow">
                    <EventsGroupList type="object" subtype="event" containerGuid={entity.guid} childClass={Card} offset={0} limit={20} match={this.props.match} />
                </section>
            </GroupContainer>
        )
    }
}

const Query = gql`
    query GroupItem($guid: String!) {
        viewer {
            guid
            loggedIn
            canWriteToContainer(containerGuid: $guid, type: object, subtype: "event")
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
                description
                plugins
                icon
                isClosed
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