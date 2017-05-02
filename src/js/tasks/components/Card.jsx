import React from "react"
import { Link } from "react-router-dom"
import { DragSource } from "react-dnd"
import { getClassFromTags } from "../../lib/helpers"
import classnames from "classnames"

const source = {
    beginDrag(props) {
        const { guid } = props.entity

        return {
            guid
        }
    }
}

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}

class Card extends React.Component {
    getRootURL() {
        const { match } = this.props

        if (!match || !match.params.groupGuid || !match.params.groupSlug) {
            return ""
        }

        return `/groups/view/${match.params.groupGuid}/${match.params.groupSlug}`
    }
    
    render() {
        const { connectDragSource, isDragging } = this.props
        const { guid, title, state } = this.props.entity

        return connectDragSource(
            <div className="card-blog-post">
                <div className="card-blog-post__post" style={{opacity: isDragging ? 0.25 : 1, cursor: 'move'}}>
                    <Link to={`${this.getRootURL()}/tasks/edit/${guid}`} className="card-blog-post__title">
                        {title}
                    </Link>

                    <div className="card-blog-post__content" />
                </div>
            </div>
        )
    }
}

export default DragSource("task", source, collect)(Card)