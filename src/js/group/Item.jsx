import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Document from "../core/components/Document"
import TabMenu from "../core/components/TabMenu"
import ContentHeader from "../core/components/ContentHeader"
import NotFound from "../core/NotFound"
import MoreInfoModal from "./components/MoreInfoModal"
import MemberSummary from "./components/MemberSummary"

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
                                <div onClick={() => this.refs.moreInfo.toggle()} />
                            </h3>
                        </div>
                        <div className="col-sm-6 end-sm">
                            <div className="button ___large ___add">
                                <span>Leden uitnodigen</span>
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
                <MoreInfoModal ref="moreInfo" entity={entity} />
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
                isMember
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

export default graphql(Query, {
    options: (ownProps) => {
        return {
            variables: {
                guid: ownProps.params.guid
            }
        }
    }
})(Item)