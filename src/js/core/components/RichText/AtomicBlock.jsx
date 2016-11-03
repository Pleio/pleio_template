import React from "react"
import { Entity, EditorState, Modifier, SelectionState } from "draft-js"
import { Resizable } from "react-resizable"
import ImageContextualMenu from "./ImageContextualMenu"

export default class AtomicBlock extends React.Component {
    constructor(props) {
        super(props)

        this.renderImage = this.renderImage.bind(this)
        this.onDelete = this.onDelete.bind(this)
        this.onChangeAlign = this.onChangeAlign.bind(this)
        this.onChangeDisplay = this.onChangeDisplay.bind(this)
        this.onMouseOver = this.onMouseOver.bind(this)
        this.onMouseOut = this.onMouseOut.bind(this)
        this.forceStateUpdate = this.forceStateUpdate.bind(this)

        this.state = {
            showMenu: false
        }
    }

    render() {
        const { block } = this.props
        const entity = Entity.get(block.getEntityAt(0))
        const type = entity.getType()

        switch (type) {
            case "IMAGE":
                return this.renderImage(entity.getData())
            default:
                return (<div></div>)
        }
    }

    onChangeAlign(direction) {
        const { block } = this.props
        const entityKey = block.getEntityAt(0)
        Entity.mergeData(entityKey, { align: direction })
        this.forceStateUpdate()
    }

    onChangeDisplay(option) {
        const { block } = this.props
        const entityKey = block.getEntityAt(0)
        Entity.mergeData(entityKey, { display: option })
        this.forceStateUpdate()
    }

    onDelete() {
        const { editorState, onChange } = this.props.blockProps
        const { block } = this.props

        const contentState = editorState.getCurrentContent()
        const selectionState = SelectionState.createEmpty(block.getKey())
        const newContentState = Modifier.applyEntity(contentState, selectionState, null)
        const newEditorState = EditorState.push(editorState, newContentState, "remove-range")
        onChange(newEditorState)
    }

    forceStateUpdate() {
        const { editorState, onChange } = this.props.blockProps
        onChange(EditorState.forceSelection(editorState, editorState.getSelection()))
    }

    onMouseOver(e) {
        this.setState({showMenu: true})
    }

    onMouseOut(e) {
        this.setState({showMenu: false})
    }

    renderImage(data) {
        const { isEditor } = this.props.blockProps

        if (isEditor) {
            return (
                <div className="editor__image" style={{float: (data.align || "left"), display: "block"}} onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut}>
                    <img src={data.src} style={{width: data.width, height: data.height}} />
                    <ImageContextualMenu isVisible={this.state.showMenu} onDelete={this.onDelete} onChangeAlign={this.onChangeAlign} onChangeDisplay={this.onChangeDisplay} />
                </div>
            )
        } else {
            return (
                <div style={{float: (data.align || "left"), display: "block"}}>
                    <img src={data.src} style={{width:data.width, height:data.height}} />
                </div>
            )
        }
    }
}