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
            location.reload()
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
                introduction
                members(limit: 5) {
                    total
                    edges {
                        role
                        email
                        user {
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
    }
`

export default graphql(Mutation)(JoinGroupButton)