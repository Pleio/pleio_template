import React from "react"
import autobind from "autobind-decorator"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Select from "../../core/components/NewSelect"
import LoggedInButton from "../../core/components/LoggedInButton"

class AttendButtons extends React.Component {
    @autobind
    onSubmit(state) {
        const { entity } = this.props
        this.props.mutate({
            variables: {
                input: {
                    clientMutationId: 1,
                    guid: entity.guid,
                    state
                },
            },
            refetchQueries: [ "AttendeesList" ]
        })
    }

    render() {
        const { entity, viewer } = this.props

        if (entity.isAttending) {
            return (
                <Select name="attending" options={{accept: "Aanwezig", maybe: "Misschien", reject: "Afwijzen"}} onChange={this.onSubmit} value={entity.isAttending} className="___attend-select" />
            )
        } else {
            return (
                <div className="flexer ___gutter">
                    <LoggedInButton className="button" viewer={viewer} onClick={(e) => this.onSubmit("accept")}>Accepteren</LoggedInButton>
                    <LoggedInButton className="button ___grey" viewer={viewer} onClick={(e) => this.onSubmit("maybe")}>Misschien</LoggedInButton>
                    <LoggedInButton className="button ___grey" viewer={viewer} onClick={(e) => this.onSubmit("reject")}>Afwijzen</LoggedInButton>
                </div>
            )
        }
    }
}

const Mutation = gql`
    mutation AttendButtons($input: attendEventInput!) {
        attendEvent(input: $input) {
            entity {
                guid
                ... on Object {
                    isAttending
                    attendees(limit: 5) {
                        total
                        totalMaybe
                        totalReject
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
    }
`

export default graphql(Mutation)(AttendButtons)