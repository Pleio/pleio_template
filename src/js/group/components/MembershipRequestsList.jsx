import React from "react"
import MembershipRequestItem from "./MembershipRequestItem"
import autobind from "autobind-decorator"
import { graphql, compose } from "react-apollo"
import gql from "graphql-tag"
import { logErrors } from "../../lib/helpers"
import Errors from "../../core/components/Errors"

class MembershipRequestsList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            errors: []
        }
    }

    @autobind
    onAccept(user) {
        const { entity } = this.props.data

        this.props.accept({
            variables: {
                input: { clientMutationId: 1, userGuid: user.guid, groupGuid: entity.guid },
            },
            refetchQueries: ["MembersList", "GroupItem"]
        }).catch((errors) => {
            logErrors(errors)
            this.setState({ errors: errors })
        })
    }

    @autobind
    onReject(user) {
        const { entity } = this.props.data

        if (!confirm("Weet je zeker dat je deze aanvraag wil verwijderen?")) {
            return
        }

        this.props.reject({
            variables: {
                input: { clientMutationId: 1, userGuid: user.guid, groupGuid: entity.guid }
            }
        }).catch((errors) => {
            logErrors(errors)
            this.setState({ errors: errors })
        })
    }

    render() {
        const { entity } = this.props.data

        if (!entity) {
            return (
                <div />
            )
        }

        const list = entity.membershipRequests.edges.map((user, i) => (
            <MembershipRequestItem
                key={i}
                group={entity}
                user={user}
                onAccept={(e) => this.onAccept(user)}
                onReject={(e) => this.onReject(user)}
            />
        ))

        let placeholder
        if (list.length === 0) {
            placeholder = "Er zijn geen openstaande toegangsaanvragen gevonden."
        }

        let errors
        if (this.state.errors) {
            errors = ( <Errors errors={this.state.errors} /> );
        }

        return (
            <div className="list-members" style={{height: "300px"}}>
                {placeholder}
                {errors}
                {list}
            </div>
        )
    }
}

const Query = gql`
    query MembershipRequestsList($guid: Int!){
        entity(guid: $guid) {
            guid
            ... on Group {
                membershipRequests {
                    total
                    edges {
                        guid
                        username
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
                guid: ownProps.group.guid,
                q: ownProps.q
            }
        }
    }
}

const AcceptMutation = gql`
    mutation MembershipRequestsList($input: acceptMembershipRequestInput!) {
        acceptMembershipRequest(input: $input) {
            group {
                guid
                name
                membershipRequests {
                    total
                    edges {
                        guid
                        username
                        name
                        icon
                    }
                }
            }
        }
    }
`

const RejectMutation = gql`
    mutation MembershipRequestsList($input: rejectMembershipRequestInput!) {
        rejectMembershipRequest(input: $input) {
            group {
                guid
                name
                membershipRequests {
                    total
                    edges {
                        guid
                        username
                        name
                        icon
                    }
                }
            }
        }
    }
`

export default compose(
    graphql(Query, Settings),
    graphql(AcceptMutation, { name: 'accept' }),
    graphql(RejectMutation, { name: 'reject' })
)(MembershipRequestsList)