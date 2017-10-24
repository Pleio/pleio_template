import React from "react"
import InviteItem from "./InviteItem"
import autobind from 'autobind-decorator'
import { graphql, compose } from "react-apollo"
import gql from "graphql-tag"

class InvitedList extends React.Component {

    @autobind
    onResend(invite) {
        this.props.resend({
            variables: {
                input: { clientMutationId: 1, id: invite.id }
            }
        })    
    }

    @autobind
    onDeselect(invite) {
        this.props.delete({
            variables: {
                input: { clientMutationId: 1, id: invite.id }
            }
        })
    }

    render() {
        const { data, group } = this.props

        if (!data.entity) {
            return (
                <div />
            )
        }

        const list = data.entity.invited.edges.map((invite, i) => (
            <InviteItem
                key={i}
                group={group}
                user={invite.user || {name: invite.email, email: invite.email}} 
                timeCreated={invite.timeCreated}
                invited
                onResend={(e) => this.onResend(invite)}
                onDeselect={(e) => this.onDeselect(invite)}
            />
        ))

        let placeholder
        if (list.length === 0) {
            placeholder = "Er zijn geen openstaande uitnodigingen gevonden."
        }

        return (
            <div className="list-members" style={{height: "300px"}}>
                {placeholder}
                {list}
            </div>
        )
    }
}

const Query = gql`
    query InvitedList($guid: Int!){
        entity(guid: $guid) {
            guid
            ... on Group {
                invited {
                    total
                    edges {
                        id
                        invited
                        timeCreated
                        email
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

const ResendMutation = gql`
    mutation InvitedList($input: resendGroupInvitationInput!) {
        resendGroupInvitation(input: $input) {
            group {
                guid
                name
                invited {
                    total
                    edges {
                        id
                        invited
                        timeCreated
                        email
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

const DeleteMutation = gql`
    mutation InvitedList($input: deleteGroupInvitationInput!) {
        deleteGroupInvitation(input: $input) {
            group {
                guid
                name
                invited {
                    total
                    edges {
                        id
                        invited
                        timeCreated
                        email
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

export default compose(
    graphql(Query, Settings),
    graphql(ResendMutation, { name: 'resend' }),
    graphql(DeleteMutation, { name: 'delete' })
)(InvitedList)