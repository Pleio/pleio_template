import React from "react"
import { graphql } from "react-apollo"
import { Link } from "react-router"
import gql from "graphql-tag"
import { showModal } from "../lib/actions"
import Document from "../core/components/Document"
import TabMenu from "../core/components/TabMenu"
import ContentHeader from "../core/components/ContentHeader"
import NotFound from "../core/NotFound"
import MoreInfoModal from "./components/MoreInfoModal"
import InviteModal from "./components/InviteModal"
import MemberSummary from "./components/MemberSummary"


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
                                <div className="button ___large ___add">
                                    <span>Groep bewerken</span>
                                </div>
                            </Link>
                            <div onClick={() => this.refs.inviteModal.toggle()} >Leden beheren</div>
                        </div>
                    </div>
            )
        }

        const rootUrl =  `/groups/view/${entity.guid}/${this.props.params.slug}`

        const menuOptions = [
            { link: `${rootUrl}`, title:"Home" },
            { link: `${rootUrl}/blog`, title:"Blog" },
            { link: `${rootUrl}/questions`, title:"Forum" },
            { link: `${rootUrl}/file`, title:"Bestanden" }
        ]

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
                    <TabMenu options={menuOptions} />
                </ContentHeader>
                <section className="section ___grey ___grow">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-12 col-lg-4 last-lg top-lg">
                                <MemberSummary entity={entity} /> 
                            </div>
                            <div className="col-sm-12 col-lg-8">
                                Info
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

// Duo to CSS rules, InviteModal has te be at the bottom.

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