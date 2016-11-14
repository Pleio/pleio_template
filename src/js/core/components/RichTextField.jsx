import React from "react"
import { Editor, EditorState, ContentState, RichUtils, AtomicBlockUtils, DefaultDraftBlockRenderMap, CompositeDecorator, Entity, Modifier, convertToRaw, convertFromRaw } from "draft-js"
import { stateFromHTML } from "draft-js-import-html"
import { stateToHTML } from "draft-js-export-html"
import classnames from "classnames"
import Validator from "validatorjs"
import Select from "./NewSelect"
import Immutable from "immutable"

import AtomicBlock from "./RichText/AtomicBlock"
import IntroBlock from "./RichText/IntroBlock"

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
    }
])

const blockRenderMap = Immutable.Map({
    "paragraph": {
        element: "p"
    },
    "intro": {
        element: "div"
    }
})

const extendedBlockRenderMap = DefaultDraftBlockRenderMap.merge(blockRenderMap)

class RichTextField extends React.Component {
    constructor(props) {
        super(props)

        let contentState
        if (this.props.richValue) {
            contentState = convertFromRaw(JSON.parse(this.props.richValue))
        } else {
            contentState = ContentState.createFromText(this.props.value || "")
        }

        this.state = {
            editorState: EditorState.createWithContent(contentState, decorator),
            textAlignment: "left",
            isSelectorOpen: false,
            inBrowser: false,
            readOnly: false
        }

        this.focus = () => {
            this.refs.editor.focus()
        }

        this.onChange = this.onChange.bind(this)
        this.onTab = this.onTab.bind(this)
        this.handleKeyCommand = this.handleKeyCommand.bind(this)
        this.makeReadOnly = (isReadOnly) => this.setState({readOnly: isReadOnly})

        this.changeTextSize = this.changeTextSize.bind(this)
        this.toggleInlineStyle = this.toggleInlineStyle.bind(this)
        this.toggleBlockType = this.toggleBlockType.bind(this)
        this.changeAlignment = this.changeAlignment.bind(this)
        this.blockRendererFn = this.blockRendererFn.bind(this)

        this.submitLink = this.submitLink.bind(this)
        this.submitImage = this.submitImage.bind(this)

        this.isValid = this.isValid.bind(this)
        this.getValue = this.getValue.bind(this)
        this.getTextValue = this.getTextValue.bind(this)
        this.clearValue = this.clearValue.bind(this)

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value === this.props.value) {
            return
        }

        let contentState
        if (nextProps.richValue) {
            contentState = convertFromRaw(JSON.parse(nextProps.richValue))
        } else {
            contentState = ContentState.createFromText(nextProps.value || "")
        }

