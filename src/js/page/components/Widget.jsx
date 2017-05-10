import React from "react"
import Objects from "./widgets/Objects"
import Leader from "./widgets/Leader"
import Recommended from "./widgets/Recommended"
import Text from "./widgets/Text"
import Trending from "./widgets/Trending"
import Top from "./widgets/Top"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

class Widget extends React.Component {
    constructor(props) {
        super(props)

        const { entity } = this.props

        this.state = {
            isEditing: false,
            width: entity.width
        }

        this.toggleEdit = (e) => this.setState({isEditing: !this.state.isEditing})

        this.toggleDelete = this.toggleDelete.bind(this)
        this.onResizeMouseDown = this.onResizeMouseDown.bind(this)
        this.onResizeMouseMove = this.onResizeMouseMove.bind(this)
        this.onResizeMouseUp = this.onResizeMouseUp.bind(this)
    }

    componentDidMount() {
        document.addEventListener("mousemove", this.onResizeMouseMove)
        document.addEventListener("mouseup", this.onResizeMouseUp)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.entity !== this.props.entity) {
            this.setState({
                width: nextProps.entity.width
            })
        }
    }

    toggleDelete(e) {
        this.setState({
            isEditing: false
        })

        this.props.deleteWidget(this.props.entity)
    }

    onResizeMouseDown(e) {
        this.startWidth = this.state.width
        this.resizeStartX = e.clientX
        this.resizing = true
    }

    onResizeMouseMove(e) {
        if (!this.resizing) {
            return
        }

        let width
        width = this.startWidth + Math.round((e.clientX - this.resizeStartX) / (1200/15))

        if (width > 12) {
            width = 12
        }

        if (width < 4) {
            width = 4
        }

        this.setState({
            width: width
        })
    }

    onResizeMouseUp(e) {
        if (!this.resizing) {
            return
        }

        this.resizing = false

        const { entity } = this.props

        this.props.mutate({
            variables: {
                input: {
                    clientMutationId: "1",
                    guid: entity.guid,
                    width: this.state.width
                }
            }
        })
    }

    render() {
        const { entity, canEdit } = this.props
        let content

        switch (entity.type) {
            case "Objects":
                content = ( <Objects entity={entity} isEditing={this.state.isEditing} toggleEdit={this.toggleEdit} /> )
                break
            case "Leader":
                content = ( <Leader entity={entity} isEditing={this.state.isEditing} toggleEdit={this.toggleEdit} /> )
                break
            case "Recommended":
                content = ( <Recommended entity={entity} isEditing={this.state.isEditing} toggleEdit={this.toggleEdit} /> )
                break
            case "Trending":
                content = ( <Trending entity={entity} isEditing={this.state.isEditing} toggleEdit={this.toggleEdit} /> )
                break
            case "Top":
                content = ( <Top entity={entity} isEditing={this.state.isEditing} toggleEdit={this.toggleEdit} /> )
                break
            case "Text":
                content = ( <Text entity={entity} isEditing={this.state.isEditing} toggleEdit={this.toggleEdit} /> )
                break
            default:
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
                        <div className="___delete" onClick={this.toggleDelete} />
                        <div className="___close" onClick={this.toggleEdit} />
                    </div>
                )
            }
        }

        let isDragging = false

        return (
            <div draggable={this.state.canEdit ? "draggable" : ""} className={"widget col-sm-" + this.state.width} style={{opacity: isDragging ? 0.25 : 1, cursor: "move"}}>
                {actions}
                {content}
                <div className="widget__drag" onMouseDown={this.onResizeMouseDown} />
            </div>
        )
    }
}

const Mutation = gql`
    mutation editWidget($input: editWidgetInput!) {
        editWidget(input: $input) {
            entity {
                guid
                ... on Widget {
                    width
                }
            }
        }
    }
`

export default graphql(Mutation)(Widget)