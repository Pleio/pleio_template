import React from "react"
import { Editor, EditorState, convertFromRaw } from "draft-js"

export default class RichText extends React.Component {
    render() {
        let string;

        try {
            string = JSON.parse(this.props.value)
        } catch(e) {
            return (
                <div>
                    {this.props.value}
                </div>
            )
        }

        const contentState = convertFromRaw(string)
        const editorState = EditorState.createWithContent(contentState)

        return (
            <Editor readOnly={true} editorState={editorState} />
        )
    }
}