        this.setState({
            editorState: EditorState.createWithContent(contentState, decorator)
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

    componentDidMount() {
        this.setState({inBrowser: true})
    }

    onChange(editorState) {
        this.setState({
            editorState
        })

        if (this.props.onChange) {
            this.props.onChange()
        }
    }

    blockRendererFn(contentBlock) {
        const type = contentBlock.getType()
        switch(type) {
            case "atomic":
                return {
                    component: AtomicBlock,
                    editable: false,
                    props: {
                        isEditor: true,
                        makeReadOnly: this.makeReadOnly,
                        editorState: this.state.editorState,
                        onChange: this.onChange
                    }
                }
            default:
                return null
        }
    }

    blockStyleFn(block) {
        switch (block.getType()) {
            case "intro":
                return "article-intro"
            case "left":
                return "align-left"
            case "right":
                return "align-right"
            default:
                return null
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
        return this.state.editorState.getCurrentContent()
    }

    getTextValue() {
        return this.state.editorState.getCurrentContent().getPlainText()
    }

    clearValue() {
        let contentState = ContentState.createFromText(nextProps.value || "")

        this.setState({
            editorState: EditorState.createWithContent(contentState, decorator)
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
        setTimeout(() => this.focus(), 1)
    }

    toggleInlineStyle(inlineStyle) {
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle))
    }

    toggleBlockType(blockType) {
        this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType))
    }

    changeAlignment(direction) {
        this.setState({textAlignment: direction})
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
        setTimeout(() => this.focus(), 0)
    }

    submitImage(src, width, height) {
        const { editorState } = this.state
        const entityKey = Entity.create("IMAGE", "MUTABLE", {
            src,
            width,
            height,
            float: "left",
            display: "block"
        })

        const newEditorState = AtomicBlockUtils.insertAtomicBlock(this.state.editorState, entityKey, " ")
        this.onChange(newEditorState)
        setTimeout(() => this.focus(), 0)
    }

    render() {
        const { editorState } = this.state

        const currentInlineStyles = editorState.getCurrentInlineStyle()
        const currentBlockType = editorState.getCurrentContent().getBlockForKey(editorState.getSelection().getStartKey()).getType()

        const textSizeValue = (currentBlockType === "unstyled" || currentBlockType === "intro" || currentBlockType === "paragraph" || currentBlockType === "header-two" || currentBlockType == "header-three") ? currentBlockType : "unstyled"
        const textSize = (
            <div className="editor__tool-group ___no-padding">
                <Select options={{
                        "unstyled": "Normale tekst",
                        "paragraph": "Paragraaf",
                        "intro": "Introtekst",
                        "header-two": "Subkop 1",
                        "header-three": "Subkop 2"
                }} onChange={this.changeTextSize} value={textSizeValue} />
            </div>
        )

        const inline = (
            <div className="editor__tool-group">
                <div onMouseDown={(e) => { e.preventDefault(); this.toggleInlineStyle("BOLD"); }} className={classnames({
                    "editor__tool": true,
                    "___bold": true,
                    "___is-active": currentInlineStyles.has("BOLD")
                })} />
                <div onMouseDown={(e) => { e.preventDefault(); this.toggleInlineStyle("ITALIC"); }} className={classnames({
                    "editor__tool": true,
                    "___italic": true,
                    "___is-active": currentInlineStyles.has("ITALIC")
                })} />
                <div onMouseDown={(e) => { e.preventDefault(); this.toggleInlineStyle("UNDERLINE"); }} className={classnames({
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
                <div onMouseDown={(e) => { e.preventDefault(); this.toggleBlockType("blockquote"); }} className={classnames({
                    "editor__tool": true,
                    "___quote": true,
                    "___is-active": (currentBlockType === "blockquote")
                })} />
            </div>
        )

        const lists = (
            <div className="editor__tool-group">
                <div onMouseDown={(e) => { e.preventDefault(); this.toggleBlockType("ordered-list-item"); }} className={classnames({
                    "editor__tool": true,
                    "___ol": true,
                    "___is-active": (currentBlockType === "ordered-list-item")
                })} />
                <div onMouseDown={(e) => { e.preventDefault(); this.toggleBlockType("unordered-list-item"); }} className={classnames({
                    "editor__tool": true,
                    "___ul": true,
                    "___is-active": (currentBlockType === "unordered-list-item")
                })} />
            </div>
        )

        const align = (
            <div className="editor__tool-group">
                <div className="editor__tool ___indent-left" onClick={() => this.changeAlignment("left")} />
                <div className="editor__tool ___indent-right" onClick={() => this.changeAlignment("right")} />
            </div>
        )

        // do not render editor on server-side because it's output is non-deterministic
        // and will cause React to re-render.
        if (!this.state.inBrowser) {
            return (
                <div></div>
            )
        }

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
                <div className="content editor__input" onClick={this.focus}>
                    <Editor
                        ref="editor"
                        handleKeyCommand={this.handleKeyCommand}
                        onTab={this.onTab}
                        textAlignment={this.state.textAlignment}
                        placeholder={this.props.placeholder}
                        blockRenderMap={extendedBlockRenderMap}
                        blockStyleFn={this.blockStyleFn}
                        blockRendererFn={this.blockRendererFn}
                        spellCheck={true}
                        onChange={this.onChange}
                        editorState={this.state.editorState}
                        readOnly={this.state.readOnly}
                    />
                    <div style={{clear:"both"}} />
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