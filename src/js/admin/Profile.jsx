import React from "react"
import { List } from "immutable"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import autobind from "autobind-decorator"

class Profile extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            profile: List()
        }
    }

    componentWillReceiveProps(nextProps) {
        const { data } = nextProps

        if (!data.site || this.props.data === nextProps.data) {
            return
        }

        this.setState({
            profile: List(data.site.profile)
        })
    }

    @autobind
    addField(e) {
        e.preventDefault()

        this.setState({
            profile: this.state.profile.push({
                key: "veld",
                name: "Een voorbeeldveld"
            })
        })
    }

    @autobind
    onChangeField(i, fieldName, e, transformToKey) {
        e.preventDefault()

        let value = e.target.value
        if (transformToKey) {
            value = value.toLowerCase().replace(/[^a-z]/gm, "")
        }

        this.setState({
            profile: this.state.profile.set(i, Object.assign({}, this.state.profile[i], {
                [fieldName]: value
            }))
        })
    }

    @autobind
    removeField(i, e) {
        e.preventDefault()

        this.setState({
            profile: this.state.profile.delete(i)
        })
    }

    @autobind
    onDragEnd(result) {
        if (!result.destination) {
            return
        }

        const sourceRemoved = this.state.profile.splice(result.source.index, 1)
        const newProfile = sourceRemoved.splice(result.destination.index, 0, this.state.profile.get(result.source.index))

        this.setState({ profile: newProfile })
    }

    render() {
        const fields = this.state.profile.map((field, i) => {
            return (
                <Draggable key={i} draggableId={i.toString()} index={i}>
                    {(provided, snapshot) => (
                        <div>
                            <div ref={provided.innerRef} {...provided.draggableProps}>
                                <span {...provided.dragHandleProps} className="elgg-icon elgg-icon-drag-arrow"></span>
                                <input type="text" name={`profileKey[${i}]`} onChange={(e) => this.onChangeField(i, "key", e, true)} value={field.key} />
                                <input type="text" name={`profileName[${i}]`} onChange={(e) => this.onChangeField(i, "name", e, false)} value={field.name} />
                                <span className="elgg-icon elgg-icon-delete" onClick={(e) => this.removeField(i, e)} />
                            </div>
                            {provided.placeholder}
                        </div>
                    )}
                </Draggable>
            )
        })

        return (
            <div>
                <div>
                    <button className="elgg-button elgg-button-submit" onClick={this.addField}>
                        Veld toevoegen
                    </button><br />
                    <b>Sleutel</b>&nbsp;<b>Omschrijving</b><br />
                    <i>Let op: de sleutel mag alleen de karakters a-z bevatten en mag maximaal 8 tekens lang zijn.</i>
                    <DragDropContext onDragEnd={this.onDragEnd}>
                        <Droppable droppableId="droppable-1">
                            {(provided, snapshot) => (
                                <div ref={provided.innerRef}>
                                {fields}
                                {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
            </div>
        )
    }
}

const Query = gql`
    query Profile {
        site {
            guid
            profile {
                key
                name
            }
        }
    }
`

export default graphql(Query)(Profile)