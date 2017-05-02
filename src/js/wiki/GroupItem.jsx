import React from "react"
import { graphql } from "react-apollo"
import { Link } from "react-router-dom"
import gql from "graphql-tag"
import Document from "../core/components/Document"
import ContentHeader from "../core/components/ContentHeader"
import NotFound from "../core/NotFound"
import Menu from "../group/components/Menu"
import WikiItem from "../wiki/Item"

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
            <div className="page-container">
                <Document title={entity.name} />
                <ContentHeader className="___no-padding-bottom">
                    <div className="row">
                        <div className="col-sm-6">
                            <h3 className="main__title ___info">
                                {entity.name}
                            </h3>
                        </div>
                    </div>
                    <Menu match={this.props.match} group={entity} />
                </ContentHeader>
                <section className="section ___grey ___grow">
                    <div className="container">
                        <WikiItem match={this.props.match} />
                    </div>
                </section>
            </div>
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
                guid
                name
                description
                plugins
                icon
                isClosed
                members(limit: 5) {
                    total
                    edges {
                        guid
                        name
                        icon
                        url
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