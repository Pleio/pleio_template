import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { Link } from "react-router-dom"
import GroupContainer from "../group/components/GroupContainer"
import JoinGroupButton from "../group/components/JoinGroupButton"
import Document from "../core/components/Document"
import TasksList from "./components/TasksList"
import Card from "./components/Card"

class GroupList extends React.Component {
    render() {
        const { match } = this.props
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
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12 end-sm">
                            <Link to={`tasks/add`} className="button ___add ___large ___margin-mobile-top ___margin-bottom">
                                Maak een taak
                            </Link>
                        </div>
                    </div>
                </div>
            )
        }

        let join
        if (((viewer.loggedIn && !entity.isClosed) || entity.canEdit) && entity.membership === "not_joined") {
            join = (
                <JoinGroupButton entity={entity} />
            )
        }

        const buttons = (
            <div className="flexer ___gutter ___top">
                {join}
            </div>
        )

        return (
            <GroupContainer buttons={buttons} match={this.props.match}>
                <Document title={entity.name} />
                <section className="section ___grow">
                    {add}
                    <TasksList type="object" subtype="task" containerGuid={entity.guid} offset={0} limit={100} match={this.props.match} />
                </section>
            </GroupContainer>
        )
    }
}

const Query = gql`
    query GroupList($guid: Int!) {
        viewer {
            guid
            loggedIn
            canWriteToContainer(containerGuid: $guid, type: object, subtype: "wiki")
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
                guid
                name
                description
                canEdit
                plugins
                icon
                isClosed
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

export default graphql(Query, Settings)(GroupList)