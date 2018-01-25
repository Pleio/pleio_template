import React from "react"
import Select from "../../core/components/NewSelect"

export default class GroupNotificationSetting extends React.Component {
    render() {
        const { group } = this.props

        return (
            <div className="col-md-4 col-sm-6">
                <Select name={group.name} label={group.name} options={[]} />
            </div>
        )
    }
}