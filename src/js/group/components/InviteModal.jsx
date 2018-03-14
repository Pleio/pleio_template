import React from "react"
import Modal from "../../core/components/NewModal"
import InviteAutoComplete from "./InviteAutoComplete"
import InviteList from "./InviteList"
import InvitedList from "./InvitedList"
import autobind from "autobind-decorator"
import { Set } from "immutable"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { logErrors } from "../../lib/helpers"
import Errors from "../../core/components/Errors"
import Tabber from "../../core/components/Tabber"
import classnames from "classnames"

class InviteForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            users: new Set(),
            loading: false
        }
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

        this.setState({ loading: true })

        this.props.mutate({
            variables: {
                input
            },
            refetchQueries: ["InvitedList"]
        }).then(({data}) => {
            this.setState({
                users: new Set(),
                completed: true,
                loading: false
            })
        }).catch((errors) => {
            logErrors(errors)
            this.setState({
                errors: errors,
                loading: false
            })
        })
    }

    render () {
        const { group } = this.props

        let list
        if (this.state.completed) {
            list = (
                <div style={{paddingTop:"1em"}}>
                    De gebruikers zijn succesvol uitgenodigd.
                </div>
            )
        } else {
            list = (
                <InviteList group={group} users={this.state.users} onDeselect={this.onDeselect} />
            )
        }

        let button
        if (this.state.loading) {
            button = (
                <button className={classnames({"button": true, "___is-loading": true})} type="submit" disabled={this.state.users.size === 0}>
                    Uitnodigen
                    <div className="button__loader"></div>
                </button>
            )
        } else {
            button = (
                <button className={classnames({"button": true})} type="submit" disabled={this.state.users.size === 0}>
                    Uitnodigen
                </button>
            )
        }

        return (
            <form method="POST" onSubmit={this.onSubmit}>
                <Errors errors={this.state.errors} />
                <InviteAutoComplete group={group} onSelect={this.onSelect} />
                {list}
                <div className="buttons ___end ___margin-top">
                    {button}
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
        const items = [
            { title: "Nieuwe leden", content: <InviteFormWithMutation group={this.props.entity} /> },
            { title: "Reeds uitgenodigd", content: <InvitedList group={this.props.entity} /> }
        ]

        return (
            <Modal ref="modal" title="Leden uitnodigen">
                <div className="group-info">
                    <div className="group-info__content">
                        <Tabber items={items} />
                    </div>
                </div>
            </Modal>
        )
    }
}