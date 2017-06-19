import React from "react"
import Modal from "../core/components/Modal"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import autobind from "autobind-decorator"
import Form from "../core/components/Form"
import { getQueryVariable, logErrors } from "../lib/helpers"
import Errors from "../core/components/Errors"


class Invitations extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            errors: []
        }
    }

    @autobind
    onClose(e) {
        this.props.history.push("/groups")
    }

    @autobind
    onSubmit(e) {
        const input = {
            clientMutationId: 1,
            code: getQueryVariable("invitecode")
        }

        this.props.mutate({
            variables: {
                input
            }
        }).then(({data}) => {
            const { group } = data.acceptGroupInvitation
            this.props.history.push(group.url)
        }).catch((errors) => {
            logErrors(errors)
            this.setState({
                errors: errors
            })
        })
    }

    render() {
        return (
            <Modal ref="modal" title="Uitnodiging accepteren" noParent={true} onClose={this.onClose}>
                <Form onSubmit={this.onSubmit}>
                    <Errors errors={this.state.errors} />
                    Weet je zeker dat je de uitnodiging voor deze groep wil accepteren?
                    <div className="buttons ___margin-top">
                        <button className="button" type="submit">Accepteren</button>
                    </div>
                </Form>
            </Modal>
        )
    }
}

const Mutation = gql`
    mutation Invitations($input: acceptGroupInvitationInput!) {
        acceptGroupInvitation(input: $input) {
            group {
                guid
                ... on Group {
                    name
                    plugins
                    description
                    icon
                    isClosed
                    url
                    canEdit
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
    }
`

export default graphql(Mutation)(Invitations)