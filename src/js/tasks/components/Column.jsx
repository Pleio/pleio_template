import React from "react"
import { DropTarget } from "react-dnd"

class Column extends React.Component {
    render() {
        const { connectDropTarget, isOver } = this.props

        return connectDropTarget(
            <div className="col-sm-4">
                <h3>{this.props.title}</h3>
                {this.props.children}
            </div>
        )
    }
}

const target = {
    drop(props, monitor) {
        const item = monitor.getItem()
        props.onDrop(item, props.state)
    }
}

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver()
    }
}

export default DropTarget("task", target, collect)(Column)