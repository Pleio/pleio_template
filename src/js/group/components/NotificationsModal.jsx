import React from "react"
import { graphql } from "react-apollo"
import { logErrors } from "../../lib/helpers"
import gql from "graphql-tag"
import Form from "../../core/components/Form"
import Modal from "../../core/components/NewModal"
import Errors from "../../core/components/Errors"
import SwitchField from "../../core/components/SwitchField"
import autobind from "autobind-decorator"

class NotificationsForm extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            errors: []
        }
    }

    @autobind
    onChange(e) {
        setTimeout(() => {
            this.onSubmit()
        }, 500)
    }

    @autobind
    onSubmit() {
        const values = this.refs.form.getValues()

        let input = {
            clientMutationId: 1,
            guid: this.props.entity.guid,
            getsNotifications: values.getsNotifications
        }

        this.props.mutate({
            variables: {
                input
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
            <Form ref="form" onChange={this.onChange} onSubmit={this.onSubmit}>
                <Errors errors={this.state.errors} />
                <div className="buttons ___margin-top">
                    <SwitchField name="getsNotifications" label="Notificaties voor deze groep ontvangen" value={entity.getsNotifications} />
                </div>
            </Form>
        )
    }
}

const Mutation = gql`
    mutation NotificationsModal($input: editGroupNotificationsInput!) {
        editGroupNotifications(input: $input) {
            group {
                guid
                ... on Group {
                    getsNotifications
                }
            }
        }
    }
`

const NotificationsFormWithMutation = graphql(Mutation)(NotificationsForm)

export default class NotificationsModal extends React.Component {
    @autobind
    toggle() {
        this.refs.modal.toggle()
    }

    render() {
        return (
            <Modal ref="modal" title="Notificatie instellingen">
                <NotificationsFormWithMutation entity={this.props.entity} toggle={this.toggle} />
            </Modal>
        )
    }
}

