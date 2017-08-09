import React from "react"
import { convertFromRaw } from "draft-js"
import RichTextView from "../../core/components/RichTextView"
import autobind from "autobind-decorator"

export default class Introduction extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isVisible: true,
            height: "auto"
        }
    }

    @autobind
    onClose(e) {
        this.setState({ height: this.refs.card.offsetHeight })

        setTimeout(() => {
            this.setState({ isVisible: false })
        }, 10)
    }

    render() {
        const { entity } = this.props
        let text


        if (entity.introduction) {
            text = convertFromRaw(JSON.parse(entity.introduction)).hasText()
        }

        if (!text) {
            return (
                <div />
            )
        }

        let style
        if (!this.state.isVisible) {
            style = { display: "none" }
        }

        return (
            <div ref="card" className="card ___indent ___info" style={style}>
                <div className="card__close" onClick={this.onClose}>

                </div>
                <div className="picture" />
                <div className="card__content">
                    <RichTextView richValue={entity.introduction} />
                </div>
            </div>
        )
    }
}