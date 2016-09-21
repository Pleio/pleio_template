import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Select from "../components/Select"

class AccessSelect extends React.Component {
    render() {
        let defaultAccessId = 0
        let options = {}

        if (this.props.data.site) {
            defaultAccessId = this.props.data.site.defaultAccessId
            this.props.data.site.accessIds.forEach(accessId => {
                options[accessId.id] = accessId.description
            })
        }


        return (
            <Select name={this.props.name} className={this.props.className} options={options} onChange={this.props.onChange} defaultValue={defaultAccessId} value={this.props.value} />
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
