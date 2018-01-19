import React from "react"
import Modal from "../../core/components/NewModal"
import Form from "../../core/components/Form"
import InputField from "../../core/components/InputField"
import RichTextField from "../../core/components/RichTextField"
import autobind from "autobind-decorator"
import { Set } from "immutable"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { logErrors } from "../../lib/helpers"
import { stateToHTML } from "draft-js-export-html"
import Errors from "../../core/components/Errors"
import classnames from "classnames"

class SendMessageForm extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            completed: false,
            working: false,
            errors: []
        }
    }

    @autobind
    sendTestMessage(e) {
        e.preventDefault()

        this.setState({ working: true })

        const values = this.refs.form.getValues()
        const { group, viewer } = this.props

        this.props.mutate({
            variables: {
                input: {
                    clientMutationId: 1,
                    guid: group.guid,
                    subject: `${values.subject} (test)`,
                    message: stateToHTML(values.message),
                    recipients: [viewer.user.guid]
                }
            }
        }).then(({data}) => {
            this.setState({
                working: false
            })
        }).catch((errors) => {
            logErrors(errors)
            this.setState({
                errors: errors
            })
        })
    }

    @autobind
    onSubmit(e) {
        const values = this.refs.form.getValues()
        const { group } = this.props

        this.setState({ working: true })

        this.props.mutate({
            variables: {
                input: {
                    clientMutationId: 1,
                    guid: group.guid,
                    subject: values.subject,
                    message: stateToHTML(values.message)
                }
            }
        }).then(({data}) => {
            this.setState({
                working: false,
                completed: true
            })
        }).catch((errors) => {
            logErrors(errors)
            this.setState({
                errors: errors
            })
        })
    }

    render() {
        if (this.state.completed) {
            return (
                <p>De e-mail is succesvol verstuurd.</p>
            )
        }

        let loading
        if (this.state.working) {
            loading = (
                <div className="infinite-scroll__spinner">
                    <img src="/mod/pleio_template/src/images/spinner.svg" />
                </div>
            )
        }

        return (
            <Form ref="form" className="form" method="POST" onSubmit={this.onSubmit}>
                <Errors errors={this.state.errors} />
                <p>Stuur hieronder een e-mail naar alle leden.</p>
                <InputField name="subject" type="text" className="form__input" rules="required" autofocus placeholder="Vul hier het onderwerp in..." />
                <RichTextField name="message" className="form__input" rules="required" placeholder="Vul hier het bericht in..." />
                <div className="buttons ___end ___margin-top">
                    {loading}
                    <button className="button ___line ___colored" onClick={this.sendTestMessage} disabled={this.state.working}>Verstuur test aan mij</button>
                    <button className="button" type="submit" disabled={this.state.working}>Verstuur</button>
                </div>
            </Form>
        )
    }
}

const Mutation = gql`
    mutation SendMessageModal($input: sendMessageToGroupInput!){
        sendMessageToGroup(input: $input) {
        group {
            ... on Group {
                guid
            }
        }
      }
    }
`

const SendMessageFormWithMutation = graphql(Mutation)(SendMessageForm)

export default class SendMessageModal extends React.Component {
    @autobind
    toggle() {
        this.refs.modal.toggle()
    }

    render() {
        return (
            <Modal ref="modal" title="E-mail versturen">
                <div className="group-info">
                    <div className="group-info__content">
                        <SendMessageFormWithMutation group={this.props.entity} viewer={this.props.viewer} />
                    </div>
                </div>
            </Modal>
        )
    }
}