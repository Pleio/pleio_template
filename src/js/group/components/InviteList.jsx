import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Modal from "../../core/components/NewModal"
import Form from "../../core/components/Form"
import InputField from "../../core/components/InputField"
import InviteItem from "./InviteItem"

class InviteList extends React.Component {
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

        const List = entity.invite.edges.map((invite, i) => (
            <InviteItem key={i} group={entity} user={invite.user} invited={invite.invited} />
        ))

        return (
            <div className="list-members">
                <div className="row">
                    {List}
                </div>
            </div>
        )
    }
}

const Query = gql`
    query InviteList($guid: String!, $q: String){
      entity(guid: $guid) {
        guid
        ... on Group {
          invite(q: $q) {
            edges {
                invited
                user {
                    guid
                    username
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

export default graphql(Query, Settings)(InviteList)