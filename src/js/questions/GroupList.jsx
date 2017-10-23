import React from "react"
import { graphql } from "react-apollo"
import { Link } from "react-router-dom"
import gql from "graphql-tag"
import GroupContainer from "../group/components/GroupContainer"
import Document from "../core/components/Document"
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
                        <div className="button ___large ___add"><span>Start een discussie</span></div>
                    </Link>
                </div>
            )
        }

        const buttons = (
            <div className="flexer ___gutter ___top">
                {add}
            </div>
        )

        return (
            <GroupContainer buttons={buttons} match={this.props.match}>
                <Document title={entity.name} />
                <section className="section ___grow">
                    <QuestionList containerGuid={entity.guid} childClass={Card} subtype="question" offset={0} limit={20} tags={[]} match={this.props.match} />
                </section>
            </GroupContainer>
        )
    }
}

const Query = gql`
    query GroupItem($guid: Int!) {
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
                        role
                        email
                        user {
                            guid
                            username
                            url
                            name
                            icon
                        }
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