import React from "react"
import { List } from "immutable"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import autobind from "autobind-decorator"

class Menu extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            menu: List()
        }
    }

    componentWillReceiveProps(nextProps) {
        const { data } = nextProps

        if (!data.site || this.props.data === nextProps.data) {
            return
        }

        this.setState({
            menu: List(data.site.menu)
        })
    }

    @autobind
    addLink(e) {
        e.preventDefault()

        this.setState({
            menu: this.state.menu.push({
                title: "Nieuw",
                link: "/nieuw"
            })
        })
    }

    @autobind
    onChangeField(i, fieldName, e) {
        e.preventDefault()

        this.setState({
            menu: this.state.menu.set(i, Object.assign({}, this.state.menu[i], {
                [fieldName]: e.target.value
            }))
        })
    }

    @autobind
    removeLink(i, e) {
        e.preventDefault()

        this.setState({
            menu: this.state.menu.delete(i)
        })
    }

    @autobind
    onDragEnd(result) {
        if (!result.destination) {
            return
        }

        const sourceRemoved = this.state.menu.splice(result.source.index, 1)
        const newMenu = sourceRemoved.splice(result.destination.index, 0, this.state.menu.get(result.source.index))

        this.setState({ menu: newMenu })
    }

    render() {
        const menu = this.state.menu.map((link, i) => {
            return (
                <Draggable key={i} draggableId={i.toString()} index={i}>
                    {(provided, snapshot) => (
                        <div>
                            <div ref={provided.innerRef} {...provided.draggableProps}>
                                <span {...provided.dragHandleProps} className="elgg-icon elgg-icon-drag-arrow"></span>
                                <input type="text" name={`menuTitle[${i}]`} onChange={(e) => this.onChangeField(i, "title", e)} value={link.title} />
                                <input type="text" name={`menuLink[${i}]`} onChange={(e) => this.onChangeField(i, "link", e)} value={link.link} />
                                <span className="elgg-icon elgg-icon-delete" onClick={(e) => this.removeLink(i, e)} />
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
                    <button className="elgg-button elgg-button-submit" onClick={this.addLink}>
                        Link toevoegen
                    </button>
                    <DragDropContext onDragEnd={this.onDragEnd}>
                        <Droppable droppableId="droppable-1">
                            {(provided, snapshot) => (
                                <div ref={provided.innerRef}>
                                {menu}
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
    query Menu {
        site {
            guid
            menu {
                title
                link
            }
        }
    }
`

export default graphql(Query)(Menu)