import React from "react"
import CheckField from "../../core/components/CheckField"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

class SettingsNotifications extends React.Component {
    constructor(props) {
        super(props)

        this.onChange = this.onChange.bind(this)
        this.submit = this.submit.bind(this)
    }

    onChange(e) {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
            this.submit()
        }, 200)
    }

    submit() {
        let input = {
            clientMutationId: 1,
            guid: this.props.entity.guid,
            emailNotifications: this.refs.emailNotifications.getValue(),
        }

        if (this.refs.newsletter) {
            input['newsletter'] = this.refs.newsletter.getValue()
        }

        this.props.mutate({
            variables: {
                input
            }
        })
    }

    render() {
        const { entity } = this.props

        let newsletter
        if (window.__SETTINGS__.site['newsletter']) {
            newsletter = (
                <CheckField ref="newsletter" name="newsletter" label="Ik wil de nieuwsbrief ontvangen" onChange={this.onChange} checked={entity.getsNewsletter} />
            )
        }

        return (
            <div className="card-profile">
                <h3 className="card-profile__title">Meldingen</h3>
                <CheckField ref="emailNotifications" name="emailNotifications" label="Stuur mij meldingen per e-mail" onChange={this.onChange} checked={entity.emailNotifications} />
                {newsletter}
            </div>
        )
    }
}

const Mutation = gql`
    mutation editNotifications($input: editNotificationsInput!) {
        editNotifications(input: $input) {
            user {
                guid
                getsNewsletter
                emailNotifications
            }
        }
    }
`

export default graphql(Mutation)(SettingsNotifications)