import React from "react"
import autobind from "autobind-decorator"
import { Entity, EditorState, Modifier, SelectionState } from "draft-js"
import ImageContextualMenu from "./ImageContextualMenu"
import classnames from "classnames"
import ImageContextualInfoModal from "./ImageContextualInfoModal"
import { parseURL } from "../../../lib/helpers"
import SocialBlock from "./SocialBlock"

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
            case "VIDEO":
                return this.renderVideo(entity.getData())
            case "SOCIAL":
                return this.renderSocial(entity.getData())
            default:
                console.error(`Trying to render an unknown atomic block type ${type}.`)
                return (<div></div>)
        }
    }

    @autobind
    onDelete() {
        const { block } = this.props
        const { editorState, onChange } = this.props.blockProps
        const contentState = editorState.getCurrentContent()

        const newContentState = contentState.merge({
            blockMap: contentState.blockMap.delete(block.key)
        })
        
        onChange(EditorState.push(editorState, newContentState, "remove-range"))
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
                <p className="video">
                    <iframe ref="media" src={`https://www.youtube.com/embed/${regex[1]}`} frameBorder="0" allowFullScreen />
                </p>
            )
        } else {
            content = (
                <img ref="media" src={src} alt={alt} />
            )
        }

        if (isEditor) {
            return (
                <div className="editor__image" onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut} style={divStyle}>
                    <div style={{margin:"0 auto"}}>
                        {content}
                        <ImageContextualMenu
                            isVisible={this.state.showMenu}
                            onDelete={this.onDelete}
                            onClickInfo={this.onClickInfo}
                        />
                    </div>
                    <ImageContextualInfoModal ref="infoModal" alt={alt} data={data} onSubmit={this.onSubmitInfo} onClose={this.onCloseModal} />
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
                return (
                    <p className="video">
                        <iframe ref="media" src={`https://www.youtube.com/embed/${data.guid}`} frameBorder="0" allowFullScreen />
                    </p>
                )
            default:
                console.error("Trying to render invalid video platform.")
        }

        return ( <div /> )
    }

    @autobind
    renderSocial(data) {
        return ( <SocialBlock url={data.url} /> )
    }
}