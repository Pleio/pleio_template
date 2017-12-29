import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import CommentList from "../core/components/CommentList"
import { Link } from "react-router-dom"
import EditModal from "../core/Edit"
import Bookmark from "../bookmarks/components/Bookmark"
import NotFound from "../core/NotFound"
import showDate from "../lib/showDate"
import RichTextView from "../core/components/RichTextView"
import Document from "../core/components/Document"
import AddWidgetModal from "./components/AddWidgetModal"
import DeleteWidgetModal from "./components/DeleteWidgetModal"
import AddModal from "./components/AddModal"
import { DragDropContext } from "react-dnd"
import HTML5Backend from "react-dnd-html5-backend"
import update from "immutability-helper"
import AddRow from "./components/AddRow"
import Row from "./components/Row"
import SubNav from "./components/SubNav"
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
        const { entity } = this.props.data
        const { match } = this.props

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

        let addRow, cmsPanel
        if (entity.canEdit) {
            addRow = (
                <AddRow onSubmit={this.onAdd} firstRow={this.state.rows.length === 0 ? true : false} containerGuid={entity.guid} />
            )

            let addPage
            if (entity.pageType == "text") {
                addPage = (
                    <button className="___add" onClick={(e) => this.refs.addModal.toggle()} />
                )
            }

            cmsPanel = (
                <div className="cms__panel">
                    <Link to={`/cms`}><button className="___close" /></Link>
                    {addPage}
                    <Link to={`/cms/edit/${entity.guid}`}><button className="___settings" /></Link>
                </div>
            )
        }

        if (entity.pageType == "text") {
            let subNav
            if (entity.hasChildren || match.params.containerGuid) {
                subNav = (
                    <div className="col-sm-4">
                        <SubNav match={match} containerGuid={match.params.containerGuid || match.params.guid} guid={match.params.containerGuid || match.params.guid} />
                    </div>
                )
            }

            return (
                <div className="page-container">
                    <Document title={entity.title} />
                    {cmsPanel}
                    <section className="section">
                        <div className="container">
                            <div className="row">
                                {subNav}
                                <div className={entity.hasChildren || match.params.containerGuid ? "col-sm-8" : "col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2"}>
                                    <article className="article">
                                        <h3 className="article__title">{entity.title}</h3>
                                        <RichTextView richValue={entity.richDescription} value={entity.description} />
                                    </article>
                                </div>
                            </div>
                        </div>
                    </section>
                    <AddModal ref="addModal" containerGuid={entity.guid} />
                </div>
            )
        } else {
            const rows = entity.rows.map((row, i) => (
                <Row key={row.guid} entity={row} firstRow={i === 0 ? true : false} />
            ))
    
            return (
                <div className="page-container">
                    <Document title={entity.title} />
                    {rows}
                    {addRow}
                    {cmsPanel}
                </div>
            )
        }
    }
}

const Query = gql`
    query PageItem($guid: Int!) {
        entity(guid: $guid) {
            guid
            status
            ... on Page {
                title
                canEdit
                hasChildren
                pageType
                description
                richDescription
                rows {
                    guid
                    layout
                    canEdit
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