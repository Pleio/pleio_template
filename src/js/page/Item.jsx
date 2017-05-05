import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import CommentList from "../core/components/CommentList"
import EditModal from "../core/Edit"
import DeleteModal from "../core/Delete"
import { showModal } from "../lib/actions"
import Bookmark from "../bookmarks/components/Bookmark"
import NotFound from "../core/NotFound"
import showDate from "../lib/showDate"
import RichTextView from "../core/components/RichTextView"
import Document from "../core/components/Document"
import AddWidgetModal from "./components/AddWidgetModal"
import DeleteWidgetModal from "./components/DeleteWidgetModal"
import { DragDropContext } from "react-dnd"
import HTML5Backend from "react-dnd-html5-backend"
import update from "immutability-helper"
import Row from "./components/Row"

class Item extends React.Component {
    constructor(props) {
        super(props)

        this.moveWidget = this.moveWidget.bind(this)
        this.deleteWidget = this.deleteWidget.bind(this)
        this.afterDelete = this.afterDelete.bind(this)

        this.state = {
            rows: this.processRows(this.props.data.entity)
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            rows: this.processRows(nextProps.data.entity)
        })
    }

    moveWidget(sourceIndex, targetIndex) {
        const dragWidget = this.state.rows[1][sourceIndex]

        this.setState(update(this.state, {
            rows: {
                1: {
                    $splice: [
                        [sourceIndex, 1],
                        [targetIndex, 0, dragWidget]
                    ]
                }
            }
        }))
    }

    deleteWidget(entity) {
        this.setState({
            deleteEntity: entity
        })

        this.refs.deleteWidget.toggle()
    }

    afterDelete() {
        this.refs.deleteWidget.toggle()
    }

    onAddRow() {
        const length = Object.keys(this.state.rows).length
        this.setState({
            rows: Object.assign({}, this.state.rows, {
                [length+1]: []
            })
        })
    }

    processRows(entity) {
        if (!entity) {
            return []
        }

        let entitiesByRow = {}
        entity.widgets.forEach((widget) => {
            if (entitiesByRow[widget.row]) {
                entitiesByRow[widget.row].push(widget)
            } else {
                entitiesByRow[widget.row] = [widget]
            }
        })

        return entitiesByRow
    }

    render() {
        let { entity, viewer } = this.props.data

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
        if (entity.canEdit) {
            add = (
                <div className="widget__add">
                    <div className="button ___large ___add" onClick={() => this.refs.addWidget.toggle()}>
                        <span>Widget toevoegen</span>
                    </div>
                </div>
            )
        }

        const rows = Object.keys(this.state.rows).map((row, i) => {
            return (
                <Row key={i} entities={this.state.rows[row]} canEdit={entity.canEdit} moveWidget={this.moveWidget} deleteWidget={this.deleteWidget} selected={true} />
            )
        })

        return (
            <div>
                <Document title={entity.title} />
                    <section className="section padding-top">
                        <div className="container">
                            {add}
                            {rows}
                        </div>
                    </section>
                <AddWidgetModal ref="addWidget" entity={entity} />
                <DeleteWidgetModal ref="deleteWidget" entity={this.state.deleteEntity} toggleEdit={this.toggleEdit} afterDelete={this.afterDelete} />
            </div>
        )
    }
}

const Query = gql`
    query PageItem($guid: String!) {
        entity(guid: $guid) {
            guid
            status
            ... on Page {
                title
                canEdit
                widgets {
                    guid
                    type
                    row
                    settings {
                        key
                        value
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
                guid: ownProps.match.params.guid
            }
        }
    }
}

export default DragDropContext(HTML5Backend)(graphql(Query, Settings)(Item))