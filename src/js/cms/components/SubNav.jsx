import React from "react"
import { Link } from "react-router-dom"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

class SubNav extends React.Component {
    render() {
        const { match } = this.props
        const { entity, entities } = this.props.data

        if (!entities) {
            return (
                <div />
            )
        }

        const children = entities.edges.map((child) => (
            <Link key={child.guid} to={`/cms/view/${match.params.containerGuid || match.params.guid}/${match.params.containerSlug || match.params.slug}/${child.guid}`}>{child.title}</Link>
        ))
        
        return (
            <div className="subnav">
                <div className="subnav__parent ___is-open">
                    <Link to={entity.url}>{entity.title}</Link>
                    <div className="subnav__children">
                        {children}
                    </div>
                </div>
            </div>
        )
    }
}

const Query = gql`
    query SubNav($guid: Int!) {
        entity(guid: $guid) {
            guid
            ... on Page {
                title
                url
            }
        }
        entities(subtype: "page", containerGuid: $guid) {
            total
            edges {
                guid
                ... on Page {
                    title
                    url
                }
            }
        }
    }
`

export default graphql(Query)(SubNav)