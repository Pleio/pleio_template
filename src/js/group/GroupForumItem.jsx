import React from "react"
import { graphql } from "react-apollo"
import { Link } from "react-router"
import AddButton from "../core/containers/AddButton"
import gql from "graphql-tag"
import Document from "../core/components/Document"
import ContentHeader from "../core/components/ContentHeader"
import NotFound from "../core/NotFound"
import MoreInfoModal from "./components/MoreInfoModal"
import MemberSummary from "./components/MembersSummary"
import Menu from "./components/Menu"
import QuestionList from "../questions/containers/QuestionList"
import Card from "../questions/components/Card"

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
                                <div onClick={() => this.refs.moreInfo.toggle()} />
                            </h3>
                        </div>
                        <div className="col-sm-6 end-sm">
                            <div className="buttons ___no-margin ___gutter ___hide-on-tablet">
                                <Link to="/questions/add" className="right-lg">
                                    <AddButton subtype="question" title="Stel een vraag" containerGuid={entity.guid} />
                                </Link>
                            </div>
                        </div>
                    </div>
                    <Menu params={this.props.params} />
                </ContentHeader>
                <section className="section ___grey ___grow">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-12 col-lg-4 last-lg top-lg">
                                <MemberSummary entity={entity} /> 
                            </div>
                            <div className="col-sm-12 col-lg-8">
                                <QuestionList containerGuid={entity.guid} childClass={Card} subtype="question" offset={0} limit={20} tags={[]} />
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