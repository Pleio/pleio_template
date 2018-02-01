import React from "react"
import { graphql } from "react-apollo"
import { Link } from "react-router-dom"
import gql from "graphql-tag"
import GroupContainer from "../group/components/GroupContainer"
import JoinGroupButton from "../group/components/JoinGroupButton"
import Document from "../core/components/Document"
import DiscussionList from "./containers/DiscussionList"
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
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12 end-sm">
                            <Link to={`discussion/add`} className="button ___add ___large ___margin-mobile-top ___margin-bottom">
                                Start een discussie
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
                    <DiscussionList containerGuid={entity.guid} childClass={Card} subtype="discussion" offset={0} limit={20} tags={[]} match={this.props.match} />
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
            canWriteToContainer(containerGuid: $guid, type: object, subtype: "discussion")
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
                plugins
                icon
                isClosed
                membership
                canEdit
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