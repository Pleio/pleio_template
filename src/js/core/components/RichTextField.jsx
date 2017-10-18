import React from "react"
import autobind from "autobind-decorator"
import PropTypes from "prop-types"
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
import VideoModal from "./RichText/VideoModal"
import DocumentModal from "./RichText/DocumentModal"
import SocialModal from "./RichText/SocialModal"

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

function findDocumentEntities(contentBlock, callback) {
    contentBlock.findEntityRanges(
        (character) => {
            const entityKey = character.getEntity()

            return (
                entityKey !== null &&
                Entity.get(entityKey).getType() === "DOCUMENT"
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
        strategy: findDocumentEntities,
        component: (props) => {
            const data = Entity.get(props.entityKey).getData()
            const size = Math.round(data.size / 10000) / 100

            let type
            switch (data.mimeType) {
                case "application/pdf":
                    type = "___pdf"
                    break
                default:
                    type = "___doc"
            }

            return (
                <div className={`document ${type}`}>
                    <a href={data.url} target="_blank">{props.children}</a>
                    <span contentEditable="false" suppressContentEditableWarning>({size}MB)</span>
                </div>
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
            readOnly: false,
            isSticky: false
        }

        this.focus = () => {
            this.refs.editor.focus()
        }

        this.onScroll= this.onScroll.bind(this)
        this.updateScrollbar = this.updateScrollbar.bind(this)
        this.onChange = this.onChange.bind(this)
        this.onTab = this.onTab.bind(this)
        this.handleKeyCommand = this.handleKeyCommand.bind(this)
        this.makeReadOnly = (isReadOnly) => this.setState({readOnly: isReadOnly})

        this.changeTextSize = this.changeTextSize.bind(this)
        this.toggleInlineStyle = this.toggleInlineStyle.bind(this)
        this.toggleBlockType = this.toggleBlockType.bind(this)
        this.blockRendererFn = this.blockRendererFn.bind(this)

        this.submitLink = this.submitLink.bind(this)
        this.submitDocument = this.submitDocument.bind(this)
        this.submitMedia = this.submitMedia.bind(this)

        this.isValid = this.isValid.bind(this)
        this.getValue = this.getValue.bind(this)
        this.getTextValue = this.getTextValue.bind(this)
        this.clearValue = this.clearValue.bind(this)

        this.scrolling = false

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

    componentDidMount() {
        window.addEventListener("scroll", this.onScroll)
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.onScroll)

        if (this.context.detachFromForm) {
            this.context.detachFromForm(this)
        }
    }

    onScroll(e) {
        // throttle scroll events for performance improvement
        if (this.scrolling === true) {
            return
        }

        this.scrolling = true
        this.scrollEvent = setTimeout(() => {
            this.scrolling = false
            this.updateScrollbar()
        }, 50)
    }

    updateScrollbar() {
        if (!this.refs.container) {
            return
        }

        const rect = this.refs.container.getBoundingClientRect()

        if (this.state.isSticky === false && rect.top <= 0 && rect.bottom >= 50) {
            this.setState({ isSticky: true })
        } else if (this.state.isSticky === true && (rect.top > 0 || rect.bottom < 50)) {
            this.setState({ isSticky: false })
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

    @autobind
    onEmbed(value) {
        switch (value) {
            case "image":
                this.refs.imageModal.toggle()
                break
            case "video":
                this.refs.videoModal.toggle()
                break
            case "document":
                this.refs.documentModal.toggle()
                break
            case "social":
                this.refs.socialModal.toggle()
                break
            default:
                console.error("Invalid embed value.")
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

    onTab(e) {
        const maxDepth = 4;
        this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth))
    }

    submitLink(url, isTargetBlank) {
        const { editorState } = this.state

        const entity = Entity.create("LINK", "MUTABLE", {
            url,
            target: isTargetBlank ? "_blank" : null
        })

        let contentState
        if (editorState.getSelection().getAnchorOffset() === editorState.getSelection().getFocusOffset()) {
            contentState = Modifier.insertText(
                editorState.getCurrentContent(),
                editorState.getSelection(),
                url,
                null,
                entity
            )
        } else {
            contentState = Modifier.applyEntity(
                editorState.getCurrentContent(),
                editorState.getSelection(),
                entity
            )
        }

        this.onChange(EditorState.push(this.state.editorState, contentState, "apply-entity"))
        setTimeout(() => this.focus(), 0)
    }

    submitDocument(name, data) {
        const { editorState } = this.state
        const entity = Entity.create("DOCUMENT", "MUTABLE", data)

        let contentState = Modifier.insertText(
            editorState.getCurrentContent(),
            editorState.getSelection(),
            name,
            null,
            entity
        )

        this.onChange(EditorState.push(this.state.editorState, contentState, "apply-entity"))
        setTimeout(() => this.focus(), 0)
    }

    submitMedia(type, data) {
        const { editorState } = this.state
        const entityKey = Entity.create(type, "IMMUTABLE", data)
        const newEditorState = AtomicBlockUtils.insertAtomicBlock(this.state.editorState, entityKey, " ")
        this.onChange(newEditorState)
        setTimeout(() => this.focus(), 0)
    }

    render() {
        const { editorState } = this.state

        const currentInlineStyles = editorState.getCurrentInlineStyle()
        const currentBlockType = editorState.getCurrentContent().getBlockForKey(editorState.getSelection().getStartKey()).getType()
        const contentState = editorState.getCurrentContent()

        let hidePlaceholder = false
        if (!contentState.hasText() && contentState.getBlockMap().first().getType() !== "unstyled") {
            hidePlaceholder = true
        }

        const textSizeValue = (currentBlockType === "unstyled" || currentBlockType === "intro" || currentBlockType === "paragraph" || currentBlockType === "header-two" || currentBlockType == "header-three") ? currentBlockType : "unstyled"
        const textSize = (
            <div className="editor__tool-group ___no-padding" id="editor-format">
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

        const embed = (
            <div className="editor__tool-group" id="editor-insert">
                <Select options={{
                    "image": "Afbeelding",
                    "video": "Video",
                    "document": "Document(en)",
                    "social": "Social media post"
                }} name="embed" placeholder="Invoegen" onChange={this.onEmbed} />
            </div>
        )

        let toolbarWidth
        if (this.refs.container && !this.props.isInline) {
            toolbarWidth = this.refs.container.offsetWidth - 2
        }

        return (
            <div ref="container" className={classnames({"editor": true, "___is-sticky": this.state.isSticky && !this.props.isInline, "___is-inline": this.props.isInline})}>
                <div className="editor__toolbar" style={{width:toolbarWidth}}>
                    {textSize}
                    {inline}
                    {richMedia}
                    {quote}
                    {lists}
                    {embed}
                </div>
                <div className={classnames({"content editor__input": true, "___hide-placeholder":hidePlaceholder})} onClick={this.focus}>
                    <Editor
                        ref="editor"
                        handleKeyCommand={this.handleKeyCommand}
                        onTab={this.onTab}
                        textAlignment="left"
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
                <ImageModal ref="imageModal" onSubmit={this.submitMedia} />
                <VideoModal ref="videoModal" onSubmit={this.submitMedia} />
                <DocumentModal ref="documentModal" onSubmit={this.submitDocument} />
                <SocialModal ref="socialModal" onSubmit={this.submitMedia} />
            </div>
        )
    }
}

RichTextField.contextTypes = {
    attachToForm: PropTypes.func,
    detachFromForm: PropTypes.func
}

export default RichTextField