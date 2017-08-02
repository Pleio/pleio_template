import React from "react"
import PropTypes from "prop-types"
import { graphql } from "react-apollo"
import { Link } from "react-router-dom"
import gql from "graphql-tag"
import classnames from "classnames"
import GroupContainer from "../group/components/GroupContainer"
import Document from "../core/components/Document"
import FileFolderList from "./containers/FileFolderList"
import FileFolder from "./components/FileFolder"
import AddFileModal from "./components/AddFileModal"
import AddFolderModal from "./components/AddFolderModal"
import EditFileFolderModal from "./components/EditFileFolderModal"
import DeleteFileFolderModal from "./components/DeleteFileFolderModal"
import { Set } from "immutable"

class Item extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            selected: new Set()
        }

        this.onCheck = this.onCheck.bind(this)
        this.clearSelection = this.clearSelection.bind(this)
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

    clearSelection() {
        this.setState({ selected: new Set() })
    }

    render() {
        const { match } = this.props
        const { entity, viewer } = this.props.data

        if (!entity) {
            // Loading...
            return (
                <div></div>
            )
        }

        if (entity.status == 404) {
            return (
                <NotFound />
            )
        }

        let actions, edit, add
        if (viewer.canWriteToContainer) {
            add = (
                <div className="buttons ___no-margin ___gutter ___hide-on-tablet">
                    <div className="button ___large ___add" onClick={(e) => this.refs.addFile.toggle()}><span>Bestand toevoegen</span></div>
                    <div className="button ___large ___add" onClick={(e) => this.refs.addFolder.toggle()}><span>Map toevoegen</span></div>
                </div>
            )
        }

        if (this.state.selected.size === 1) {
            edit = (
                <a href="#" onClick={() => this.refs.edit.toggle()}>Wijzigen</a>
            )
        }

        if (this.state.selected.size > 0) {
            actions = (
                <div className="row file__item">
                    <div className="col-sm-12">
                        {this.state.selected.size} {this.state.selected.size > 1 ? "items" : "item"} geselecteerd.
                        &nbsp;<b>{edit}</b>&nbsp;
                        <a href="#" onClick={() => this.refs.delete.toggle()}><b>Verwijderen</b></a>
                    </div>
                </div>
            )
        } else {
            actions = (
                <div className="row file__item">
                    <div className="col-sm-8">Bestandsnaam</div>
                    <div className="col-sm-2">Aanmaakdatum</div>
                    <div className="col-sm-2">Eigenaar</div>
                </div>
            )
        }

       const buttons = (
            <div className="flexer ___gutter ___top">
                {add}
            </div>
        )

        const containerGuid = match.params.containerGuid ? match.params.containerGuid : match.params.groupGuid

        return (
            <GroupContainer buttons={buttons} match={this.props.match}>
                <Document title={entity.name} />
                <div className="container">
                    {actions}
                    <FileFolderList containerGuid={containerGuid} containerClassName="" rowClassName="row file__item" childClass={FileFolder} offset={0} limit={50} type="object" subtype="file|folder" selected={this.state.selected} history={this.props.history} />
                </div>
                <AddFileModal ref="addFile" containerGuid={containerGuid} onComplete={this.clearSelection} />
                <AddFolderModal ref="addFolder" containerGuid={containerGuid} onComplete={this.clearSelection} />
                <EditFileFolderModal ref="edit" entity={this.state.selected.first()} onComplete={this.clearSelection} />
                <DeleteFileFolderModal ref="delete" entities={this.state.selected} onComplete={this.clearSelection} />
            </GroupContainer>
        )
    }
}

Item.childContextTypes = {
    onCheck: PropTypes.func,
    clearSelection: PropTypes.func,
    selected: PropTypes.object,
    group: PropTypes.object
}

const Query = gql`
    query GroupItem($guid: String!) {
        viewer {
            guid
            loggedIn
            canWriteToContainer(containerGuid: $guid, subtype: "file")
            user {
                guid
                name
                icon
                url
            }
        }
        entity(guid: $guid) {
            guid
            status
            ... on Group {
                guid
                name
                description
                plugins
                icon
                isClosed
                members(limit: 5) {
                    total
                    edges {
                        role
                        email
                        user {
                            guid
                            username
                            url
                            name
                            icon
                        }
                    }
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

export default graphql(Query, Settings)(Item)