import React from "react"
import Errors from "../../core/components/Errors"
import autobind from "autobind-decorator"
import GroupNotificationSetting from "./GroupNotificationSetting"

export default class SettingsGroupNotifications extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            errors: []
        }
    }

    @autobind
    setErrors(errors) {
        this.setState({ errors })
    }

    render() {
        const { entity, groups } = this.props

        if (groups.total === 0) {
            return (
                <div />
            )
        }

        const groupList = groups.edges.map((group) => (
            <GroupNotificationSetting key={group.guid} group={group} setErrors={this.setErrors} />
        ))

        return (
            <div className="card-profile">
                <h3 className="card-profile__title">Groepsmeldingen</h3>
                <Errors errors={this.state.errors} />
                <div className="row">
                    {groupList}
                </div>
            </div>
        )
    }
}
