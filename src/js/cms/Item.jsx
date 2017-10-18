import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import CommentList from "../core/components/CommentList"
import EditModal from "../core/Edit"
import DeleteModal from "../core/Delete"
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
import AddRow from "./components/AddRow"
import Row from "./components/Row"
import autobind from "autobind-decorator"

class Item extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            rows: []
        }
    }

    @autobind
    onDragStart() {
        this.setState({ dragging: true })
    }

    @autobind
    onDragEnd() {
        this.setState({ dragging: false })
    }

    @autobind
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

    @autobind
    deleteWidget(entity) {
        this.setState({
            deleteEntity: entity
        })

        this.refs.deleteWidget.toggle()
    }

    @autobind
    afterDelete() {
        this.refs.deleteWidget.toggle()
    }

    @autobind
    onAdd(row) {
        this.setState({
            rows: [...this.state.rows, row]
        })
    }

    @autobind
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
        let { entity } = this.props.data

        if (!entity) {
            return (
                <div />
            )
        }

        if (entity.status == 404) {
            return (
                <NotFound />
            )
        }

        const rows = entity.rows.map((row, i) => (
            <Row key={row.guid} entity={row} firstRow={i === 0 ? true : false} />
        ))


        let add
        if (entity.canEdit) {
            add = (
                <AddRow onSubmit={this.onAdd} firstRow={this.state.rows.length === 0 ? true : false} containerGuid={entity.guid} />
            )
        }

        return (
            <div className="page-container">
                <Document title={entity.title} />
                {rows}
                {add}
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
                rows {
                    guid
                    layout
                    widgets {
                        guid
                        type
                        canEdit
                        position
                        settings {
                            key
                            value
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
                guid: ownProps.match.params.guid
            }
        }
    }
}

export default DragDropContext(HTML5Backend)(graphql(Query, Settings)(Item))