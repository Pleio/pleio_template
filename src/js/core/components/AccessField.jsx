import React from "react"
import PropTypes from "prop-types"
import SelectField from "./SelectField"
import { withRouter } from "react-router-dom"
import { gql, graphql } from "react-apollo"

class AccessField extends React.Component {
    render() {
        const { site } = this.context
        const { data, match } = this.props

        let options, value

        if (match.params.groupGuid) {
            if (data.loading) {
                return (
                    <div />
                )
            }

            options = data.entity.accessIds
            value = (this.props.value % 1 === 0) ? `${this.props.value}` : (this.props.write ? "0" : `${data.entity.defaultAccessId}`)
        } else {
            options = site.accessIds
            value = (this.props.value % 1 === 0) ? `${this.props.value}` : (this.props.write ? "0" : `${site.defaultAccessId}`)
        }

        if (!options) {
            return (
                <div />
            )
        }

        let selectOptions = {}
        options.forEach((option) => {
            selectOptions[`${option.id}`] = option.description
        })

        if (this.props.readOnly) {
            return (
                <span>{selectOptions[value]}</span>
            )
        }

        return (
            <SelectField name={this.props.name} options={selectOptions} value={value} />
        )
    }
}

const Query = gql`
    query AccessField($guid: Int) {
        entity(guid: $guid) {
            guid
            status
            ... on Group {
                defaultAccessId
                accessIds {
                    id
                    description
                }
            }
        }
    }
`

const Settings = {
    options: (ownProps) => {
        return {
            variables: {
                guid: ownProps.match.params.groupGuid
            }
        }
    }
}

AccessField.contextTypes = {
    site: PropTypes.object
}

export default withRouter(graphql(Query, Settings)(AccessField))