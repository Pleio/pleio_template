import React from "react"
import { graphql } from "react-apollo"
import { connect } from "react-redux"
import { Link } from "react-router"
import gql from "graphql-tag"
import { showModal } from "../lib/actions"
import Document from "../core/components/Document"
import TabMenu from "../core/components/TabMenu"
import ContentHeader from "../core/components/ContentHeader"
import NotFound from "../core/NotFound"
import EditModal from "./components/MoreInfoModal"
import MemberSummary from "./components/MemberSummary"


class Item extends React.Component {
    constructor(props) {
        super(props)

        /*this.onEdit = () => this.props.dispatch(showModal("edit"))*/
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

        let edit
        if (entity.canEdit) {
            edit = (
                    <Link to={`/groups/edit/${entity.guid}`} >
                        <div className="button ___large ___add">
                            <span>Groep bewerken</span>
                        </div>
                    </Link>
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
                                <div onClick={() => this.refs.editGroup.toggle()} />
                            </h3>
                        </div>
                        <div className="col-sm-6 end-sm">
                            <div className="buttons ___no-margin ___gutter ___hide-on-tablet">
                                {edit}
                                <Link to="/groups/invite">
                                    <div className="button ___large ___add">
                                        <span>Leden uitnodigen</span>
                                    </div>
                                </Link>
                            </div>
                        </div>
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
                <EditModal ref="editGroup" entity={entity} />
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

export default connect()(graphql(Query, {
    options: (ownProps) => {
        return {
            variables: {
                guid: ownProps.params.guid
            }
        }
    }
})(Item));