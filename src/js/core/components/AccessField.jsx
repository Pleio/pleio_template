import React from "react"
import PropTypes from "prop-types"
import SelectField from "./SelectField"

class AccessField extends React.Component {
    render() {
        const { group, site } = this.context

        let options, value

        if (group) {
            options = group.accessIds
            value = this.props.value || group.defaultAccessId
        } else {
            options = site.accessIds
            value = this.props.value || site.defaultAccessId
        }

        if (!options) {
            return (
                <div />
            )
        }

        let selectOptions = {}
        options.forEach((option) => {
            selectOptions[option.id] = option.description
        })

        return (
            <SelectField name={this.props.name} options={selectOptions} value={value} />
        )
    }
}

AccessField.contextTypes = {
    site: PropTypes.object,
    group: PropTypes.object
}

export default AccessField