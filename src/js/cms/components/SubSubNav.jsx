import React from "react"
import { Link } from "react-router-dom"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import autobind from "autobind-decorator"

class SubSubNav extends React.Component {
    @autobind
    onDragEnd(result) {
        if (!result.destination) {
            return
        }
    }

    render() {
        const { match } = this.props
        const { entity, entities } = this.props.data

        if (!entities) {
            return (
                <div />
            )
        }

        const children = entities.edges.map((child, i) => (
            <Draggable key={child.guid} draggableId={child.guid} index={i}>
                {(provided, snapshot) => (
                    <div {...provided.dragHandleProps} ref={provided.innerRef} {...provided.draggableProps}>
                        <Link className="___is-grabbable" to={`/cms/view/`}>{child.title}</Link>
                    </div>
                )}
            </Draggable>
        ))

        return (
            <Droppable type={entity.guid} droppableId={entity.guid}>
                {(provided, snapshot) => (
                    <div ref={provided.innerRef} className="subnav__children">
                        {children}
                    </div>
                )}
            </Droppable>
        )
    }
}

const Query = gql`
    query SubNavItem($guid: Int!) {
        entity(guid: $guid) {
            guid
            ... on Page {
                title
                url
            }
        }
        entities(subtype: "page", containerGuid: $guid) {
            total
            edges {
                guid
                ... on Page {
                    title
                    url
                }
            }
        }
    }
`

export default graphql(Query)(SubSubNav)