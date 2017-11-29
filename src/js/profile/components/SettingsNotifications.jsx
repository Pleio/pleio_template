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
        setTimeout(() => {
            this.submit()
        }, 10)
    }

    submit() {
        this.props.mutate({
            variables: {
                input: {
                    clientMutationId: 1,
                    guid: this.props.entity.guid,
                    emailNotifications: this.refs.emailNotifications.getValue(),
                    newsletter: this.refs.newsletter.getValue()
                }
            }
        })
    }

    render() {
        const { entity } = this.props

        return (
            <div className="card-profile">
                <h3 className="card-profile__title">Meldingen</h3>
                <CheckField ref="emailNotifications" name="emailNotifications" label="Stuur mij meldingen per e-mail" onChange={this.onChange} checked={entity.emailNotifications} />
                <CheckField ref="newsletter" name="newsletter" label="Ik wil de nieuwsbrief ontvangen" onChange={this.onChange} checked={entity.getsNewsletter} />
            </div>
        )
    }
}

const Query = gql`
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

export default graphql(Query)(SettingsNotifications)