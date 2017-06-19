import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { logErrors } from "../../lib/helpers"

class JoinGroupButton extends React.Component {
    constructor(props) {
        super(props)
        this.onClick = this.onClick.bind(this)
    }

    onClick(e) {
        let input = {
            clientMutationId: 1,
            guid: this.props.entity.guid
        }

        this.props.mutate({
            variables: {
                input
            }
        }).then(({data}) => {
            // do nothing
        }).catch((errors) => {
            logErrors(errors)
            this.setState({
                errors: errors
            })
        })
    }

    render() {
        return (
            <div className="button ___large" onClick={this.onClick}>
                Lid worden
            </div>
        )
    }
}

const Mutation = gql`
    mutation JoinGroupButton($input: joinGroupInput!) {
        joinGroup(input: $input) {
            group {
                guid
                membership
                members(limit: 5) {
                    total
                    edges {
                        guid
                        name
                        icon
                        url
                    }
                }
            }
        }
    }
`

export default graphql(Mutation)(JoinGroupButton)