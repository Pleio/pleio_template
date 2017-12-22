import React from "react"
import { graphql } from "react-apollo"
import { Link } from "react-router-dom"
import gql from "graphql-tag"
import Modal from "../../core/components/NewModal"
import Form from "../../core/components/Form"
import MemberItem from "./MemberItem"
import classnames from "classnames"
import autobind from "autobind-decorator"

let isFetchingMore = false

class MembersList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            offset: 0
        }
    }

    @autobind
    onScroll(e) {
        if (!this.refs.list) {
            return
        }

        if (this.props.data.loading || isFetchingMore) {
            return
        }

        if (this.props.data.entity.members.total === 0) {
            return
        }

        if (this.props.data.entity.members.total === this.props.data.entity.members.edges.length) {
            return
        }

        if ((e.target.scrollHeight - (e.target.scrollTop + e.target.offsetHeight)) > 200) {
            return
        }

        isFetchingMore = true
        this.fetchMore()
    }

    @autobind
    fetchMore() {
        let offset = this.state.offset + 20

        this.setState({
            offset
        })

        this.props.data.fetchMore({
            variables: { offset },
            updateQuery: (previousResult, { fetchMoreResult }) => {
                isFetchingMore = false

                return Object.assign({}, previousResult, {
                    entity: Object.assign({}, previousResult.entity, {
                        members: Object.assign({}, previousResult.entity.members, {
                            edges: [...previousResult.entity.members.edges, ...fetchMoreResult.entity.members.edges]
                        })
                    })
                });
            }
        })
    }

    render () {
        const { entity } = this.props.data

        if (!entity) {
            // Loading...
            return (
                <div></div>
            )
        }

        const members = entity.members.edges.map((member, i) => (
            <MemberItem key={member.user.guid} group={entity} member={member} editable={entity.canEdit} />
        ))

        let placeholder
        if (members.length === 0) {
            placeholder = "Er zijn geen leden gevonden."
        }

        return (
            <div ref="list" onScroll={this.onScroll} className={classnames({"list-members": true, "___scrollable": this.props.scrollable})}>
                {placeholder}
                {members}
            </div>
        )
    }
}

const Query = gql`
    query MembersList($guid: Int!, $q: String, $offset: Int) {
        entity(guid: $guid) {
            ... on Group {
                guid
                canEdit
                members(q: $q, offset: $offset, limit: 20) {
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
                guid: ownProps.entity.guid,
                q: ownProps.q
            }
        }
    }
}

export default graphql(Query, Settings)(MembersList)