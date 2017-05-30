import React from "react"
import autobind from "autobind-decorator"
import { Entity, EditorState, Modifier, SelectionState } from "draft-js"
import ImageContextualMenu from "./ImageContextualMenu"
import classnames from "classnames"
import ImageContextualInfoModal from "./ImageContextualInfoModal"
import { parseURL } from "../../../lib/helpers"

export default class AtomicBlock extends React.Component {
    constructor(props) {
        super(props)

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
            case "DOCUMENT":
                return this.renderDocument(entity.getData())
            case "VIDEO":
                return this.renderVideo(entity.getData())
            case "SOCIAL":
                return this.renderSocial(entity.getData())
            default:
                return (<div></div>)
        }
    }

    @autobind
    onDelete() {
        const { editorState, onChange } = this.props.blockProps
        const { block } = this.props

        const content = editorState.getCurrentContent()
        const blockMap = content.getBlockMap().delete(block.getKey())

        let withoutAtomicBlock = content.merge({blockMap, selectionAfter: editorState.getSelection()})
        const newEditorState = EditorState.push(editorState, withoutAtomicBlock, "remove-range")
        onChange(newEditorState)
    }

    @autobind
    onClickInfo() {
        const { makeReadOnly } = this.props.blockProps
        makeReadOnly(true)
        this.refs.infoModal.toggle()
    }

    @autobind
    onSubmitInfo(alt) {
        const { makeReadOnly } = this.props.blockProps
        makeReadOnly(false)

        const { block } = this.props
        const entityKey = block.getEntityAt(0)
        Entity.mergeData(entityKey, { alt: alt })
        this.forceStateUpdate()
    }

    @autobind
    onCloseModal() {
        const { makeReadOnly } = this.props.blockProps
        makeReadOnly(false)
    }

    @autobind
    forceStateUpdate() {
        const { editorState, onChange } = this.props.blockProps
        onChange(EditorState.forceSelection(editorState, editorState.getSelection()))
    }

    @autobind
    onMouseOver(e) {
        this.setState({showMenu: true})
    }

    @autobind
    onMouseOut(e) {
        this.setState({showMenu: false})
    }

    @autobind
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

        const regex = /youtube.com\/watch\?v=(.*)/.exec(src)

        let content
        if (regex) {
            content = (
                <iframe ref="media" width={400} height={300} src={`https://www.youtube.com/embed/${regex[1]}`} frameBorder="0" allowFullScreen />
            )
        } else {
            content = (
                <img ref="media" src={src} alt={alt} />
            )
        }

        if (isEditor) {
            return (
                <div className="editor__image" onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut} style={divStyle}>
                    <div style={imageContainerStyle}>
                        {content}
                        <ImageContextualMenu
                            left={this.refs.media ? this.refs.media.offsetLeft : 0}
                            isVisible={this.state.showMenu}
                            onDelete={this.onDelete}
                            onClickInfo={this.onClickInfo}
                            onClickResize={this.onClickResize}
                        />
                    </div>
                    <ImageContextualInfoModal ref="infoModal" alt={alt} onSubmit={this.onSubmitInfo} onClose={this.onCloseModal} />
                </div>
            )
        } else {
            return (
                <div style={divStyle}>
                    <div style={imageContainerStyle}>
                        {content}
                    </div>
                </div>
            )
        }
    }

    @autobind
    renderVideo(data) {
        switch (data.platform) {
            case "youtube":
                return ( <iframe ref="media" src={`https://www.youtube.com/embed/${data.guid}`} frameBorder="0" allowFullScreen /> )
            default:
                console.error("Trying to render invalid video platform.")
                return ( <div /> )
        }

        return (
            <p className="video">
                {content}
            </p>
        )
    }

    @autobind
    renderSocial(data) {
        switch (data.platform) {
            case "instagram":
                return ( <iframe ref="media" src={`https://www.instagram.com/p/${data.guid}/embed/`} frameBorder="0" height={800} /> )
            default:
                console.error("Trying to render invalid social platform.")
                return ( <div /> )
        }
    }
}