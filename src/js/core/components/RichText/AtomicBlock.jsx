import React from "react"
import autobind from "autobind-decorator"
import { EditorState, Modifier, SelectionState } from "draft-js"
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
        const { block, contentState } = this.props

        const entityKey = block.getEntityAt(0)
        if (!entityKey) {
            console.error(`Could not find atomic block entity.`)
            return ( <div /> )
        }

        const entity = contentState.getEntity(entityKey)
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
                return ( <div /> )
        }
    }

    @autobind
    onDelete() {
        const { block, editorState } = this.props
        const { onChange } = this.props.blockProps
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
        const { editorState, contentState, block } = this.props
        const { makeReadOnly, onChange } = this.props.blockProps
        makeReadOnly(false)

        const entityKey = block.getEntityAt(0)

        const newContentState = contentState.mergeEntityData(entityKey, {
            alt
        })

        onChange(EditorState.push(editorState, contentState, "apply-entity"))
    }

    @autobind
    onCloseModal() {
        const { makeReadOnly } = this.props.blockProps
        makeReadOnly(false)
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
                    <div style={{margin:"0 auto", flex: "1"}}>
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