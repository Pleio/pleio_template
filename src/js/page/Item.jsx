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
import Widget from "./components/Widget"

class Item extends React.Component {
    constructor(props) {
        super(props)

        this.onAddWidget = () => this.props.dispatch(showModal("addWidget"))
        this.onAddRow = this.onAddRow.bind(this)

        this.state = {
            rows: this.processRows(this.props.data.entity)
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            rows: this.processRows(nextProps.data.entity)
        })
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
                    <div className="button ___large ___add" onClick={this.onAddWidget}>
                        <span>Widget toevoegen</span>
                    </div>
                </div>
            )
        }

        const rows = Object.keys(this.state.rows).map((row, i) => {
            const content = this.state.rows[row].map((widget, j) => (
                <Widget key={j} entity={widget} />
            ))

            return (
                <div key={i} className="row">
                    {content}
                </div>
            )
        })

        return (
            <div>
                <Document title={entity.title} />
                    {add}
                    {rows}
                <AddWidgetModal entity={entity} />
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
                guid: ownProps.params.guid
            }
        }
    }
}

export default graphql(Query, Settings)(Item)