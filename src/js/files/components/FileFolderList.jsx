import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import autobind from "autobind-decorator"
import FileFolder from "./FileFolder"
import { OrderedSet } from "immutable"

class FileFolderList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            selected: new OrderedSet()
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps !== this.props) {
            this.clearSelection()
        }
    }

    getChildContext() {
        const { entity } = this.props.data

        return {
            onCheck: this.onCheck,
            clearSelection: this.clearSelection,
            selected: this.state.selected,
            group: entity
        }
    }

    @autobind
    onCheck(entity, checked) {
        let newState
        if (checked) {
            newState = this.state.selected.add(entity)
        } else {
            newState = this.state.selected.delete(entity)
        }

        this.setState({
            selected: newState
        })
    }

    @autobind
    selectAll() {
        this.setState({

        })
    }

    @autobind
    clearSelection() {
        this.setState({ selected: new OrderedSet() })

    }

    @autobind
    downloadFiles() {
        if (this.state.selected.size === 0) {
            return
        }

        let params = []
        this.state.selected.forEach((item) => {
            switch (item.subtype) {
                case "folder":
                    params.push(`folder_guids[]=${item.guid}`)
                    break
                case "file":
                    params.push(`file_guids[]=${item.guid}`)
            }
        })

        window.location = `/bulk_download?${params.join("&")}`
    }

    render() {
        const { data } = this.props

        if (!data.entities) {
            return (
                <div />
            )
        }

        const items = data.entities.edges.map((item, i) => (
            <FileFolder key={i} subtype={this.props.subtype} entity={item} />
        ))

        return (
            <tbody ref="infiniteScroll">
                {items}
            </tbody>
        )
    }
}

const Query = gql`
    query FilesList($subtype: String, $containerGuid: Int, $offset: Int!, $limit: Int!) {
        entities(subtype: "file|folder", containerGuid: $containerGuid, offset: 0, limit: 500) {
            total
            canWrite
            edges {
                guid
                ... on Object {
                    subtype
                    title
                    url
                    timeCreated
                    canEdit
                    owner {
                        guid
                        name
                    }
                }
            }
        }
    }
`

export default graphql(Query)(FileFolderList)