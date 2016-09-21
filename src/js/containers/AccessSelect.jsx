import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Select from "../components/Select"

class AccessSelect extends React.Component {
    render() {
        let options = {}

        if (this.props.data.site) {
            this.props.data.site.accessIds.forEach(accessId => {
                options[accessId.id] = accessId.description
            })
        }

        let value = this.props.value
        if (value == null && this.props.data.site) {
            value = this.props.data.site.defaultAccessId
        }

        return (
            <Select name={this.props.name} className={this.props.className} options={options} onChange={this.props.onChange} value={value} />
        )
    }
}

const QUERY = gql`
    query AccessSelect {
        site {
            defaultAccessId
            accessIds {
                id
                description
            }
        }
    }
`

export default graphql(QUERY)(AccessSelect)
