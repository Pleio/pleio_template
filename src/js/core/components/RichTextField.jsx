import React from "react"
import { Editor, EditorState, ContentState, RichUtils, DefaultDraftBlockRenderMap, CompositeDecorator, Entity, Modifier, convertToRaw } from "draft-js"
import { stateFromHTML } from "draft-js-import-html"
import { stateToHTML } from "draft-js-export-html"
import classnames from "classnames"
import Validator from "validatorjs"
import Select from "./NewSelect"
import Immutable from "immutable"

import LinkModal from "./RichText/LinkModal"
import ImageModal from "./RichText/ImageModal"

function findLinkEntities(contentBlock, callback) {
    contentBlock.findEntityRanges(
        (character) => {
            const entityKey = character.getEntity()

            return (
                entityKey !== null &&
                Entity.get(entityKey).getType() === "LINK"
            );
        },
        callback
    )
}

function findImageEntities(contentBlock, callback) {
    contentBlock.findEntityRanges(
        (character) => {
            const entityKey = character.getEntity()

            return (
                entityKey !== null &&
                Entity.get(entityKey).getType() === "IMAGE"
            );
        },
        callback
    )
}

const decorator = new CompositeDecorator([
    {
        strategy: findLinkEntities,
        component: (props) => {
            const { url, target } = Entity.get(props.entityKey).getData()

            return (
                <a href={url} target={target}>
                    {props.children}
                </a>
            )
        }
    },
    {
        strategy: findImageEntities,
        component: (props) => {
            const { src, width } = Entity.get(props.entityKey).getData()

            return (
                <img src={src} width={width} height={width} />
            )
        }
    }
])

class RichTextField extends React.Component {
    constructor(props) {
        super(props)

        let contentState = stateFromHTML(this.props.value || "")

        this.state = {
            editorState: EditorState.createWithContent(contentState, decorator),
            isSelectorOpen: false
        }

        this.focus = () => {
            this.refs.editor.focus()
        }

        this.onChange = this.onChange.bind(this)
        this.onTab = this.onTab.bind(this)
        this.handleKeyCommand = this.handleKeyCommand.bind(this)

        this.changeTextSize = this.changeTextSize.bind(this)
        this.toggleInlineStyle = this.toggleInlineStyle.bind(this)
        this.toggleBlockType = this.toggleBlockType.bind(this)

        this.submitLink = this.submitLink.bind(this)
        this.submitImage= this.submitImage.bind(this)

        this.isValid = this.isValid.bind(this)
        this.getValue = this.getValue.bind(this)
        this.getTextValue = this.getTextValue.bind(this)
        this.clearValue = this.clearValue.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value === this.props.value) {
            return
        }

