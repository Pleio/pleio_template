import React from "react"
import { List } from "immutable"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import autobind from "autobind-decorator"

class Footer extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            footer: List()
        }
    }

    componentWillReceiveProps(nextProps) {
        const { data } = nextProps

        if (!data.site || this.props.data === nextProps.data) {
            return
        }

        this.setState({
            footer: List(data.site.footer)
        })
    }

    @autobind
    addLink(e) {
        e.preventDefault()

        this.setState({
            footer: this.state.footer.push({
                title: "Nieuwe link",
                link: "https://www.nieuw.nl"
            })
        })
    }

    @autobind
    onChangeField(i, fieldName, e) {
        e.preventDefault()

        this.setState({
            footer: this.state.footer.set(i, Object.assign({}, this.state.footer[i], {
                [fieldName]: e.target.value
            }))
        })
    }

    @autobind
    removeLink(i, e) {
        e.preventDefault()

        this.setState({
            footer: this.state.footer.delete(i)
        })
    }

    @autobind
    onDragEnd(result) {
        if (!result.destination) {
            return
        }

        const sourceRemoved = this.state.footer.splice(result.source.index, 1)
        const newFooter = sourceRemoved.splice(result.destination.index, 0, this.state.footer.get(result.source.index))

        this.setState({ footer: newFooter })
    }

    render() {
        const footer = this.state.footer.map((link, i) => {
            return (
                <Draggable key={i} draggableId={i.toString()} index={i}>
                    {(provided, snapshot) => (
                        <div>
                            <div ref={provided.innerRef} {...provided.draggableProps}>
                                <span {...provided.dragHandleProps} className="elgg-icon elgg-icon-drag-arrow"></span>
                                <input type="text" name={`footerTitle[${i}]`} onChange={(e) => this.onChangeField(i, "title", e)} value={link.title} />
                                <input type="text" name={`footerLink[${i}]`} onChange={(e) => this.onChangeField(i, "link", e)} value={link.link} />
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
                                {footer}
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
    query Footer {
        site {
            guid
            footer {
                title
                link
            }
        }
    }
`

export default graphql(Query)(Footer)