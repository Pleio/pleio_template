import React from "react"
import { graphql } from "react-apollo"
import { Link } from "react-router-dom"
import gql from "graphql-tag"
import classnames from "classnames"
import autobind from "autobind-decorator"
import SubgroupItem from "./SubgroupItem"

let isFetchingMore = false

class SubgroupsList extends React.Component {
    render () {
        const { entity } = this.props.data

        if (!entity) {
            // Loading...
            return (
                <div></div>
            )
        }

        const subgroups = entity.subgroups.edges.map((subgroup) => {
            return (
                <SubgroupItem
                    key={subgroup.id}
                    group={entity}
                    subgroup={subgroup}
                    editSubgroup={this.props.editSubgroup}
                />
            )
        })

        let placeholder
        if (subgroups.length === 0) {
            placeholder = "Er zijn geen subgroepen gevonden."
        }

        return (
            <div ref="list" onScroll={this.onScroll} className={classnames({"list-members": true, "___scrollable": this.props.scrollable})}>
                {placeholder}
                {subgroups}
            </div>
        )
    }
}

const Query = gql`
    query SubgroupsList($guid: Int!) {
        entity(guid: $guid) {
            ... on Group {
                guid
                subgroups {
                    total
                    edges {
                        id
                        name
                        members {
                            guid
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
                guid: ownProps.entity.guid
            }
        }
    }
}

export default graphql(Query, Settings)(SubgroupsList)