        this.setState({
            editorState: EditorState.push(this.state.editorState, stateFromHTML(nextProps.value))
        })
    }

    componentWillMount() {
        if (this.context.attachToForm) {
            this.context.attachToForm(this)
        }
    }

    componentWillUnmount() {
        if (this.context.detachFromForm) {
            this.context.detachFromForm(this)
        }
    }

    onChange(editorState) {
        this.setState({
            editorState
        })

        if (this.props.onChange) {
            this.props.onChange()
        }
    }

    isValid() {
        if (this.props.rules) {
            let validation = new Validator({field: this.getTextValue()}, {field: this.props.rules})
            return validation.passes()
        }

        return true
    }

    getValue() {
        return stateToHTML(this.state.editorState.getCurrentContent())
    }

    getTextValue() {
        return this.state.editorState.getCurrentContent().getPlainText()
    }

    clearValue() {
        this.setState({
            editorState: EditorState.push(this.state.editorState, stateFromHTML(""))
        })
    }

    handleKeyCommand(command) {
        const newState = RichUtils.handleKeyCommand(this.state.editorState, command);
        if (newState) {
            this.onChange(newState);
            return "handled";
        }

        return "not-handled";
    }

    changeTextSize(value) {
        this.onChange(RichUtils.toggleBlockType(this.state.editorState, value))
    }

    toggleInlineStyle(inlineStyle) {
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle))
    }

    toggleBlockType(blockType) {
        this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType))
    }

    onTab(e) {
        const maxDepth = 4;
        this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth))
    }

    submitLink(url, isTargetBlank) {
        const { editorState } = this.state
        const contentState = Modifier.applyEntity(
            editorState.getCurrentContent(),
            editorState.getSelection(),
            Entity.create("LINK", "MUTABLE", {
                url,
                target: isTargetBlank ? "_blank" : null
            })
        )

        this.onChange(EditorState.push(this.state.editorState, contentState, "apply-entity"))
    }

    submitImage(src, width, height) {
        const { editorState } = this.state
        const contentState = Modifier.applyEntity(
            editorState.getCurrentContent(),
            editorState.getSelection(),
            Entity.create("IMAGE", "MUTABLE", {
                src,
                width
            })
        )

        this.onChange(EditorState.push(this.state.editorState, contentState, "apply-entity"))
    }

    render() {
        const { editorState } = this.state

        const currentInlineStyles = editorState.getCurrentInlineStyle()
        const currentBlockType = editorState.getCurrentContent().getBlockForKey(editorState.getSelection().getStartKey()).getType()

        const textSizeValue = (currentBlockType === "unstyled" || currentBlockType === "intro" || currentBlockType === "header-two" || currentBlockType == "header-three") ? currentBlockType : "unstyled"
        const textSize = (
            <div className="editor__tool-group ___no-padding">
                <Select options={{
                        "unstyled": "Normale tekst",
                        "intro": "Introtekst",
                        "header-two": "Subkop 1",
                        "header-three": "Subkop 2"
                }} onChange={this.changeTextSize} value={textSizeValue} />
            </div>
        )

        const inline = (
            <div className="editor__tool-group">
                <div onClick={(e) => this.toggleInlineStyle("BOLD")} className={classnames({
                    "editor__tool": true,
                    "___bold": true,
                    "___is-active": currentInlineStyles.has("BOLD")
                })} />
                <div onClick={() => this.toggleInlineStyle("ITALIC")} className={classnames({
                    "editor__tool": true,
                    "___italic": true,
                    "___is-active": currentInlineStyles.has("ITALIC")
                })} />
                <div onClick={() => this.toggleInlineStyle("UNDERLINE")} className={classnames({
                    "editor__tool": true,
                    "___underlined": true,
                    "___is-active": currentInlineStyles.has("UNDERLINE")
                })} />
            </div>
        )

        const richMedia = (
            <div className="editor__tool-group">
                <div className="editor__tool ___hyperlink" onClick={() => this.refs.linkModal.toggle()} />
                <div className="editor__tool ___image" onClick={() => this.refs.imageModal.toggle()} />
            </div>
        )

        const quote = (
            <div className="editor__tool-group">
                <div onClick={() => this.toggleBlockType("blockquote")} className={classnames({
                    "editor__tool": true,
                    "___quote": true,
                    "___is-active": (currentBlockType === "blockquote")
                })} />
            </div>
        )

        const lists = (
            <div className="editor__tool-group">
                <div onClick={() => this.toggleBlockType("ordered-list-item")} className={classnames({
                    "editor__tool": true,
                    "___ol": true,
                    "___is-active": (currentBlockType === "ordered-list-item")
                })} />
                <div onClick={() => this.toggleBlockType("unordered-list-item")} className={classnames({
                    "editor__tool": true,
                    "___ul": true,
                    "___is-active": (currentBlockType === "unordered-list-item")
                })} />
            </div>
        )

        const align = (
            <div className="editor__tool-group">
                <div className="editor__tool ___indent-left" />
                <div className="editor__tool ___indent-right" />
            </div>
        )

        return (
            <div className="editor">
                <div className="editor__toolbar">
                    {textSize}
                    {inline}
                    {richMedia}
                    {quote}
                    {lists}
                    {align}
                </div>
                <div className="editor__input" onClick={this.focus}>
                    <Editor
                        ref="editor"
                        handleKeyCommand={this.handleKeyCommand}
                        onTab={this.onTab}
                        placeholder={this.props.placeholder}
                        spellCheck={true}
                        onChange={this.onChange}
                        editorState={this.state.editorState}
                    />
                </div>
                <LinkModal ref="linkModal" onSubmit={this.submitLink} />
                <ImageModal ref="imageModal" onSubmit={this.submitImage} />
            </div>
        )
    }
}

RichTextField.contextTypes = {
    attachToForm: React.PropTypes.func,
    detachFromForm: React.PropTypes.func
}

export default RichTextField