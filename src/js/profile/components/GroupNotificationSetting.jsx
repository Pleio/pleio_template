import React from "react"
import autobind from "autobind-decorator"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { logErrors } from "../../lib/helpers"
import SwitchField from "../../core/components/SwitchField"

class GroupNotificationSetting extends React.Component {
    constructor(props) {
        super(props)
    }

    @autobind
    onChange(value) {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
            this.submit()
        }, 200)
    }

    @autobind
    submit() {
        const { group } = this.props

        let input = {
            clientMutationId: 1,
            guid: group.guid,
            getsNotifications: this.refs.switch.getValue(),
        }

        this.props.mutate({
            variables: {
                input
            }
        }).catch((errors) => {
            logErrors(errors)
            this.props.setErrors(errors)
        })
    }

    render() {
        const { group } = this.props

        return (
            <div className="col-md-4 col-sm-6">
                <SwitchField ref="switch" name={group.name} label={group.name} value={group.getsNotifications} onChange={this.onChange} disabled={this.props.disabled} />
            </div>
        )
    }
}

const Mutation = gql`
    mutation editGroupNotifications($input: editGroupNotificationsInput!) {
        editGroupNotifications(input: $input) {
            group {
                guid
                getsNotifications
            }
        }
    }
`

export default graphql(Mutation)(GroupNotificationSetting)