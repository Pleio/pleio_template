import React from "react"
import { Editor, EditorState, ContentState, RichUtils, convertFromRaw, convertToRaw } from "draft-js"
import classnames from "classnames"
import Joi from "joi-browser"

const INLINE_STYLES = [
    {label: "B", style: "BOLD"},
    {label: "I", style: "ITALIC"},
    {label: "U", style: "UNDERLINE"}
];

const BLOCK_TYPES = [
    {label: "H1", style: "header-one"},
    {label: "H2", style: "header-two"},
    {label: "H3", style: "header-three"},
    {label: "UL", style: "unordered-list-item"},
    {label: "OL", style: "ordered-list-item"}
];

class EditorButton extends React.Component {
    constructor(props) {
        super(props)

        this.onMouseDown = (e) => {
            e.preventDefault()
            this.props.onClick(e)
        }
    }

    render() {
        return (
            <span className={classnames({"rich-editor__button":true, "___is-active":this.props.isActive})} onMouseDown={this.onMouseDown}>
                {this.props.children}
            </span>
        )
    }
}

class RichTextField extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            editorState: this.valueToEditorState(this.props.value)
        }

        this.focus = () => this.refs.editor.focus()

        this.onChange = this.onChange.bind(this)
        this.onTab = this.onTab.bind(this)
        this.handleKeyCommand = this.handleKeyCommand.bind(this)

        this.toggleInlineStyle = this.toggleInlineStyle.bind(this)
        this.toggleBlockType = this.toggleBlockType.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            editorState: this.valueToEditorState(nextProps.value)
        })
    }

    componentWillMount() {
        this.context.attachToForm(this)
    }

    componentWillUnmount() {
        this.context.detachFromForm(this)
    }

    valueToEditorState(inputValue) {
        try {
            const string = JSON.parse(this.props.value)
            return EditorState.createWithContent(convertFromRaw(string))
        } catch(e) {
            const string = this.props.value || ""
            const contentState = ContentState.createFromText(string)
            return EditorState.createWithContent(contentState)
        }
    }

    onChange(editorState) {
        console.log('Changed editor state')
        this.setState({
            editorState
        })

        if (this.props.onChange) {
            this.props.onChange(editorState)
        }
    }

    handleKeyCommand(command) {
        const newState = RichUtils.handleKeyCommand(this.state.editorState, command);
        if (newState) {
            this.onChange(newState);
            return "handled";
        }

        return "not-handled";
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

    getValue() {
        return JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent()))
    }

    isValid() {
        return Joi.validate(this.state.editorState.getCurrentContent().getPlainText(), this.props.validate)
    }

    render() {
        const { editorState } = this.state

        const currentInlineStyles = editorState.getCurrentInlineStyle()
        const inlineStyles = INLINE_STYLES.map((type, i) => (
            <EditorButton key={i} onClick={() => this.toggleInlineStyle(type.style)} isActive={currentInlineStyles.has(type.style)}>
                {type.label}
            </EditorButton>
        ))

        const selection = editorState.getSelection()
        const blockType = editorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getType()
        const blockTypes = BLOCK_TYPES.map((type, i) => (
            <EditorButton key={i} onClick={() => this.toggleBlockType(type.style)} isActive={type.style === blockType}>
                {type.label}
            </EditorButton>
        ))

        return (
            <div>
                <div className="rich-editor__controls">
                    {inlineStyles}
                    {blockTypes}
                </div>
                <div className="rich-editor__editor" onClick={this.focus}>
                    <Editor
                        ref="editor"
                        handleKeyCommand={this.handleKeyCommand}
                        editorState={this.state.editorState}
                        onChange={this.onChange}
                        onTab={this.onTab}
                        placeholder={this.props.placeholder}
                        spellCheck={true}
                    />
                </div>
            </div>
        )
    }
}

RichTextField.contextTypes = {
    attachToForm: React.PropTypes.func,
    detachFromForm: React.PropTypes.func
}

export default RichTextField