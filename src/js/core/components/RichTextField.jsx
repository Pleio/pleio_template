import React from "react"
import { Editor, EditorState, ContentState, RichUtils } from "draft-js"
import classnames from "classnames"
import Validator from "validatorjs"
import { stateFromHTML } from "draft-js-import-html"
import { stateToHTML } from "draft-js-export-html"

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
            <span className={classnames({"rich-editor__button":true, "___is-active": this.props.isActive})} onMouseDown={this.onMouseDown}>
                {this.props.children}
            </span>
        )
    }
}

class RichTextField extends React.Component {
    constructor(props) {
        super(props)

        let contentState = stateFromHTML(this.props.value || "")

        this.state = {
            editorState: EditorState.createWithContent(contentState)
        }

        this.focus = () => this.refs.editor.focus()

        this.onChange = this.onChange.bind(this)
        this.onTab = this.onTab.bind(this)
        this.handleKeyCommand = this.handleKeyCommand.bind(this)

        this.toggleInlineStyle = this.toggleInlineStyle.bind(this)
        this.toggleBlockType = this.toggleBlockType.bind(this)

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
            this.props.onChange
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
            value: ""
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
                        onTab={this.onTab}
                        placeholder={this.props.placeholder}
                        spellCheck={true}
                        onChange={this.onChange}
                        editorState={this.state.editorState}
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