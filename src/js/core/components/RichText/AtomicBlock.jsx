import React from "react"
import { Entity, EditorState, Modifier, SelectionState } from "draft-js"
import { Resizable } from "react-resizable"
import ImageContextualMenu from "./ImageContextualMenu"
import classnames from "classnames"
import ImageContextualInfoModal from "./ImageContextualInfoModal"
import ImageContextualResizeModal from "./ImageContextualResizeModal"

export default class AtomicBlock extends React.Component {
    constructor(props) {
        super(props)

        this.renderImage = this.renderImage.bind(this)
        this.onDelete = this.onDelete.bind(this)
        this.onChangeAlign = this.onChangeAlign.bind(this)
        this.onChangeDisplay = this.onChangeDisplay.bind(this)
        this.onClickInfo = this.onClickInfo.bind(this)
        this.onClickResize = this.onClickResize.bind(this)
        this.onSubmitInfo = this.onSubmitInfo.bind(this)
        this.onSubmitResize = this.onSubmitResize.bind(this)
        this.onCloseModal = this.onCloseModal.bind(this)
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

        const content = editorState.getCurrentContent()
        const blockMap = content.getBlockMap().delete(block.getKey())

        let withoutAtomicBlock = content.merge({blockMap, selectionAfter: editorState.getSelection()})
        const newEditorState = EditorState.push(editorState, withoutAtomicBlock, "remove-range")
        onChange(newEditorState)
    }

    onClickInfo() {
        const { makeReadOnly } = this.props.blockProps
        makeReadOnly(true)
        this.refs.infoModal.toggle()
    }

    onSubmitInfo(alt) {
        const { makeReadOnly } = this.props.blockProps
        makeReadOnly(false)

        const { block } = this.props
        const entityKey = block.getEntityAt(0)
        Entity.mergeData(entityKey, { alt: alt })
        this.forceStateUpdate()
    }

    onClickResize() {
        const { makeReadOnly } = this.props.blockProps
        makeReadOnly(true)
        this.refs.resizeModal.toggle()
    }

    onSubmitResize(width, height) {
        const { makeReadOnly } = this.props.blockProps
        makeReadOnly(false)

        const { block } = this.props
        const entityKey = block.getEntityAt(0)
        Entity.mergeData(entityKey, { width: width, height: height })

        this.forceStateUpdate()
    }

    onCloseModal() {
        const { makeReadOnly } = this.props.blockProps
        makeReadOnly(false)
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

    get

    renderImage(data) {
        const { isEditor } = this.props.blockProps
        let { src, width, height, align, display, alt } = data

        let divStyle, imageStyle = {}, imageContainerStyle

        switch (display) {
            case "inline-block":
                divStyle = {
                    float: "left",
                    paddingRight: "1rem"
                }
                break
            default:
            case "block":
                divStyle = {
                    width: "100%"
                }
                break
        }

        switch(align) {
            case "right":
                imageContainerStyle = {
                    marginLeft: "auto",
                    marginRight: "0"
                }
                break
            case "center":
                imageContainerStyle = {
                    marginLeft: "auto",
                    marginRight: "auto"
                }
                break
            default:
            case "left":
                imageContainerStyle = {
                    marginLeft: "0",
                    marginRight: "auto"
                }
                break
        }

        if (width) {
            imageStyle.width = width + "px"
        }

        if (height) {
            imageStyle.height = height + "px"
        }

        if (isEditor) {
            return (
                <div className="editor__image" onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut} style={divStyle}>
                    <div style={imageContainerStyle}>
                        <img src={src} alt={alt} style={imageStyle} />
                        <ImageContextualMenu
                            align={align}
                            display={display}
                            isVisible={this.state.showMenu}
                            onDelete={this.onDelete}
                            onChangeAlign={this.onChangeAlign}
                            onChangeDisplay={this.onChangeDisplay}
                            onClickInfo={this.onClickInfo}
                            onClickResize={this.onClickResize}
                        />
                    </div>
                    <ImageContextualInfoModal ref="infoModal" alt={alt} onSubmit={this.onSubmitInfo} onClose={this.onCloseModal} />
                    <ImageContextualResizeModal ref="resizeModal" width={width} height={height} onSubmit={this.onSubmitResize} onClose={this.onCloseModal} />
                </div>
            )
        } else {
            return (
                <div style={divStyle}>
                    <div style={imageContainerStyle}>
                        <img src={data.src} alt={data.alt} style={imageStyle} />
                    </div>
                </div>
            )
        }
    }
}