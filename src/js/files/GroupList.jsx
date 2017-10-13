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
import Breadcrumb from "./components/Breadcrumb"
import FileFolder from "./components/FileFolder"
import FileFolderTile from "./components/FileFolderTile"
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
            selected: new OrderedSet(),
            viewType: (this.props.location.hash === "#tiles") ? "tiles" : "list",
            orderBy: "filename",
            direction: "asc"
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
    toggleViewType(newType) {
        this.props.history.push('#' + newType)
        this.setState({ viewType: newType })
    }

    @autobind
    toggleOrderBy(newOrderBy) {
        if (newOrderBy === this.state.orderBy) {
            if (this.state.direction == "asc") {
                this.setState({ direction: "desc" })
            } else {
                this.setState({ direction: "asc" })
            }
        } else {
            this.setState({ orderBy: newOrderBy })
        }
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

        const containerGuid = match.params.containerGuid ? match.params.containerGuid : match.params.groupGuid

        let add
        if (viewer.canWriteToContainer) {
            let create
            if (window.__SETTINGS__['odtEnabled']) {
                create = (
                    <a href={`/odt_editor/create/${containerGuid}`} className="button ___large"><span>Maak bestand</span></a>
                )
            }

            add = (
                <div className="flexer ___gutter">
                    {create}
                    <div className="button ___large" onClick={(e) => this.refs.addFile.toggle()}><span>Upload bestand</span></div>
                    <div className="button ___large" onClick={(e) => this.refs.addFolder.toggle()}><span>Nieuwe map</span></div>
                </div>
            )
        }

        let edit
        if (this.state.selected.size === 1) {
            edit = (
                <div className="button ___edit" onClick={() => this.refs.edit.toggle()}><span>Bewerken</span></div>
            )
        }

        let list
        if (this.state.viewType === "list") {
            list = (
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
                            <th><button className={classnames({"___is-active": this.state.orderBy === "filename", "___is-descending": this.state.direction === "desc"})} onClick={(e) => this.toggleOrderBy("filename")}><span>Bestandsnaam</span></button></th>
                            <th></th>
                            <th><button className={classnames({"___is-active": this.state.orderBy === "timeCreated", "___is-descending": this.state.direction === "desc"})} onClick={(e) => this.toggleOrderBy("timeCreated")}><span>Aanmaakdatum</span></button></th>
                            <th><button className={classnames({"___is-active": this.state.orderBy === "owner", "___is-descending": this.state.direction === "desc"})} onClick={(e) => this.toggleOrderBy("owner")}><span>Eigenaar</span></button></th>
                        </tr>
                    </thead>
                    <FileFolderList containerGuid={containerGuid} containerClassName="" inTable rowClassName="row file__item" childClass={FileFolder} offset={0} limit={50} orderBy={this.state.orderBy} direction={this.state.direction} selected={this.state.selected} history={this.props.history} />
                </table>
            )
        } else {
            list = (
                <FileFolderList containerGuid={containerGuid} containerClassName="file-tiles" childClass={FileFolderTile} offset={0} limit={50} orderBy={this.state.orderBy} direction={this.state.direction} selected={this.state.selected} history={this.props.history} />
            )
        }

        return (
            <GroupContainer match={this.props.match}>
                <Document title={entity.name} />
                <section className="section">
                    <div className={classnames({"container toolbar": true, "___is-visible": this.state.selected.size > 0})}>
                        <div className="flexer ___space-between">
                            <div className="flexer ___gutter">
                                <strong>{this.state.selected.size} {this.state.selected.size > 1 ? "items" : "item"}</strong>
                                <div className="button ___link" onClick={this.clearSelection}>Deselecteer</div>
                            </div>
                            <div className="flexer ___gutter ___end">
                                {edit}
                                <div className="button   ___delete" onClick={() => this.refs.delete.toggle()}><span>Verwijderen</span></div>
                                <div className="button ___download" onClick={this.downloadFiles}><span>Download</span></div>
                            </div>
                        </div>
                    </div>
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-4 col-lg-3">
                                <Select options={{"all": "Alles", "favorites": "Favorieten", "folders": "Mappen", "files": "Bestanden"}} value="all" className="selector ___margin-bottom-mobile" />
                            </div>
                            <div className="col-sm-8 col-lg-9 end-sm">
                                <div className="flexer ___gutter ___margin-bottom">
                                    {add}
                                    <div className="flexer ___gutter">
                                        <div className={classnames({"button__icon ___large ___list": true, "___is-active": this.state.viewType === "list"})} title="Lijst weergave" onClick={(e) => this.toggleViewType("list")} />
                                        <div className={classnames({"button__icon ___large ___tiles": true, "___is-active": this.state.viewType === "tiles"})} title="Tegel weergave" onClick={(e) => this.toggleViewType("tiles")} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Breadcrumb guid={containerGuid} />
                        {list}
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