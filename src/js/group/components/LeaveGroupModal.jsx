import React from "react"
import { graphql } from "react-apollo"
import { logErrors } from "../../lib/helpers"
import gql from "graphql-tag"
import Modal from "../../core/components/NewModal"
import Errors from "../../core/components/Errors"
import autobind from "autobind-decorator"

class LeaveGroupForm extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            errors: []
        }
    }

    @autobind
    onSubmit(e) {
        e.preventDefault()

        let input = {
            clientMutationId: 1,
            guid: this.props.entity.guid
        }

        this.props.mutate({
            variables: {
                input
            }
        }).then(({data}) => {
            if (data.leaveGroup.group.isClosed) {
                window.location = "/groups"
            } else {
                location.reload()
            }
        }).catch((errors) => {
            logErrors(errors)
            this.setState({
                errors: errors
            })
        })
    }

    render () {
        const { entity } = this.props

        return (
            <form method="POST" onSubmit={this.onSubmit}>
                <Errors errors={this.state.errors} />
                <div className="buttons ___margin-top">
                    <button className="button" type="submit">Verlaat groep</button>
                </div>
            </form>
        )
    }
}

const Mutation = gql`
    mutation LeaveGroupModal($input: leaveGroupInput!) {
        leaveGroup(input: $input) {
            group {
                guid
                ... on Group {
                    membership
                    isClosed
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
    }
`

const LeaveGroupFormWithMutation = graphql(Mutation)(LeaveGroupForm)

export default class LeaveGroupModal extends React.Component {
    @autobind
    toggle() {
        this.refs.modal.toggle()
    }

    render() {
        return (
            <Modal ref="modal" title="Groep verlaten">
                <p>Weet je zeker dat je <b>{this.props.entity.name}</b> wil verlaten?</p>
                <LeaveGroupFormWithMutation entity={this.props.entity} />
            </Modal>
        )
    }
}

