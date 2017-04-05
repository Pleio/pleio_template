import React from "react"
import { graphql } from "react-apollo"
import { Link } from "react-router"
import gql from "graphql-tag"
import { showModal } from "../lib/actions"
import Document from "../core/components/Document"
import ContentHeader from "../core/components/ContentHeader"
import NotFound from "../core/NotFound"
import Card from "../activity/components/Card"
import MoreInfoModal from "./components/MoreInfoModal"
import InviteModal from "./components/InviteModal"
import MembersSummary from "./components/MembersSummary"
import ActivityList from "./components/ActivityList"
import Menu from "./components/Menu"

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

        let editOptions
        if (entity.canEdit) {
            editOptions = (
                    <div className="col-sm-6 end-sm">
                        <div className="buttons ___no-margin ___gutter ___hide-on-tablet">
                            <Link to={`/groups/edit/${entity.guid}`} >
                                <div className="button ___large ___line">
                                    <span>Groep bewerken</span>
                                </div>
                            </Link>
                            <div className="button ___large" onClick={() => this.refs.inviteModal.toggle()}>
                                Leden uitnodigen
                            </div>
                        </div>
                    </div>
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
                                <div onClick={() => this.refs.moreInfoModal.toggle()} />
                            </h3>
                        </div>
                        {editOptions}
                    </div>
                    <Menu params={this.props.params} />
                </ContentHeader>
                <section className="section ___grey ___grow">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-12 col-lg-4 last-lg top-lg">
                                <MembersSummary entity={entity} /> 
                            </div>
                            <div className="col-sm-12 col-lg-8">
                                <ActivityList childClass={Card} offset={0} limit={20} tags={[]} />
                            </div>
                        </div>
                    </div>
                </section>
                <MoreInfoModal ref="moreInfoModal" onKeyDown={this.handleKeyPress} entity={entity} />
                <InviteModal ref="inviteModal" entity={entity} />
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
                canEdit
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
                guid: ownProps.params.guid
            }
        }
    }
}

export default graphql(Query, Settings)(Item)