import React from "react"
import { Link, withRouter } from "react-router-dom"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

class Breadcrumb extends React.Component {
    render() {
        const { match } = this.props
        const { breadcrumb } = this.props.data

        const parentUrl = `/groups/view/${match.params.groupGuid}/${match.params.groupSlug}/files`

        let items
        if (breadcrumb) {
            items = breadcrumb.map((item) => (
                <Link to={`${parentUrl}/${item.guid}`} className="___is-active">{item.title}</Link>
            ))
        }

        return (
            <div className="breadcrumb ___large">
                <Link to={`${parentUrl}`}>Bestanden</Link>
                {items}
            </div>
        )
    }
}

const Query = gql`
    query Breadcrumb($guid: String!) {
        breadcrumb(guid: $guid) {
            ... on Object {
                guid
                title
            }
        }
    }
`

export default graphql(Query)(withRouter(Breadcrumb))