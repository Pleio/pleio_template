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
            contents = files.edges.map((folder) => {
                if (!this.props.excludeGuids.contains(folder.guid)) {
                    return (
                        <Folder 
                            key={folder.guid}
                            guid={folder.guid}
                            title={folder.title}
                            onSelect={this.props.onSelect}
                            value={this.props.value}
                            excludeGuids={this.props.excludeGuids}
                        ><span>{folder.title}</span></Folder>
                    )
                }
            })
        }

        return (
            <div className={classnames({"tree-view__folder ___is-open": true, "___selected": this.props.value == this.props.guid})}>
                <span onClick={this.props.onClick}>{this.props.title}</span>
                {contents}
            </div>
        )
    }
}

const Query = gql`
    query FilesList($guid: String) {
        files(filter: "folders", containerGuid: $guid) {
            edges {
                guid
                ... on Object {
                    hasChildren
                    title
                }
            }
        }
    }
`

const OpenFolder = graphql(Query)(OpenFolderWithoutQuery)

class ClosedFolder extends React.Component {
    render() {
        return (
            <div className={classnames({"tree-view__folder": true, "___selected": this.props.value == this.props.guid})}>
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
        this.props.onSelect(this.props.guid)
    }

    render() {
        let contents
        if (this.state.isOpen) {
            return (
                <OpenFolder
                    guid={this.props.guid}
                    title={this.props.title}
                    onClick={this.onClick}
                    onSelect={this.props.onSelect}
                    value={this.props.value}
                    excludeGuids={this.props.excludeGuids}
                />
            )
        } else {
            return (
                <ClosedFolder
                    guid={this.props.guid}
                    title={this.props.title}
                    onClick={this.onClick}
                    onSelect={this.props.onSelect}
                    value={this.props.value}
                    excludeGuids={this.props.excludeGuids}
                />
            )
        }
    }
}

class FolderField extends React.Component {
    constructor(props) {
        super(props)

        this.state = { value: null }
    }
    
    componentWillReceiveProps(nextProps) {
        const excludeGuidsChanged = !(new Set(nextProps.excludeGuids).equals(new Set(this.props.excludeGuids)))
        if (nextProps.containerGuid !== this.props.containerGuid || excludeGuidsChanged) {
            this.setState({ value: null })
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
        return this.state.value
    }

    @autobind
    clearValue() {
        this.setState({ value: null })
    }

    @autobind
    isValid() {
        return this.state.value ? true : false
    }

    @autobind
    onSelect(guid) {
        this.setState({ value: guid })
    }

    render() {
        return (
            <div className="tree-view">
                <Folder title="Hoofdmap" guid={this.props.containerGuid} isOpen={true} onSelect={this.onSelect} value={this.state.value} excludeGuids={new Set(this.props.excludeGuids)} />
            </div>
        )
    }
}

FolderField.contextTypes = {
    attachToForm: PropTypes.func,
    detachFromForm: PropTypes.func
}

export default FolderField