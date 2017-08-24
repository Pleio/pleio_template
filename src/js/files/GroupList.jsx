import React from "react"
import PropTypes from "prop-types"
import { graphql } from "react-apollo"
import { Link } from "react-router-dom"
import gql from "graphql-tag"
import classnames from "classnames"
import GroupContainer from "../group/components/GroupContainer"
import Document from "../core/components/Document"
import FileFolderList from "./containers/FileFolderList"
import Select from "../core/components/NewSelect"
import FileFolder from "./components/FileFolder"
import AddFileModal from "./components/AddFileModal"
import AddFolderModal from "./components/AddFolderModal"
import EditFileFolderModal from "./components/EditFileFolderModal"
import MoveFileFolderModal from "./components/MoveFileFolderModal"
import DeleteFileFolderModal from "./components/DeleteFileFolderModal"
import autobind from "autobind-decorator"
import { OrderedSet } from "immutable"

class Item extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            selected: new OrderedSet()
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

    componentWillReceiveProps(nextProps) {
        if (nextProps !== this.props) {
            this.clearSelection()
        }
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

        let add
        if (viewer.canWriteToContainer) {
            add = (
                <div className="flexer ___gutter ___margin-bottom">
                    <div className="button ___add ___large ___block-mobile" onClick={(e) => this.refs.addFile.toggle()}><span>Bestand toevoegen</span></div>
                    <div className="button ___add ___large ___block-mobile" onClick={(e) => this.refs.addFolder.toggle()}><span>Map toevoegen</span></div>
                </div>
            )
        }

        let edit
        if (this.state.selected.size === 1) {
            edit = (
                <div className="button ___edit" onClick={() => this.refs.edit.toggle()}><span>Bewerken</span></div>
            )
        }

        const containerGuid = match.params.containerGuid ? match.params.containerGuid : match.params.groupGuid

        return (
            <GroupContainer match={this.props.match}>
                <Document title={entity.name} />
                <section className="section">
                    <div className={classnames({"container toolbar": true, "___is-visible": this.state.selected.size > 0})}>
                        <div className="flexer ___gutter">
                            <strong>{this.state.selected.size} {this.state.selected.size > 1 ? "items" : "item"}</strong>
                            <div className="button ___link" onClick={this.clearSelection}>Deselecteer</div>
                        </div>
                        <div className="flexer ___gutter ___end">
                            <div className="button   ___move" onClick={() => this.refs.move.toggle()}><span>Verplaatsen</span></div>
                            {edit}
                            <div className="button   ___delete" onClick={() => this.refs.delete.toggle()}><span>Verwijderen</span></div>
                            <div className="button ___download" onClick={this.downloadFiles}><span>Download</span></div>
                        </div>
                    </div>
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-4 col-lg-3">
                                <Select options={{"all": "Alles", "favorites": "Favorieten", "folders": "Mappen", "files": "Bestanden"}} value="all" />
                            </div>
                            <div className="col-sm-8 col-lg-9 end-sm">
                                {add}
                            </div>
                        </div>
                        <div className="breadcrumb ___large">
                            <a>Bestanden</a>
                            <a className="___is-active">{entity.name}</a>
                        </div>
                        <table className="files">
                            <thead>
                                <tr>
                                    <th>
                                        <span className="checkbox ___large">
                                            <input id="file-all" name="file-all" type="checkbox" onClick={this.selectAll} />
                                            <label htmlFor={`file-${entity.guid}`} />
                                        </span>
                                    </th>
                                    <th></th>
                                    <th><button className="___is-active"><span>Bestandsnaam</span></button></th>
                                    <th></th>
                                    <th><button><span>Aanmaakdatum</span></button></th>
                                    <th><button><span>Eigenaar</span></button></th>
                                </tr>
                            </thead>
                            <FileFolderList containerGuid={containerGuid} containerClassName="" inTable rowClassName="row file__item" childClass={FileFolder} offset={0} limit={50} type="object" subtype="file|folder" selected={this.state.selected} history={this.props.history} />
                        </table>
                    </div>
                    <AddFileModal ref="addFile" containerGuid={containerGuid} onComplete={this.clearSelection} />
                    <AddFolderModal ref="addFolder" containerGuid={containerGuid} onComplete={this.clearSelection} />
                    <EditFileFolderModal ref="edit" entity={this.state.selected.first()} onComplete={this.clearSelection} />
                    <MoveFileFolderModal ref="move" entities={this.state.selected} onComplete={this.clearSelection} />
                    <DeleteFileFolderModal ref="delete" entities={this.state.selected} onComplete={this.clearSelection} />
                </section>
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