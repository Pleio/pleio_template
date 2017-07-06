import React from "react"
import autobind from "autobind-decorator"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Select from "../../core/components/NewSelect"

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
                }
            }
        })
    }

    render() {
        const { entity } = this.props

        if (entity.isAttending) {
            return (
                <div className="flexer ___gutter">
                    <Select name="attending" options={{accept: "Aanwezig", maybe: "Misschien", reject: "Afwijzen"}} onChange={this.onSubmit} value={entity.isAttending} className="___attend-select" />
                </div>
            )
        } else {
            return (
                <div className="flexer ___gutter">
                    <button className="button" onClick={(e) => this.onSubmit("reject")}>Accepteren</button>
                    <button className="button ___grey" onClick={(e) => this.onSubmit("maybe")}>Misschien</button>
                    <button className="button ___line" onClick={(e) => this.onSubmit("reject")}>Afwijzen</button>
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