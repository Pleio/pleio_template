import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Modal from "../../core/components/NewModal"
import Form from "../../core/components/Form"
import InputField from "../../core/components/InputField"
import InviteItem from "./InviteItem"

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

class InviteAutoCompleteList extends React.Component {
    render () {
        const { entity } = this.props.data

        if (!entity) {
            // Loading...
            return (
                <div></div>
            )
        }

        const list = entity.invite.edges.map((invite, i) => (
            <InviteItem key={i} group={entity} user={invite.user} onSelect={this.props.onSelect} />
        ))

        let email
        if (this.props.q && emailRegex.test(this.props.q)) {
            email = (
                <InviteItem group={entity} user={{name: this.props.q, email: this.props.q}} onSelect={this.props.onSelect} />
            )
        }

        let placeholder
        if (list.length === 0 && !email) {
            placeholder = "Geen resultaten gevonden."
        }

        return (
            <div>
                {placeholder}
                {list}
                {email}
            </div>
        )
    }
}

const Query = gql`
    query InviteAutoCompleteList($guid: Int!, $q: String){
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
                guid: ownProps.group.guid,
                q: ownProps.q
            }
        }
    }
}

export default graphql(Query, Settings)(InviteAutoCompleteList)