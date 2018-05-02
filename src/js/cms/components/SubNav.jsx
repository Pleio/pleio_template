import React from "react"
import { Link } from "react-router-dom"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import autobind from "autobind-decorator"
import SubSubNav from "./SubSubNav"

class SubNav extends React.Component {
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
                    <div ref={provided.innerRef} {...provided.draggableProps}>
                        <div className="subnav__parent" {...provided.dragHandleProps}>
                            <Link className="___is-grabbable" to={`/cms/view/${match.params.containerGuid || match.params.guid}/${match.params.containerSlug || match.params.slug}/${child.guid}`}>{child.title}</Link>
                        </div>
                        <SubSubNav guid={child.guid} />        
                    </div>
                )}
            </Draggable>
        ))

        return (
            <div className="subnav">
                <Link to={entity.url}>{entity.title}</Link>
                <DragDropContext onDragEnd={this.onDragEnd}>
                    <Droppable type={entity.guid} droppableId={entity.guid}>
                        {(provided, snapshot) => (
                            <div ref={provided.innerRef}>
                                {children}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        )
    }
}

const Query = gql`
    query SubNav($guid: Int!) {
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

export default graphql(Query)(SubNav)