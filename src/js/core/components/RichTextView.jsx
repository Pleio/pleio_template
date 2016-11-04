import React from "react"
import { Editor, EditorState, convertFromRaw, DefaultDraftBlockRenderMap, CompositeDecorator, ContentState, Entity } from "draft-js"
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

export default class RichTextView extends React.Component {
    constructor(props) {
        super(props)
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
                contentState = ContentState.createFromText(this.props.value)
            }
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