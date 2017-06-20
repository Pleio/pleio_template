import React from "react"
import Modal from "../../core/components/NewModal"
import InviteAutoComplete from "./InviteAutoComplete"
import InviteList from "./InviteList"
import autobind from "autobind-decorator"
import { Set } from "immutable"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { logErrors } from "../../lib/helpers"
import Errors from "../../core/components/Errors"
import classnames from "classnames"

class InviteForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = { users: new Set() }
    }

    @autobind
    onSelect(user) {
        this.setState({ completed: false, users: this.state.users.add(user) })
    }

    @autobind
    onDeselect(user) {
        this.setState({ users: this.state.users.delete(user) })
    }

    @autobind
    onSubmit(e) {
        e.preventDefault()

        if (this.state.users.size === 0) {
            return
        }

        const { group } = this.props

        const input = {
            clientMutationId: 1,
            guid: group.guid,
            users: this.state.users.toJS().map((user) => ({guid: user.guid, email: user.email}))
        }

        this.props.mutate({
            variables: {
                input
            }
        }).then(({data}) => {
            this.setState({
                users: new Set(),
                completed: true
            })
        }).catch((errors) => {
            logErrors(errors)
            this.setState({
                errors: errors
            })
        })
    }

    render () {
        const { group } = this.props

        let list
        if (this.state.completed) {
            list = (
                "De gebruikers zijn succesvol uitgenodigd."
            )
        } else {
            list = (
                <InviteList group={group} users={this.state.users} onDeselect={this.onDeselect} />
            )
        }

        return (
            <form method="POST" onSubmit={this.onSubmit}>
                <Errors errors={this.state.errors} />
                <InviteAutoComplete group={group} onSelect={this.onSelect} />
                {list}
                <div className="buttons ___end ___margin-top">
                    <button className={classnames({"button": true, "___grey": this.state.users.size === 0})} type="submit">Uitnodigen</button>
                </div>
            </form>
        )
    }
}

const Mutation = gql`
    mutation InviteItem($input: inviteToGroupInput!){
      inviteToGroup(input: $input) {
        group {
            ... on Group {
                guid
            }
        }
      }
    }
`

const InviteFormWithMutation = graphql(Mutation)(InviteForm)


export default class InviteModal extends React.Component {
    @autobind
    toggle() {
        this.refs.modal.toggle()
    }

    render() {
        return (
            <Modal ref="modal" title="Leden uitnodigen">
                <div className="group-info">
                    <div className="group-info__content">
                        <InviteFormWithMutation group={this.props.entity} />
                    </div>
                </div>
            </Modal>
        )
    }
}