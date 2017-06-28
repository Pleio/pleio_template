import React from "react"
import autobind from "autobind-decorator"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

class AttendButtons extends React.Component {
    @autobind
    onSubmit(state) {
        const { entity } = this.props
        this.props.mutate({
            input: {
                guid: entity.guid,
                state
            }
        })
    }

    render() {
        return (
            <div className="flexer ___gutter">
                <button className="button" onClick={(e) => this.onSubmit("accept")}>Accepteren</button>
                <button className="button ___grey" onClick={(e) => this.onSubmit("maybe")}>Misschien</button>
                <button className="button ___line" onClick={(e) => this.onSubmit("reject")}>Afwijzen</button>
            </div>
        )
    }
}

const Mutation = gql`
    mutation AttendButtons($input: attendEventInput!) {
        attendEvent(input: $input) {
            object {
                guid
            }
        }
    }
`

export default graphql(Mutation)(AttendButtons)