import React from "react"
import Form from "../../../core/components/Form"
import TextField from "../../../core/components/TextField"
import { convertToRaw } from "draft-js"
import autobind from "autobind-decorator"
import { loadScript } from "../../../lib/helpers"
import ActivityList from "../../../activity/containers/ActivityList"
import Card from "../../../activity/components/Card"

export default class Activity extends React.Component {
    @autobind
    getSetting(key, defaultValue) {
        const { entity } = this.props

        let value = defaultValue || ""
        entity.settings.forEach((setting) => {
            if (setting.key === key) {
                value = setting.value
            }
        })

        return value
    }

    @autobind
    onSave() {

    }

    render() {
        const { entity, isEditing } = this.props

        return (
            <ActivityList containerClassName="" childClass={Card} offset={0} limit={20} />
        )
    }
}