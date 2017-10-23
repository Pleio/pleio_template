import React from "react"
import { graphql } from "react-apollo"
import { Link } from "react-router-dom"
import gql from "graphql-tag"
import ResultList from "./containers/ResultList"
import Card from "./components/Card"
import GroupContainer from "../group/components/GroupContainer"
import Header from "./containers/Header"
import Document from "../core/components/Document"
import { getQueryVariable } from "../lib/helpers"

class Item extends React.Component {
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

        return (
            <GroupContainer buttons="" match={this.props.match}>
                <Document title={entity.name} />
                <Header q={getQueryVariable("q")} type={getQueryVariable("type")} subtype={getQueryVariable("subtype")} containerGuid={match.params.groupGuid} noSearchBar />
                <section className="section ___grey ___grow">
                    <ResultList childClass={Card} q={getQueryVariable("q")} type={getQueryVariable("type")} subtype={getQueryVariable("subtype")} offset={getQueryVariable("offset") || 0} limit={getQueryVariable("limit") || 10} containerGuid={match.params.groupGuid} />
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
                guid
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