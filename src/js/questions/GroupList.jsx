import React from "react"
import { graphql } from "react-apollo"
import { Link } from "react-router-dom"
import gql from "graphql-tag"
import Document from "../core/components/Document"
import ContentHeader from "../core/components/ContentHeader"
import NotFound from "../core/NotFound"
import Menu from "../group/components/Menu"
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

        let add
        if (viewer.canWriteToContainer) {
            add = (
                <div className="buttons ___no-margin ___gutter ___hide-on-tablet">
                    <Link to={`questions/add`} className="right-lg">
                        <div className="button ___large ___add"><span>Stel een vraag</span></div>
                    </Link>
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
                            </h3>
                        </div>
                        <div className="col-sm-6 end-sm">
                            <div className="buttons ___no-margin ___gutter ___hide-on-tablet">
                                {add}
                            </div>
                        </div>
                    </div>
                    <Menu match={this.props.match} group={entity} />
                </ContentHeader>
                <section className="section ___grey ___grow">
                    <QuestionList containerGuid={entity.guid} childClass={Card} subtype="question" offset={0} limit={20} tags={[]} match={this.props.match} />
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
            canWriteToContainer(containerGuid: $guid, type: object, subtype: "question")
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