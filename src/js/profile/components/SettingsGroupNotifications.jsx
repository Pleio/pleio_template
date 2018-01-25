import React from "react"
import CheckField from "../../core/components/CheckField"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

class SettingsGroupNotifications extends React.Component {
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
        const { entity, groups } = this.props

        if (groups.total === 0) {
            return (
                <div />
            )
        }

        const groupList = groups.edges.map((group) => (
            <GroupNotificationSetting group={group} />
        ))

        return (
            <div className="card-profile">
                <h3 className="card-profile__title">Groepsmeldingen</h3>
                <div className="row">
                    {groupList}
                </div>
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

export default graphql(Mutation)(SettingsGroupNotifications)