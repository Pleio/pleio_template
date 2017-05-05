import React from "react"
import Leader from "./widgets/Leader"
import Recommended from "./widgets/Recommended"
import Text from "./widgets/Text"
import Trending from "./widgets/Trending"
import Top from "./widgets/Top"
import { DragSource, DropTarget } from "react-dnd"
import { findDOMNode } from "react-dom"

class Widget extends React.Component {
    constructor(props) {
        super(props)

        this.toggleEdit = (e) => this.setState({isEditing: !this.state.isEditing})

        this.state = {
            isEditing: false
        }
    }

    render() {
        const { entity, canEdit } = this.props
        let content, width

        switch (entity.type) {
            case "Leader":
                width = "col-sm-12"
                content = ( <Leader entity={entity} isEditing={this.state.isEditing} toggleEdit={this.toggleEdit} /> )
                break
            case "Recommended":
                width = "col-sm-4"
                content = ( <Recommended entity={entity} isEditing={this.state.isEditing} toggleEdit={this.toggleEdit} /> )
                break
            case "Trending":
                width = "col-sm-4"
                content = ( <Trending entity={entity} isEditing={this.state.isEditing} toggleEdit={this.toggleEdit} /> )
                break
            case "Top":
                width = "col-sm-4"
                content = ( <Top entity={entity} isEditing={this.state.isEditing} toggleEdit={this.toggleEdit} /> )
                break
            case "Text":
                width = "col-sm-4"
                content = ( <Text entity={entity} isEditing={this.state.isEditing} toggleEdit={this.toggleEdit} /> )
                break
            default:
                width = "col-sm-4"
                content = ( <div>Kan dit type widget niet vinden.</div> )
        }

        let actions
        if (canEdit) {
            if (!this.state.isEditing) {
                actions = (
                    <div className="widget__admin">
                        <div className="___edit" onClick={this.toggleEdit} />
                    </div>
                )
            } else {
                actions = (
                    <div className="widget__admin">
                        <div className="___delete" onClick={() => this.props.deleteWidget(this.props.entity)} />
                        <div className="___close" onClick={this.toggleEdit} />
                    </div>
                )
            }
        }

        const { connectDragSource, connectDropTarget, isDragging } = this.props

        return connectDragSource(connectDropTarget(
            <div className={"widget " + width} style={{opacity: isDragging ? 0.25 : 1, cursor: "move"}}>
                {actions}
                {content}
                <div className="widget__drag" />
            </div>
        ))
    }
}

const source = {
    beginDrag(props) {
        const { entity, index } = props

        return {
            guid: entity.guid,
            index: index
        }
    }
}

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}

const target = {
    hover(props, monitor, component) {
        const sourceIndex = monitor.getItem().index
        const targetIndex = props.index

        if (sourceIndex === targetIndex) {
            return
        }

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        monitor.getItem().index = targetIndex

        props.moveWidget(sourceIndex, targetIndex)
    }
}

function connect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver()
    }
}

export default DragSource("widget", source, collect)(DropTarget("widget", target, connect)(Widget))