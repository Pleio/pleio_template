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
            <div key={i} className="col-sm-6">
                <MemberItem member={member} />
            </div>
        ))

        return (
            <div className="list-members">
                <div className="row">
                    {members}
                </div>
            </div>
        )
    }
}

const Query = gql`
    query MembersList($guid: String!){
      entity(guid: $guid) {
        guid
        ... on Group {
          members {
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