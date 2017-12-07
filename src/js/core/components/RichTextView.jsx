import React from "react"
import { Editor, EditorState, convertFromRaw, convertFromHTML, DefaultDraftBlockRenderMap, CompositeDecorator, ContentState, Entity } from "draft-js"
import Immutable from "immutable"

import AtomicBlock from "./RichText/AtomicBlock"
import IntroBlock from "./RichText/IntroBlock"

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
                    <span>({size}MB)</span>
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

export default class RichTextView extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            inBrowser: false
        }
    }

    componentDidMount() {
        this.setState({inBrowser: true})
    }

    blockRendererFn(contentBlock) {
        const type = contentBlock.getType()
        switch(type) {
            case "atomic":
                return {
                    component: AtomicBlock,
                    editable: false,
                    props: {
                        isEditor: false
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

    render() {
        let contentState
        if (this.props.richValue) {
            try {
                let string = JSON.parse(this.props.richValue)
                contentState = convertFromRaw(string)
            } catch (e) {
                const blocksFromHTML = convertFromHTML(this.props.value)
                contentState = ContentState.createFromBlockArray(blocksFromHTML)
            }
        } else {
            const blocksFromHTML = convertFromHTML(this.props.value || "")
            contentState = ContentState.createFromBlockArray(blocksFromHTML)
        }

        // do not render editor on server-side because it's output is non-deterministic
        // and will cause React to re-render.
        if (!this.state.inBrowser) {
            const content = contentState.getPlainText()
            return (
                <div className="content">{content}</div>
            )
        }

        const editorState = EditorState.createWithContent(contentState, decorator)

        return (
            <div className="content">
                <Editor
                    readOnly={true}
                    editorState={editorState}
                    blockRenderMap={extendedBlockRenderMap}
                    blockStyleFn={this.blockStyleFn}
                    blockRendererFn={this.blockRendererFn}
                />
                <div style={{clear:"both"}} />
            </div>
        )
    }
}