import React from "react"
import { DragDropContext } from "react-dnd"
import HTML5Backend from "react-dnd-html5-backend"
import Card from "./Card"
import Column from "./Column"
import { gql, graphql } from "react-apollo"

class TasksList extends React.Component {
    constructor(props) {
        super(props)
        this.onDrop = this.onDrop.bind(this)
    }

    onDrop(item, state) {
        this.props.mutate({
            variables: {
                input: {
                    clientMutationId: 1,
                    guid: item.guid,
                    state
                }
            }
        })
    }

    render() {
        const { entities } = this.props.data

        if (!entities) {
            return (
                <div />
            )
        }

        const edges = entities.edges

        const options = [
            { state: "NEW", title: "Nieuw" },
            { state: "BUSY", title: "Bezig" },
            { state: "DONE", title: "Klaar" }
        ]

        const columns = options.map((option, i) => {
            const cards = edges.filter(e => e.state === option.state).map((entity, j) => ((
                <Card key={j} entity={entity} {...this.props} />
            )))

            return (
                <Column key={i} title={option.title} state={option.state} onDrop={this.onDrop}>
                    {cards}
                </Column>
            )
        })

        return (
            <div className="row">
                {columns}
            </div>
        )
    }
}

const Query = gql`
    query TasksList($type: Type!, $subtype: String!, $containerGuid: Int!, $offset: Int!, $limit: Int!) {
        entities(type: $type, subtype: $subtype, containerGuid: $containerGuid, offset: $offset, limit: $limit) {
            total
            canWrite
            edges {
                guid
                ... on Object {
                    guid
                    title
                    state
                }
            }
        }
    }
`

const Mutation = gql`
    mutation editTask($input: editTaskInput!) {
        editTask(input: $input) {
            entity {
                guid
                state
            }
        }
    }
`

const TasksListWithMutation = graphql(Query)(graphql(Mutation)(TasksList))
export default DragDropContext(HTML5Backend)(TasksListWithMutation)