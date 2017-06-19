import React from "react"
import { graphql } from "react-apollo"
import { Link } from "react-router-dom"
import gql from "graphql-tag"
import Modal from "../../core/components/NewModal"
import Form from "../../core/components/Form"
import MemberItem from "./MemberItem"

class MembersList extends React.Component {
    constructor(props) {
        super(props)
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
            <MemberItem key={i} member={member} editable={entity.canEdit} />
        ))

        let placeholder
        if (members.length === 0) {
            placeholder = "Er zijn geen leden gevonden."
        }

        return (
            <div className="list-members">
                {placeholder}
                {members}
            </div>
        )
    }
}

const Query = gql`
    query MembersList($guid: String!, $q: String) {
        entity(guid: $guid) {
            guid
            ... on Group {
                canEdit
                members(q: $q) {
                    edges {
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