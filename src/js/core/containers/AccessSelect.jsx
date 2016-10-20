import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Select from "../components/Select"

class AccessSelect extends React.Component {
    render() {
        let defaultValue
        let options

        if (this.props.data.site) {
            defaultValue = this.props.data.site.defaultAccessId

            options = this.props.data.site.accessIds.map((a) => (
                <option key={a.id} value={a.id}>{a.description}</option>
            ))
        }

        return (
            <select defaultValue={defaultValue} {...this.props}>
                {options}
            </select>
        )
    }
}

const QUERY = gql`
    query AccessSelect {
        site {
            guid
            defaultAccessId
            accessIds {
                id
                description
            }
        }
    }
`

export default graphql(QUERY)(AccessSelect)
