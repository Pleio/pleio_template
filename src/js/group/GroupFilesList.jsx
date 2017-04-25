import React from "react"
import PropTypes from "prop-types"
import { graphql } from "react-apollo"
import { Link } from "react-router-dom"
import gql from "graphql-tag"
import classnames from "classnames"
import Document from "../core/components/Document"
import ContentHeader from "../core/components/ContentHeader"
import NotFound from "../core/NotFound"
import AddButton from "../core/containers/AddButton"
import MemberSummary from "./components/MembersSummary"
import Menu from "./components/Menu"
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

        let actions, edit
        if (this.state.selected.size === 1) {
            edit = (
                <a href="#" onClick={() => this.refs.edit.toggle()}>Wijzigen</a>
            )
        }

        if (this.state.selected.size > 0) {
            actions = (
                <div>
                    {this.state.selected.size} {this.state.selected.size > 1 ? "items" : "item"} geselecteerd.
                    {edit}
                    <a href="#" onClick={() => this.refs.delete.toggle()}>Verwijderen</a>
                </div>
            )
        }

        const containerGuid = match.params.containerGuid ? match.params.containerGuid : match.params.groupGuid

        return (
            <div className="page-container">
                <Document title={entity.name} />
                <ContentHeader className="___no-padding-bottom">
                    <div className="row">
                        <div className="col-sm-6">
                            <h3 className="main__title ___info">
                                {entity.name}
                            </h3>
                        </div>
                        <div className="col-sm-6 end-sm">
                            <AddButton title="Nieuwe map" subtype="folder" containerGuid={entity.guid} onClick={() => this.refs.addFolder.toggle()} />
                            <AddButton title="Nieuw bestand" subtype="file" containerGuid={entity.guid} onClick={() => this.refs.addFile.toggle()} />
                        </div>
                    </div>
                    <Menu match={this.props.match} />
                </ContentHeader>
                <section className={classnames({"section ___grey ___grow": true, "___show-checkboxes": this.state.selected.size > 0})}>
                    <div className="container">
                        {actions}
                        <FileFolderList containerGuid={containerGuid} containerClassName="" rowClassName="" childClass={FileFolder} offset={0} limit={50} type="object" subtype="file|folder" selected={this.state.selected} history={this.props.history} />
                    </div>
                </section>
                <AddFileModal ref="addFile" containerGuid={containerGuid} onComplete={this.clearSelection} />
                <AddFolderModal ref="addFolder" containerGuid={containerGuid} onComplete={this.clearSelection} />
                <EditFileFolderModal ref="edit" entity={this.state.selected.first()} onComplete={this.clearSelection} />
                <DeleteFileFolderModal ref="delete" entities={this.state.selected} onComplete={this.clearSelection} />
            </div>
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
                icon
                isClosed
                members(limit: 5) {
                    total
                    edges {
                        guid
                        name
                        icon
                        url
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