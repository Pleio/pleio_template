import React from "react"
import PropTypes from "prop-types"
import { graphql } from "react-apollo"
import { Link } from "react-router-dom"
import gql from "graphql-tag"
import classnames from "classnames"
import GroupContainer from "../group/components/GroupContainer"
import Document from "../core/components/Document"
import FileFolderList from "./components/FileFolderList"
import Select from "../core/components/NewSelect"
import AddFileModal from "./components/AddFileModal"
import AddFolderModal from "./components/AddFolderModal"
import EditFileFolderModal from "./components/EditFileFolderModal"
import MoveFileFolderModal from "./components/MoveFileFolderModal"
import DeleteFileFolderModal from "./components/DeleteFileFolderModal"
import autobind from "autobind-decorator"
import { OrderedSet } from "immutable"

class GroupList extends React.Component {
    render() {
        const { match } = this.props
        const { viewer } = this.props.data

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

        const toolbar = (
            <div className={classnames({"container toolbar": true, "___is-visible": this.state.selected.size > 0})}>
                <div className="flexer ___space-between">
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
            </div>
        )

        return (
            <GroupContainer>
                <Document title={entity.name} />
                <section className="section">
                    {toolbar}
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
                            <FileFolderList containerGuid={containerGuid} type="object" selected={this.state.selected} history={this.props.history} />
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

GroupList.childContextTypes = {
    onCheck: PropTypes.func,
    clearSelection: PropTypes.func,
    selected: PropTypes.object,
    group: PropTypes.object
}

const Query = gql`
    query GroupList($containerGuid: Int!) {
        viewer {
            guid
            canWriteToContainer
        }
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

const Settings = {
    options: (ownProps) => {
        return {
            variables: {
                containerGuid: ownProps.match.params.groupGuid
            }
        }
    }
}
export default graphql(Query, Settings)(GroupList)