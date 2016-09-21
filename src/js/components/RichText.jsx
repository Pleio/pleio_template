import React from 'react'
import {Editor} from 'draft-js'

export default class RichText extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Editor editorState={this.props.value} onChange={this.props.onChange} placeholder={this.props.placeholder} />
        )
    }
}