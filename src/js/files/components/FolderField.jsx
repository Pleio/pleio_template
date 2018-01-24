import React from "react"
import autobind from "autobind-decorator"
import classnames from "classnames"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import PropTypes from "prop-types"
import { Set } from "immutable"

class OpenFolderWithoutQuery extends React.Component {
    render() {
        const { files } = this.props.data

        let contents
        if (files) {
            contents = files.edges.map((item) => {
                if (!this.props.excludeGuids.contains(item.guid)) {
                    return (
                        <Folder
                            key={item.guid}
                            guid={item.guid}
                            title={item.title}
                            subtype={item.subtype}
                            mimeType={item.mimeType}
                            onSelect={this.props.onSelect}
                            selected={this.props.selected}
                            excludeGuids={this.props.excludeGuids}
                            showFiles={this.props.showFiles}
                        ><span>{item.title}</span></Folder>
                    )
                }
            })
        }

        return (
            <div className={classnames({
                    "tree-view__folder ___is-open": true,
                    "___selected": this.props.selected ? (this.props.selected.guid == this.props.guid) : false,
                    "___is-file": this.props.subtype === "file"
            })}>
                <span onClick={this.props.onClick}>{this.props.title}</span>
                {contents}
            </div>
        )
    }
}

const Query = gql`
    query FilesList($guid: String, $filter: String) {
        files(containerGuid: $guid, filter: $filter) {
            edges {
                guid
                ... on Object {
                    hasChildren
                    title
                    subtype
                    url
                    mimeType
                }
            }
        }
    }
`

const Settings = {
    options: (ownProps) => {
        return {
            variables: {
                guid: ownProps.guid,
                filter: !ownProps.showFiles ? "folders" : ""
            }
        }
    }
}


const OpenFolder = graphql(Query, Settings)(OpenFolderWithoutQuery)

class ClosedFolder extends React.Component {
    render() {
        return (
            <div className={classnames({
                "tree-view__folder": true,
                "___is-file": (this.props.subtype === "file"),
                "___selected": this.props.selected ? (this.props.selected.guid == this.props.guid) : false
            })}>
                <span onClick={this.props.onClick}>{this.props.title}</span>
            </div>
        )
    }
}

class Folder extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isOpen: this.props.isOpen || false
        }
    }

    @autobind
    onClick(e) {
        this.setState({ isOpen: !this.state.isOpen })
        this.props.onSelect(this.props)
    }

    render() {
        let contents
        if (this.state.isOpen) {
            return (
                <OpenFolder
                    guid={this.props.guid}
                    title={this.props.title}
                    subtype={this.props.subtype}
                    mimeType={this.props.mimeType}
                    onClick={this.onClick}
                    onSelect={this.props.onSelect}
                    selected={this.props.selected}
                    excludeGuids={this.props.excludeGuids}
                    showFiles={this.props.showFiles}
                />
            )
        } else {
            return (
                <ClosedFolder
                    guid={this.props.guid}
                    title={this.props.title}
                    subtype={this.props.subtype}
                    mimeType={this.props.mimeType}
                    onClick={this.onClick}
                    onSelect={this.props.onSelect}
                    selected={this.props.selected}
                    excludeGuids={this.props.excludeGuids}
                    showFiles={this.props.showFiles}
                />
            )
        }
    }
}

class FolderField extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            selected: null
        }
    }

    componentWillReceiveProps(nextProps) {
        const excludeGuidsChanged = !(new Set(nextProps.excludeGuids).equals(new Set(this.props.excludeGuids)))
        if (nextProps.containerGuid !== this.props.containerGuid || excludeGuidsChanged) {
            this.setState({ selected: null })
        }
    }

    componentWillMount() {
        if (this.context.attachToForm) {
            this.context.attachToForm(this)
        }
    }

    componentWillUnmount() {
        if (this.context.detachFromForm) {
            this.context.detachFromForm(this)
        }
    }

    @autobind
    getValue() {
        return this.state.selected ? this.state.selected.guid : null
    }

    @autobind
    getRichValue() {
        const { selected } = this.state

        if (!selected) {
            return null
        }

        return {
            guid: selected.guid,
            name: selected.title,
            mimeType: selected.mimeType,
            url: `/file/download/${selected.guid}`
        }
    }

    @autobind
    clearValue() {
        this.setState({ selected: null })
    }

    @autobind
    isValid() {
        return this.state.selected ? true : false
    }

    @autobind
    onSelect(item) {
        this.setState({ selected: item })
    }

    render() {
        return (
            <div className="tree-view">
                <Folder
                    title="Hoofdmap"
                    guid={this.props.containerGuid}
                    isOpen={true}
                    onSelect={this.onSelect}
                    selected={this.state.selected}
                    excludeGuids={new Set(this.props.excludeGuids)}
                    showFiles={this.props.showFiles}
                />
            </div>
        )
    }
}

FolderField.contextTypes = {
    attachToForm: PropTypes.func,
    detachFromForm: PropTypes.func
}

export default FolderField