import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { Link } from "react-router-dom"
import AddButton from "../core/containers/AddButton"
import Document from "../core/components/Document"
import ContentHeader from "../core/components/ContentHeader"
import NotFound from "../core/NotFound"
import EventsList from "./containers/EventsList"
import Menu from "./components/Menu"
import Card from "../events/components/Card"

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
                        <div className="col-sm-6 end-sm">
                            <Link to={`events/add`} className="right-lg">
                                <AddButton title="Maak een agenda-item" subtype="event" containerGuid={entity.guid} />
                            </Link>
                        </div>
                    </div>
                    <Menu match={this.props.match} />
                </ContentHeader>
                <section className="section ___grey ___grow">
                    <div className="container">
                        <EventsList type="object" subtype="event" containerGuid={entity.guid} childClass={Card} offset={0} limit={20} match={this.props.match} />
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
                name
                description
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